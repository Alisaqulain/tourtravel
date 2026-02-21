import { connectDB } from '@/lib/db';
import { Booking } from '@/models/Booking';
import { User } from '@/models/User';
import { requireAdminAuth } from '@/lib/adminGuard';
import { success, error } from '@/lib/apiResponse';

export async function GET(request) {
  const { response } = await requireAdminAuth(request);
  if (response) return response;

  try {
    await connectDB();
    const list = await Booking.find()
      .sort({ createdAt: -1 })
      .populate('userId', 'name email')
      .lean();
    const data = list.map((b) => ({
      ...b,
      userName: b.userId?.name,
      userEmail: b.userId?.email,
      userId: undefined,
    }));
    return success({ bookings: data });
  } catch (e) {
    console.error('Admin bookings error:', e);
    return error('Failed to load bookings', 500);
  }
}
