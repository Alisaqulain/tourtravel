/**
 * Create a notification for a user and optionally send a professional email (booking, payment, offer).
 */

import { connectDB } from '@/lib/db';
import { Notification } from '@/models/Notification';
import { User } from '@/models/User';
import { sendNotificationEmail, sendOfferEmail } from '@/lib/email';

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

    // Send professional email for booking, payment, or offer (fire-and-forget)
    const emailTypes = ['booking', 'payment', 'offer'];
    if (emailTypes.includes(type)) {
      User.findById(userId)
        .select('email')
        .lean()
        .then((user) => {
          if (!user?.email) return;
          const subject = `${title} | Triptotravels`;
          if (type === 'offer') {
            sendOfferEmail(user.email, subject, title, message, link || '/offers', 'View offer').catch((err) =>
              console.error('Offer email error:', err)
            );
          } else {
            sendNotificationEmail(user.email, subject, title, message, link || '/my-bookings', 'View my bookings').catch((err) =>
              console.error('Notification email error:', err)
            );
          }
        })
        .catch((e) => console.error('CreateNotification: user lookup', e));
    }
  } catch (e) {
    console.error('Create notification error:', e);
  }
}
