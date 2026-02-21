/**
 * POST /api/contact – save message to MongoDB (email-ready structure).
 * Body: { name, email, subject, message }
 */
import { connectDB } from '@/lib/db';
import { Contact } from '@/models/Contact';
import { success, error } from '@/lib/apiResponse';

const nameMax = 120;
const subjectMax = 200;
const messageMax = 5000;

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
    return success(
      { id: doc._id, name: doc.name, email: doc.email, subject: doc.subject, createdAt: doc.createdAt },
      'Message sent successfully'
    );
  } catch (e) {
    console.error('Contact API error:', e);
    return error(e.message || 'Failed to send message', 500);
  }
}
