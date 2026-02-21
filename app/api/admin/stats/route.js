import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { Booking } from '@/models/Booking';
import { Listing } from '@/models/Listing';
import { getSettings } from '@/models/Settings';
import { requireAdminAuth } from '@/lib/adminGuard';
import { success, error } from '@/lib/apiResponse';

export async function GET(request) {
  const { response } = await requireAdminAuth(request);
  if (response) return response;

  try {
    await connectDB();
    const [
      totalUsers,
      totalBookings,
      paidBookingsList,
      pendingBookings,
      failedBookings,
      settings,
      manualFlightsCount,
      manualHotelsCount,
      manualToursCount,
      manualPackagesCount,
    ] = await Promise.all([
      User.countDocuments(),
      Booking.countDocuments(),
      Booking.find({ status: 'paid' }).lean(),
      Booking.countDocuments({ status: 'pending' }),
      Booking.countDocuments({ status: 'failed' }),
      getSettings(),
      Listing.countDocuments({ type: 'flight' }),
      Listing.countDocuments({ type: 'hotel' }),
      Listing.countDocuments({ type: 'tour' }),
      Listing.countDocuments({ type: 'package' }),
    ]);
    const revenue = paidBookingsList.reduce((sum, b) => sum + (Number(b.total) || 0), 0);
    const paidBookingsCount = paidBookingsList.length;
    const manualListingsCount =
      manualFlightsCount + manualHotelsCount + manualToursCount + manualPackagesCount;

    return success({
      totalUsers,
      totalBookings,
      paidBookings: paidBookingsCount,
      pendingBookings,
      failedBookings,
      revenue: Math.round(revenue * 100) / 100,
      businessModel: settings?.businessModel ?? 'hybrid',
      manualListingsCount,
      apiRequestsCount: 0, // optional: increment when calling external APIs
    });
  } catch (e) {
    console.error('Admin stats error:', e);
    return error('Failed to load stats', 500);
  }
}
