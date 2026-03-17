import { connectDB } from '@/lib/db';
import { CharDhamBooking } from '@/models/CharDhamBooking';
import { CharDhamPackage } from '@/models/CharDhamPackage';
import { requireAdminAuth } from '@/lib/adminGuard';
import { success, error } from '@/lib/apiResponse';

export async function GET(request, { params }) {
  const { response } = await requireAdminAuth(request);
  if (response) return response;
  const id = params?.id;
  if (!id) return error('ID required', 400);
  try {
    await connectDB();
    const booking = await CharDhamBooking.findById(id).populate('packageId').lean();
    if (!booking) return error('Booking not found', 404);
    return success({ ...booking, id: booking._id?.toString() });
  } catch (e) {
    console.error('Admin chardham booking GET:', e);
    return error('Failed to load', 500);
  }
}

export async function PATCH(request, { params }) {
  const { response } = await requireAdminAuth(request);
  if (response) return response;
  const id = params?.id;
  if (!id) return error('ID required', 400);
  try {
    const body = await request.json();
    const { bookingStatus, paymentStatus } = body || {};
    await connectDB();
    const update = {};
    if (bookingStatus !== undefined) update.bookingStatus = bookingStatus;
    if (paymentStatus !== undefined) update.paymentStatus = paymentStatus;
    const booking = await CharDhamBooking.findByIdAndUpdate(id, { $set: update }, { new: true }).lean();
    if (!booking) return error('Booking not found', 404);
    if (bookingStatus === 'cancelled') {
      const pkgId = booking.packageId?._id || booking.packageId;
      if (pkgId) {
        await CharDhamPackage.updateOne(
          { _id: pkgId },
          { $inc: { seatsAvailable: booking.seats } }
        );
      }
    }
    return success({ booking: { ...booking, id: booking._id?.toString() } });
  } catch (e) {
    console.error('Admin chardham booking PATCH:', e);
    return error(e.message || 'Failed to update', 500);
  }
}
