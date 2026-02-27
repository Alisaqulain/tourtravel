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
    const list = await User.find()
      .select('name email role isVerified isBlocked createdAt city state country lastLocationCity lastLocationCountry lastLocationLat lastLocationLng lastLocationAt')
      .sort({ createdAt: -1 })
      .lean();

    const userIds = list.map((u) => u._id);
    const bookingStats = await Booking.aggregate([
      { $match: { userId: { $in: userIds } } },
      {
        $group: {
          _id: '$userId',
          totalBookings: { $sum: 1 },
          totalSpend: { $sum: { $cond: [{ $eq: ['$status', 'paid'] }, '$total', 0] } },
        },
      },
    ]);
    const statsMap = Object.fromEntries(
      bookingStats.map((s) => [s._id.toString(), { totalBookings: s.totalBookings, totalSpend: s.totalSpend }])
    );

    const users = list.map((u) => ({
      ...u,
      id: u._id?.toString(),
      totalBookings: statsMap[u._id?.toString()]?.totalBookings ?? 0,
      totalSpend: statsMap[u._id?.toString()]?.totalSpend ?? 0,
    }));
    return success({ users });
  } catch (e) {
    console.error('Admin users error:', e);
    return error('Failed to load users', 500);
  }
}

/** PATCH – update role or isBlocked. Body: { userId, role?, isBlocked? } */
export async function PATCH(request) {
  const { response, user: adminUser } = await requireAdminAuth(request);
  if (response) return response;

  try {
    const body = await request.json();
    const userId = body.userId;
    if (!userId) return error('userId required', 400);

    await connectDB();
    const target = await User.findById(userId);
    if (!target) return error('User not found', 404);
    if (target.role === 'superadmin' && adminUser.role !== 'superadmin') {
      return error('Cannot modify superadmin', 403);
    }

    if (body.role !== undefined) {
      const role = ['user', 'admin', 'superadmin'].includes(body.role) ? body.role : target.role;
      target.role = role;
    }
    if (typeof body.isBlocked === 'boolean') target.isBlocked = body.isBlocked;
    await target.save();

    return success({
      id: target._id,
      name: target.name,
      email: target.email,
      role: target.role,
      isBlocked: target.isBlocked,
    });
  } catch (e) {
    console.error('Admin users PATCH:', e);
    return error(e.message || 'Failed to update user', 500);
  }
}

/** DELETE – delete user (non-superadmin only). */
export async function DELETE(request) {
  const { response, user: adminUser } = await requireAdminAuth(request);
  if (response) return response;

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  if (!userId) return error('userId required', 400);

  try {
    await connectDB();
    const target = await User.findById(userId);
    if (!target) return error('User not found', 404);
    if (target.role === 'superadmin') return error('Cannot delete superadmin', 403);
    await User.findByIdAndDelete(userId);
    return success({ deleted: true });
  } catch (e) {
    console.error('Admin users DELETE:', e);
    return error(e.message || 'Failed to delete user', 500);
  }
}
