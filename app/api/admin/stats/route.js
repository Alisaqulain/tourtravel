import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { Booking } from '@/models/Booking';
import { requireAdminAuth } from '@/lib/adminGuard';
import { success, error } from '@/lib/apiResponse';

export async function GET(request) {
  const { response } = await requireAdminAuth(request);
  if (response) return response;

  try {
    await connectDB();
    const [totalUsers, totalBookings, paidBookings, pendingBookings] = await Promise.all([
      User.countDocuments(),
      Booking.countDocuments(),
      Booking.find({ status: 'paid' }).lean(),
      Booking.countDocuments({ status: 'pending' }),
    ]);
    const revenue = paidBookings.reduce((sum, b) => sum + (Number(b.total) || 0), 0);

    return success({
      totalUsers,
      totalBookings,
      paidBookings: paidBookings.length,
      pendingBookings,
      revenue: Math.round(revenue * 100) / 100,
    });
  } catch (e) {
    console.error('Admin stats error:', e);
    return error('Failed to load stats', 500);
  }
}
