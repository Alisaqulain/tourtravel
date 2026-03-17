import { connectDB } from '@/lib/db';
import { CharDhamBooking } from '@/models/CharDhamBooking';
import { CharDhamPackage } from '@/models/CharDhamPackage';
import { getAuthUser } from '@/lib/authGuard';
import { success, error } from '@/lib/apiResponse';

export async function POST(request, { params }) {
  const user = await getAuthUser(request);
  if (!user) return error('Login required', 401);

  const id = params?.id;
  if (!id) return error('Booking id required', 400);

  try {
    await connectDB();

    const booking = await CharDhamBooking.findById(id).lean();
    if (!booking) return error('Booking not found', 404);

    console.log('[CharDham][Cancel] request', {
      bookingId: id,
      userId: user._id?.toString(),
      bookingUserId: booking.userId?.toString?.() || booking.userId,
      paymentStatus: booking.paymentStatus,
      bookingStatus: booking.bookingStatus,
      seats: booking.seats,
      packageId: booking.packageId?._id || booking.packageId,
    });

    // Only allow owner of booking
    if (booking.userId?.toString() !== user._id.toString()) {
      return error('Forbidden', 403);
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

