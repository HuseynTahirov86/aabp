import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = "noreply@aabporg.uk";

export async function sendWelcomeEmail(to: string, name: string) {
  try {
    const data = await resend.emails.send({
      from: `AABP Network <${FROM_EMAIL}>`,
      to,
      subject: "Welcome to AABP - Your Membership Application",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h1 style="color: #0A192F;">Welcome, ${name}!</h1>
          <p>Thank you for applying to the Association of Azerbaijani British Professionals (AABP).</p>
          <p>Your application has been received and is currently under review by our executive committee. We strive to process all applications within 3-5 business days.</p>
          <p>Once approved, you will gain full access to the member portal, research hub, and exclusive event registrations.</p>
          <br/>
          <p>Best regards,</p>
          <p><strong>The AABP Executive Committee</strong></p>
        </div>
      `,
    });
    return { success: true, data };
  } catch (error) {
    console.error("Email send error:", error);
    return { success: false, error };
  }
}

export async function sendEventRSVPEmail(to: string, name: string, eventTitle: string, date: string) {
  try {
    const data = await resend.emails.send({
      from: `AABP Events <${FROM_EMAIL}>`,
      to,
      subject: `RSVP Confirmed: ${eventTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2 style="color: #0A192F;">Registration Confirmed!</h2>
          <p>Hi ${name},</p>
          <p>Your RSVP for <strong>${eventTitle}</strong> has been confirmed.</p>
          <p><strong>Date:</strong> ${date}</p>
          <p>We look forward to seeing you there. A calendar invite has been attached (or will be sent shortly).</p>
          <br/>
          <p>Best regards,</p>
          <p><strong>AABP Events Team</strong></p>
        </div>
      `,
    });
    return { success: true, data };
  } catch (error) {
    console.error("Email send error:", error);
    return { success: false, error };
  }
}
