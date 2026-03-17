import { connectDB } from '@/lib/db';
import { Hotel } from '@/models/marketplace/Hotel';
import { Room } from '@/models/marketplace/Room';
import { success, error } from '@/lib/apiResponse';

const OBJECT_ID_REGEX = /^[a-f\d]{24}$/i;

export async function GET(request, { params }) {
  const idOrSlug = params?.id;
  if (!idOrSlug) return error('Hotel ID or slug required', 400);
  try {
    await connectDB();
    let hotelId = idOrSlug;
    if (!OBJECT_ID_REGEX.test(idOrSlug)) {
      const hotel = await Hotel.findOne({ slug: idOrSlug, status: 'approved' }).select('_id').lean();
      if (!hotel) return error('Hotel not found', 404);
      hotelId = hotel._id;
    }
    const rooms = await Room.find({ hotelId, availableRooms: { $gt: 0 } }).lean();
    return success({ rooms: rooms.map((r) => ({ ...r, id: r._id?.toString() })) });
  } catch (e) {
    console.error('Rooms get error:', e);
    return error('Failed', 500);
  }
}
