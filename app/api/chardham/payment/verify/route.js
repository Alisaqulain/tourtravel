import crypto from 'crypto';
import { connectDB } from '@/lib/db';
import { CharDhamBooking } from '@/models/CharDhamBooking';
import { success, error } from '@/lib/apiResponse';
import { sendNotificationEmail, getEmailBaseUrl } from '@/lib/email';
import { CharDhamPackage } from '@/models/CharDhamPackage';

function verifySignature(orderId, paymentId, signature, secret) {
  const body = orderId + '|' + paymentId;
  const expected = crypto.createHmac('sha256', secret).update(body).digest('hex');
  return expected === signature;
}

export async function POST(request) {
  const keySecret = (process.env.RAZORPAY_KEY_SECRET || '').trim();
  if (!keySecret) return error('Payment not configured', 503);

  try {
    const body = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, id } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !id) {
      return error('Missing payment or booking details', 400);
    }

    const valid = verifySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      keySecret
    );
    if (!valid) return error('Invalid signature', 400);

    await connectDB();
    const booking = await CharDhamBooking.findByIdAndUpdate(
      id,
      {
        paymentStatus: 'paid',
        bookingStatus: 'confirmed',
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
      },
      { new: true }
    ).lean();

    if (!booking) return error('Booking not found', 404);

    // Send confirmation email (acts as reminder + confirmation)
    try {
      const pkg = await CharDhamPackage.findById(booking.packageId).lean();
      const baseUrl = getEmailBaseUrl(request);
      const travelDate = booking.travelDate ? new Date(booking.travelDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
      const message = [
        `Your Char Dham booking is confirmed.`,
        pkg?.name ? `Package: ${pkg.name}` : '',
        `Seats: ${booking.seats}`,
        travelDate ? `Travel date: ${travelDate}` : '',
        `Total paid: ₹${booking.totalAmount}`,
        booking.discountPercent ? `Discount applied: ${booking.discountPercent}%` : '',
      ].filter(Boolean).join('\n');

      await sendNotificationEmail(
        booking.email,
        `Char Dham booking confirmed ${booking.bookingId || ''}`.trim(),
        'Char Dham booking confirmed',
        message,
        `${baseUrl}/my-bookings`,
        'View my bookings'
      );
    } catch (e) {
      // don't block payment success if email fails
      console.error('CharDham confirmation email error:', e?.message || e);
    }

    return success({ verified: true, bookingId: booking.bookingId });
  } catch (e) {
    console.error('CharDham verify:', e);
    return error('Verification failed', 500);
  }
}
