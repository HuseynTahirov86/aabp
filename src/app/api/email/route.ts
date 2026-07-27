import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { requireAdmin, verifyRequestUser } from '@/lib/firebase/require-auth';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'mail.aabporg.uk',
  port: Number(process.env.SMTP_PORT) || 465,
  secure: true, // true for 465, false for other ports
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
    const body = await req.json();
    const { email, firstName, type } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // The public contact form is intentionally open. Every other email
    // type sends AABP-branded mail to an arbitrary address, so it must
    // be triggered by an authenticated request — APPROVAL additionally
    // requires an admin, since only admins should trigger it.
    if (type === 'APPROVAL') {
      const admin = await requireAdmin(req);
      if (!admin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    } else if (type !== 'CONTACT') {
      const user = await verifyRequestUser(req);
      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    let subject = 'Hello from AABP';
    let htmlContent = '<p>Thank you for connecting with AABP.</p>';

    if (type === 'WELCOME') {
      subject = 'Welcome to AABP - Your Application is Received';
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2 style="color: #003366;">Welcome to AABP, ${firstName || 'Professional'}!</h2>
          <p>Thank you for submitting your application to join the <strong>Association of Azerbaijan British Professionals</strong>.</p>
          <p>We have received your details and our team will review your application shortly. You can now access the member portal to complete your profile and explore our network.</p>
          <br/>
          <p>Best regards,<br/><strong>The AABP Executive Committee</strong></p>
        </div>
      `;
    } else if (type === 'CONTACT') {
      const { name, subject: reqSubject, message } = body;
      subject = `New Contact Form Submission: ${reqSubject || 'No Subject'}`;
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2 style="color: #003366;">New Message from AABP Contact Form</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #003366;">
            ${message}
          </div>
        </div>
      `;
    } else if (type === 'APPROVAL') {
      subject = 'Your AABP Membership Has Been Approved';
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2 style="color: #003366;">Congratulations, ${firstName || 'Member'}!</h2>
          <p>Your membership application for the <strong>Association of Azerbaijan British Professionals</strong> has been approved.</p>
          <p>You now have full access to member features including events, networking opportunities, and exclusive content.</p>
          <p>Log in to your account to get started.</p>
          <br/>
          <p>Best regards,<br/><strong>The AABP Executive Committee</strong></p>
        </div>
      `;
    } else if (type === 'EVENT_CONFIRMATION') {
      const { eventTitle, eventDate } = body;
      subject = `Registration Confirmed: ${eventTitle || 'Event'}`;
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2 style="color: #003366;">Registration Confirmed, ${firstName || 'Member'}!</h2>
          <p>You have successfully registered for <strong>${eventTitle || 'the event'}</strong>.</p>
          <p><strong>Date:</strong> ${eventDate || 'TBA'}</p>
          <p>We look forward to seeing you there. If you have any questions, please feel free to contact us.</p>
          <br/>
          <p>Best regards,<br/><strong>The AABP Executive Committee</strong></p>
        </div>
      `;
    }

    const adminEmail = process.env.CONTACT_EMAIL || process.env.SMTP_EMAIL || 'contact@aabporg.uk';
    const senderEmail = process.env.SMTP_EMAIL || 'contact@aabporg.uk';

    const mailOptions = {
      from: `"AABP Platform" <${senderEmail}>`,
      to: type === 'CONTACT' ? adminEmail : email, 
      replyTo: type === 'CONTACT' ? email : undefined,
      subject: subject,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, data: info.messageId });
  } catch (error) {
    console.error('Email send error:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
