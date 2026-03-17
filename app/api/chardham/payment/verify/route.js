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

    await connectDB();

    const booking = await CharDhamBooking.findById(id);
    if (!booking) return error('Booking not found', 404);

    console.log('[CharDham][Verify] incoming', {
      id,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    const valid = verifySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      keySecret
    );

    // If signature/payment is invalid, restore seats and mark booking cancelled.
    if (!valid) {
      console.log('[CharDham][Verify] invalid signature -> cancelling booking + restoring seats', { id });
      const pkgId = booking.packageId?._id || booking.packageId;
      if (pkgId) {
        await import('@/models/CharDhamPackage').then(({ CharDhamPackage }) =>
          CharDhamPackage.updateOne({ _id: pkgId }, { $inc: { seatsAvailable: booking.seats } })
        );
      }
      await booking.updateOne({
        paymentStatus: 'failed',
        bookingStatus: 'cancelled',
      });
      return error('Invalid signature', 400);
    }

    const updated = await CharDhamBooking.findByIdAndUpdate(
      id,
      {
        paymentStatus: 'paid',
        bookingStatus: 'confirmed',
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
      },
      { new: true }
    ).lean();

    if (!updated) return error('Booking not found', 404);

    // Send confirmation email (acts as reminder + confirmation)
    try {
      const pkg = await CharDhamPackage.findById(updated.packageId).lean();
      const baseUrl = getEmailBaseUrl(request);
      const travelDate = updated.travelDate ? new Date(updated.travelDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
      const message = [
        `Your Char Dham booking is confirmed.`,
        pkg?.name ? `Package: ${pkg.name}` : '',
        `Seats: ${updated.seats}`,
        travelDate ? `Travel date: ${travelDate}` : '',
        `Total paid: ₹${updated.totalAmount}`,
        updated.discountPercent ? `Discount applied: ${updated.discountPercent}%` : '',
      ].filter(Boolean).join('\n');

      await sendNotificationEmail(
        updated.email,
        `Char Dham booking confirmed ${updated.bookingId || ''}`.trim(),
        'Char Dham booking confirmed',
        message,
        `${baseUrl}/my-bookings`,
        'View my bookings'
      );
    } catch (e) {
      // don't block payment success if email fails
      console.error('CharDham confirmation email error:', e?.message || e);
    }

    return success({ verified: true, bookingId: updated.bookingId });
  } catch (e) {
    console.error('CharDham verify:', e);
    return error('Verification failed', 500);
  }
}
