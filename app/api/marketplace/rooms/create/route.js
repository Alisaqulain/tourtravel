import { connectDB } from '@/lib/db';
import { Hotel } from '@/models/marketplace/Hotel';
import { Room } from '@/models/marketplace/Room';
import { requireHotelOwner } from '@/lib/marketplaceAuth';
import { error, success } from '@/lib/apiResponse';

export async function POST(request) {
  const { response, user } = await requireHotelOwner(request);
  if (response) return response;

  try {
    const body = await request.json();
    const { hotelId, title, description, pricePerNight, capacity, totalRooms, images, amenities } = body;
    if (!hotelId || !title?.trim() || pricePerNight == null || !capacity || !totalRooms) {
      return error('hotelId, title, pricePerNight, capacity and totalRooms are required', 400);
    }

    await connectDB();
    const hotel = await Hotel.findOne({ _id: hotelId, ownerId: user._id });
    if (!hotel) return error('Hotel not found or access denied', 404);
    if (hotel.status !== 'approved') return error('Hotel must be approved to add rooms', 400);

    const room = await Room.create({
      hotelId: hotel._id,
      title: title.trim(),
      description: description?.trim() || '',
      pricePerNight: Number(pricePerNight),
      capacity: Number(capacity),
      totalRooms: Number(totalRooms),
      availableRooms: Number(totalRooms),
      images: Array.isArray(images) ? images : images ? [images] : [],
      amenities: Array.isArray(amenities) ? amenities : amenities ? [amenities] : [],
    });

    return success({ room: { ...room.toObject(), id: room._id } }, 'Room created');
  } catch (e) {
    console.error('Room create error:', e);
    return error(e.message || 'Failed to create room', 500);
  }
}
