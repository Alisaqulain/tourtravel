import { connectDB } from '@/lib/db';
import { MarketplaceBooking } from '@/models/marketplace/Booking';
import { getMarketplaceUser } from '@/lib/marketplaceAuth';
import { getRazorpayInstance } from '@/lib/razorpay';
import { error, success } from '@/lib/apiResponse';

export async function POST(request) {
  const { user, response } = await getMarketplaceUser(request);
  if (response) return response;

  const razorpay = getRazorpayInstance();
  if (!razorpay) return error('Payment not configured', 503);

  try {
    const body = await request.json();
    const bookingId = body?.bookingId;
    if (!bookingId) return error('bookingId required', 400);

    await connectDB();
    const booking = await MarketplaceBooking.findOne({ _id: bookingId, userId: user._id });
    if (!booking) return error('Booking not found', 404);
    if (booking.paymentStatus !== 'pending') return error('Booking already paid or cancelled', 400);

    const amountPaise = Math.round(booking.totalAmount * 100);
    if (amountPaise < 100) return error('Invalid amount', 400);

    const order = await razorpay.orders.create({
      amount: amountPaise,
      currency: 'INR',
      receipt: booking._id.toString(),
    });

    await MarketplaceBooking.updateOne(
      { _id: bookingId },
      { $set: { razorpayOrderId: order.id } }
    );

    return success({
      orderId: order.id,
      amount: amountPaise,
      currency: 'INR',
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (e) {
    console.error('Marketplace create order error:', e);
    return error(e.message || 'Failed', 500);
  }
}
