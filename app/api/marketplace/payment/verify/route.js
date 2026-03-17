import crypto from 'crypto';
import { connectDB } from '@/lib/db';
import { MarketplaceBooking } from '@/models/marketplace/Booking';
import { Room } from '@/models/marketplace/Room';
import { HotelWallet } from '@/models/marketplace/HotelWallet';
import { error, success } from '@/lib/apiResponse';

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
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = body;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !bookingId) {
      return error('Missing payment details', 400);
    }

    const valid = verifySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature, keySecret);
    if (!valid) return error('Invalid signature', 400);

    await connectDB();
    const booking = await MarketplaceBooking.findById(bookingId);
    if (!booking) return error('Booking not found', 404);
    if (booking.paymentStatus === 'paid') return success({ message: 'Already paid' });

    booking.paymentStatus = 'paid';
    booking.razorpayPaymentId = razorpay_payment_id;
    await booking.save();

    let wallet = await HotelWallet.findOne({ hotelId: booking.hotelId });
    if (!wallet) wallet = await HotelWallet.create({ hotelId: booking.hotelId });
    wallet.totalEarnings += booking.hotelEarning;
    wallet.availableBalance += booking.hotelEarning;
    await wallet.save();

    return success({ message: 'Payment successful', bookingId: booking._id });
  } catch (e) {
    console.error('Marketplace payment verify error:', e);
    return error(e.message || 'Verification failed', 500);
  }
}
