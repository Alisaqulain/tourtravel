import { connectDB } from '@/lib/db';
import { Hotel } from '@/models/marketplace/Hotel';
import { MarketplaceBooking } from '@/models/marketplace/Booking';
import { requireHotelOwner } from '@/lib/marketplaceAuth';
import { error, success } from '@/lib/apiResponse';

export async function GET(request) {
  const { response, user } = await requireHotelOwner(request);
  if (response) return response;

  try {
    await connectDB();
    const hotel = await Hotel.findOne({ ownerId: user._id });
    if (!hotel) return success({ bookings: [] });

    const bookings = await MarketplaceBooking.find({ hotelId: hotel._id })
      .populate('userId', 'name email')
      .populate('roomId', 'title pricePerNight')
      .sort({ createdAt: -1 })
      .lean();

    const list = bookings.map((b) => ({
      ...b,
      id: b._id?.toString(),
      guest: b.userId,
      room: b.roomId,
    }));
    return success({ bookings: list });
  } catch (e) {
    console.error('Hotel bookings error:', e);
    return error('Failed to list bookings', 500);
  }
}
