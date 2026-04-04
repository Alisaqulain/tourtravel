/**
 * POST /api/contact – save message to MongoDB and email to SMTP_MAIL_FROM.
 * Body: { name, email, subject, message }
 */
import { connectDB } from '@/lib/db';
import { Contact } from '@/models/Contact';
import { success, error } from '@/lib/apiResponse';
import { sendEmail } from '@/lib/email';

const nameMax = 120;
const subjectMax = 200;
const messageMax = 5000;

const RECIPIENT_EMAIL = process.env.SMTP_MAIL_FROM || 'info@triptotravels.in';

export async function POST(request) {
  try {
    const body = await request.json();
    const name = typeof body.name === 'string' ? body.name.trim().slice(0, nameMax) : '';
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const subject = typeof body.subject === 'string' ? body.subject.trim().slice(0, subjectMax) : '';
    const message = typeof body.message === 'string' ? body.message.trim().slice(0, messageMax) : '';

    if (!name || !email || !message) {
      return error('Name, email and message are required', 400);
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return error('Invalid email address', 400);
    }

    await connectDB();
    const doc = await Contact.create({ name, email, subject, message });

    // Send contact form data to your inbox (SMTP_MAIL_FROM)
    const emailSubject = subject ? `Contact: ${subject}` : 'New contact form submission';
    const html = `
      <div style="font-family: sans-serif; max-width: 560px;">
        <h2>New contact form message</h2>
        <p><strong>From:</strong> ${name} &lt;${email}&gt;</p>
        ${subject ? `<p><strong>Subject:</strong> ${subject}</p>` : ''}
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap;">${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
        <p style="color: #666; font-size: 12px;">Submitted at ${doc.createdAt?.toISOString?.() || new Date().toISOString()}</p>
      </div>
    `;
    const text = `From: ${name} <${email}>\n${subject ? `Subject: ${subject}\n` : ''}\n${message}`;
    const emailResult = await sendEmail(RECIPIENT_EMAIL, emailSubject, html, text);
    if (!emailResult.sent) {
      console.warn('Contact form: email not sent to inbox:', emailResult.error);
    }

    return success(
      { id: doc._id, name: doc.name, email: doc.email, subject: doc.subject, createdAt: doc.createdAt },
      'Message sent successfully'
    );
  } catch (e) {
    console.error('Contact API error:', e);
    return error(e.message || 'Failed to send message', 500);
  }
}
