import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { getAdminDb } from '@/lib/firebase/admin';
import { requireAdmin } from '@/lib/firebase/require-auth';
import type { Query } from 'firebase-admin/firestore';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'mail.aabporg.uk',
  port: Number(process.env.SMTP_PORT) || 465,
  secure: true,
  auth: {
    user: process.env.SMTP_EMAIL || 'contact@aabporg.uk',
    pass: process.env.SMTP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false
  }
});

export async function POST(req: Request) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { subject, message, filter } = body;

    if (!subject || !message) {
      return NextResponse.json({ error: 'Subject and message are required' }, { status: 400 });
    }

    const db = await getAdminDb();
    if (!db) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }

    const usersRef = db.collection('users');
    const dbQuery: Query = filter && filter !== 'all'
      ? usersRef.where('role', '==', filter)
      : usersRef;

    const snapshot = await dbQuery.get();
    const users = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    const senderEmail = process.env.SMTP_EMAIL || 'contact@aabporg.uk';
    let sentCount = 0;

    for (const user of users) {
      const userData = user as Record<string, unknown>;
      const email = userData.email as string | undefined;
      if (!email) continue;

      try {
        await transporter.sendMail({
          from: `"AABP Platform" <${senderEmail}>`,
          to: email,
          subject,
          html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
            ${message.replace(/\n/g, '<br/>')}
          </div>`,
        });
        sentCount++;
      } catch (err) {
        console.error(`Failed to send email to ${email}:`, err);
      }
    }

    return NextResponse.json({ success: true, count: sentCount, total: users.length });
  } catch (error) {
    console.error('Admin email send error:', error);
    return NextResponse.json({ error: 'Failed to send emails' }, { status: 500 });
  }
}
