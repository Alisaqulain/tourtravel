import { connectDB } from '@/lib/db';
import { Hotel } from '@/models/marketplace/Hotel';
import { Room } from '@/models/marketplace/Room';
import { requireHotelOwner } from '@/lib/marketplaceAuth';
import { error, success } from '@/lib/apiResponse';

export async function GET(request) {
  const { response, user } = await requireHotelOwner(request);
  if (response) return response;

  try {
    await connectDB();
    const hotel = await Hotel.findOne({ ownerId: user._id });
    if (!hotel) return success({ rooms: [] });

    const rooms = await Room.find({ hotelId: hotel._id }).sort({ createdAt: -1 }).lean();
    return success({ rooms: rooms.map((r) => ({ ...r, id: r._id?.toString() })) });
  } catch (e) {
    console.error('Hotel rooms list error:', e);
    return error('Failed to list rooms', 500);
  }
}
