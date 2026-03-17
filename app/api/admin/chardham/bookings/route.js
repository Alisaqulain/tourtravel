import { connectDB } from '@/lib/db';
import { CharDhamBooking } from '@/models/CharDhamBooking';
import { requireAdminAuth } from '@/lib/adminGuard';
import { success, error } from '@/lib/apiResponse';

export async function GET(request) {
  const { response } = await requireAdminAuth(request);
  if (response) return response;
  try {
    await connectDB();
    const list = await CharDhamBooking.find()
      .populate('packageId', 'name category price duration')
      .sort({ createdAt: -1 })
      .lean();
    const bookings = list.map((b) => ({
      ...b,
      id: b._id?.toString(),
      packageName: b.packageId?.name,
      packageId: b.packageId?._id?.toString(),
    }));
    return success({ bookings });
  } catch (e) {
    console.error('Admin chardham bookings GET:', e);
    return error('Failed to load', 500);
  }
}
