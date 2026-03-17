import { connectDB } from '@/lib/db';
import { CharDhamBooking } from '@/models/CharDhamBooking';
import { getAuthUser } from '@/lib/authGuard';
import { success, error } from '@/lib/apiResponse';

export async function GET(request) {
  const user = await getAuthUser(request);
  if (!user) return error('Login required', 401);

  try {
    await connectDB();
    const list = await CharDhamBooking.find({ $or: [{ userId: user._id }, { email: user.email }] })
      .populate('packageId', 'name category price duration images')
      .sort({ createdAt: -1 })
      .lean();

    const bookings = list.map((b) => ({
      ...b,
      id: b._id?.toString(),
      package: b.packageId,
      packageId: b.packageId?._id?.toString(),
    }));
    return success({ bookings });
  } catch (e) {
    console.error('CharDham my-bookings:', e);
    return error('Failed to fetch bookings', 500);
  }
}
