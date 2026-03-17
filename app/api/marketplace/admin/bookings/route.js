import { connectDB } from '@/lib/db';
import { MarketplaceBooking } from '@/models/marketplace/Booking';
import { Hotel } from '@/models/marketplace/Hotel';
import { requireAdmin } from '@/lib/marketplaceAuth';
import { error, success } from '@/lib/apiResponse';

export async function GET(request) {
  const { response } = await requireAdmin(request);
  if (response) return response;

  try {
    await connectDB();
    const bookings = await MarketplaceBooking.find()
      .populate('userId', 'name email')
      .populate('hotelId', 'name')
      .populate('roomId', 'title pricePerNight')
      .sort({ createdAt: -1 })
      .lean();

    const list = bookings.map((b) => ({
      ...b,
      id: b._id?.toString(),
      guest: b.userId,
      hotel: b.hotelId,
      room: b.roomId,
    }));
    return success({ bookings: list });
  } catch (e) {
    console.error('Admin bookings error:', e);
    return error('Failed to list bookings', 500);
  }
}
