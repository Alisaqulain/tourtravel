import { connectDB } from '@/lib/db';
import { CharDhamBooking } from '@/models/CharDhamBooking';
import { getRazorpayInstance } from '@/lib/razorpay';
import { success, error } from '@/lib/apiResponse';

export async function POST(request) {
  const razorpay = getRazorpayInstance();
  if (!razorpay) return error('Payment not configured', 503);

  try {
    const body = await request.json();
    const id = body?.id || body?.bookingId;
    if (!id) return error('Booking id is required', 400);

    await connectDB();
    const booking = await CharDhamBooking.findById(id);
    if (!booking) return error('Booking not found', 404);
    if (booking.paymentStatus === 'paid') return error('Already paid', 400);

    const amountPaise = Math.round(Number(booking.totalAmount) * 100);
    if (amountPaise < 100) return error('Invalid amount', 400);

    const order = await razorpay.orders.create({
      amount: amountPaise,
      currency: 'INR',
      receipt: booking.bookingId || id,
    });

    await CharDhamBooking.updateOne({ _id: id }, { $set: { razorpayOrderId: order.id } });

    return success({
      orderId: order.id,
      amount: amountPaise,
      currency: 'INR',
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (e) {
    console.error('CharDham order create:', e);
    return error(e.message || 'Failed to create order', 500);
  }
}
