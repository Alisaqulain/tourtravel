/**
 * Create a notification for a user. Use from API routes (e.g. after booking success).
 */

import { connectDB } from '@/lib/db';
import { Notification } from '@/models/Notification';

/**
 * @param {{ userId: string, title: string, message?: string, link?: string, type?: 'booking'|'payment'|'offer'|'system' }}
 */
export async function createNotification({ userId, title, message, link, type = 'system' }) {
  if (!userId || !title) return;
  try {
    await connectDB();
    await Notification.create({
      userId,
      title,
      message: message || '',
      link: link || '',
      type,
    });
  } catch (e) {
    console.error('Create notification error:', e);
  }
}
