import { connectDB } from '@/lib/db';
import { CharDhamBooking } from '@/models/CharDhamBooking';
import { CharDhamPackage } from '@/models/CharDhamPackage';
import { getAuthUser } from '@/lib/authGuard';
import { success, error } from '@/lib/apiResponse';

export async function POST(request, { params }) {
  const id = params?.id;
  if (!id) return error('Booking id required', 400);

  let body = {};
  try {
    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      body = await request.json();
    }
  } catch (_) {}

  const cancelToken = (body?.cancelToken ?? '').trim();
  const user = await getAuthUser(request);

  try {
    await connectDB();

    const booking = await CharDhamBooking.findById(id).lean();
    if (!booking) return error('Booking not found', 404);

    // Allow cancel by token (no auth cookie needed – works on live when cookie isn't sent)
    const tokenValid = cancelToken && booking.cancelToken && booking.cancelToken === cancelToken;
    const ownerValid = user && booking.userId?.toString() === user._id?.toString();

    if (!tokenValid && !ownerValid) {
      return error('Login required or invalid cancel token', 401);
    }

    if (booking.bookingStatus === 'cancelled') {
      return success({ cancelled: true });
    }

    // Don't restore seats for already-paid bookings.
    if (booking.paymentStatus === 'paid') {
      return error('Booking already paid', 400);
    }

    // Restore seats back
    if (booking.packageId) {
      await CharDhamPackage.updateOne(
        { _id: booking.packageId },
        { $inc: { seatsAvailable: booking.seats } }
      );
    }

    await CharDhamBooking.updateOne(
      { _id: id },
      {
        bookingStatus: 'cancelled',
        paymentStatus: 'failed',
      }
    );

    return success({ cancelled: true });
  } catch (e) {
    console.error('CharDham cancel error:', e);
    return error('Failed to cancel booking', 500);
  }
}

