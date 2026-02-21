import crypto from 'crypto';
import { connectDB } from '@/lib/db';
import { Booking } from '@/models/Booking';
import { success, error } from '@/lib/apiResponse';
import { createNotification } from '@/lib/createNotification';

function verifyPaymentSignature(orderId, paymentId, signature, secret) {
  const body = orderId + '|' + paymentId;
  const expected = crypto.createHmac('sha256', secret).update(body).digest('hex');
  return expected === signature;
}

export async function POST(request) {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
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

    if (!valid) {
      await connectDB();
      if (bookingId) {
        await Booking.findOneAndUpdate(
          { bookingId },
          { status: 'failed' }
        );
      }
      return error('Invalid signature', 400);
    }

    await connectDB();
    if (bookingId) {
      const booking = await Booking.findOneAndUpdate(
        { bookingId },
        {
          status: 'paid',
          paymentOrderId: razorpay_order_id,
          paymentId: razorpay_payment_id,
        },
        { new: true }
      );
      if (booking?.userId) {
        await createNotification({
          userId: booking.userId.toString(),
          title: 'Payment successful',
          message: `Booking ${bookingId} confirmed. Amount ₹${booking.total}.`,
          link: '/my-bookings',
          type: 'payment',
        });
      }
    }

    return success({ verified: true });
  } catch (e) {
    console.error('Verify payment error:', e);
    return error('Verification failed', 500);
  }
}
