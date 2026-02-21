import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { Booking } from '@/models/Booking';
import { AffiliateClick } from '@/models/AffiliateClick';
import { requireAdminAuth } from '@/lib/adminGuard';
import { success, error } from '@/lib/apiResponse';

export async function GET(request) {
  const { response } = await requireAdminAuth(request);
  if (response) return response;

  try {
    await connectDB();
    const months = 6;
    const now = new Date();
    const monthLabels = [];
    const revenueByMonth = [];
    const usersByMonth = [];
    const bookingsByMonth = [];

    for (let i = months - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const start = new Date(d.getFullYear(), d.getMonth(), 1);
      const end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);
      monthLabels.push(start.toLocaleString('default', { month: 'short', year: '2-digit' }));

      const [revenueRes, usersRes, bookingsRes] = await Promise.all([
        Booking.aggregate([
          { $match: { status: 'paid', createdAt: { $gte: start, $lte: end } } },
          { $group: { _id: null, total: { $sum: '$total' } } },
        ]),
        User.countDocuments({ createdAt: { $gte: start, $lte: end } }),
        Booking.countDocuments({ createdAt: { $gte: start, $lte: end } }),
      ]);
      revenueByMonth.push(revenueRes[0]?.total ?? 0);
      usersByMonth.push(usersRes);
      bookingsByMonth.push(bookingsRes);
    }

    const bookingTypes = await Booking.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const affiliateClicks = await AffiliateClick.aggregate([
      { $group: { _id: '$provider', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const totalRevenue = revenueByMonth.reduce((a, b) => a + b, 0);
    const totalBookings = await Booking.countDocuments({ status: 'paid' });
    const totalClicks = await AffiliateClick.countDocuments();

    return success({
      monthly: {
        labels: monthLabels,
        revenue: revenueByMonth,
        users: usersByMonth,
        bookings: bookingsByMonth,
      },
      bookingTypes: bookingTypes.map((b) => ({ type: b._id, count: b.count })),
      affiliateClicks: affiliateClicks.map((a) => ({ provider: a._id, count: a.count })),
      summary: { totalRevenue, totalBookings, totalClicks },
    });
  } catch (e) {
    console.error('Admin analytics error:', e);
    return error('Failed to load analytics', 500);
  }
}
