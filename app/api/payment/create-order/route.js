import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Booking } from '@/models/Booking';
import { getRazorpayInstance } from '@/lib/razorpay';
import { getAuthUser } from '@/lib/authGuard';
import { success, error } from '@/lib/apiResponse';

/**
 * Create Razorpay order for an existing booking. Amount is recalculated from DB (never trust frontend).
 * Flow: 1) POST /api/bookings creates pending booking. 2) POST here with bookingId. 3) Frontend pays. 4) POST /api/payment/verify.
 */
export async function POST(request) {
  const user = await getAuthUser(request);
  if (!user) return error('Login required', 401);

  const razorpay = getRazorpayInstance();
  if (!razorpay) return error('Payment not configured', 503);

  try {
    const body = await request.json();
    const bookingId = typeof body?.bookingId === 'string' ? body.bookingId.trim() : null;
    if (!bookingId) return error('bookingId is required', 400);

    await connectDB();
    const booking = await Booking.findOne({ bookingId, userId: user._id });
    if (!booking) return error('Booking not found', 404);
    if (booking.status !== 'pending') return error('Booking is not pending payment', 400);

    // Recalculate amount on server – never use frontend amount for creation
    const subtotal = Number(booking.subtotal) || 0;
    const tax = Number(booking.tax) || 0;
    const total = Math.max(0, subtotal + tax);
    const amountPaise = Math.round(total * 100);
    if (amountPaise < 100) return error('Invalid booking amount', 400);

    const order = await razorpay.orders.create({
      amount: amountPaise,
      currency: booking.currency || 'INR',
      receipt: bookingId,
    });

    await Booking.updateOne(
      { bookingId },
      { $set: { paymentOrderId: order.id } }
    );

    return success({
      orderId: order.id,
      amount: amountPaise,
      currency: booking.currency || 'INR',
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (e) {
    console.error('Create order error:', e);
    return error(e.message || 'Failed to create order', 500);
  }
}
