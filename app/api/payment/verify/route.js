import crypto from 'crypto';
import { connectDB } from '@/lib/db';
import { Booking } from '@/models/Booking';
import { Payment } from '@/models/Payment';
import { success, error } from '@/lib/apiResponse';
import { createNotification } from '@/lib/createNotification';
import { sendBookingConfirmationEmail } from '@/lib/email';

function verifyPaymentSignature(orderId, paymentId, signature, secret) {
  const body = orderId + '|' + paymentId;
  const expected = crypto.createHmac('sha256', secret).update(body).digest('hex');
  return expected === signature;
}

export async function POST(request) {
  const keySecret = (process.env.RAZORPAY_KEY_SECRET || '').trim();
  if (!keySecret) return error('Payment not configured', 503);

  try {
    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingId,
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return error('Missing payment details', 400);
    }

    const valid = verifyPaymentSignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      keySecret
    );

    await connectDB();

    if (!valid) {
      if (bookingId) {
        await Booking.findOneAndUpdate({ bookingId }, { status: 'failed' });
        const booking = await Booking.findOne({ bookingId }).lean();
        if (booking?.userId) {
          await Payment.create({
            userId: booking.userId,
            bookingId,
            amount: booking.total || 0,
            currency: booking.currency || 'INR',
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            payment_status: 'failed',
          }).catch(() => {});
        }
      }
      return error('Invalid signature', 400);
    }

    let booking = null;
    if (bookingId) {
      booking = await Booking.findOneAndUpdate(
        { bookingId },
        {
          status: 'paid',
          paymentOrderId: razorpay_order_id,
          paymentId: razorpay_payment_id,
        },
        { new: true }
      ).lean();

      if (booking?.userId) {
        await Payment.findOneAndUpdate(
          { razorpay_order_id },
          {
            razorpay_payment_id,
            razorpay_signature,
            payment_status: 'captured',
          }
        ).catch(() => {});

        await createNotification({
          userId: booking.userId.toString(),
          title: 'Payment successful',
          message: `Booking ${bookingId} confirmed. Amount ₹${booking.total}.`,
          link: '/my-bookings',
          type: 'payment',
        });

        const user = await import('@/models/User').then((m) => m.User.findById(booking.userId).lean());
        if (user?.email) {
          sendBookingConfirmationEmail(user.email, user.name || 'Guest', bookingId, booking).catch((err) =>
            console.error('Confirmation email error:', err)
          );
        }
      }
    }

    return success({ verified: true, bookingId: booking?.bookingId });
  } catch (e) {
    console.error('Verify payment error:', e);
    return error('Verification failed', 500);
  }
}
