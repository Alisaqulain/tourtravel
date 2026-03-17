import { connectDB } from '@/lib/db';
import { Hotel } from '@/models/marketplace/Hotel';
import { Room } from '@/models/marketplace/Room';
import { requireHotelOwner } from '@/lib/marketplaceAuth';
import { error, success } from '@/lib/apiResponse';

export async function PUT(request) {
  const { response, user } = await requireHotelOwner(request);
  if (response) return response;

  try {
    const body = await request.json();
    const { roomId, title, description, pricePerNight, capacity, totalRooms, availableRooms, images, amenities } = body;
    if (!roomId) return error('roomId required', 400);

    await connectDB();
    const room = await Room.findById(roomId);
    if (!room) return error('Room not found', 404);

    const hotel = await Hotel.findOne({ _id: room.hotelId, ownerId: user._id });
    if (!hotel) return error('Access denied', 403);

    if (title != null) room.title = title.trim();
    if (description != null) room.description = description.trim();
    if (pricePerNight != null) room.pricePerNight = Number(pricePerNight);
    if (capacity != null) room.capacity = Number(capacity);
    if (totalRooms != null) room.totalRooms = Number(totalRooms);
    if (availableRooms != null) room.availableRooms = Math.min(Number(availableRooms), room.totalRooms);
    if (Array.isArray(images)) room.images = images;
    if (Array.isArray(amenities)) room.amenities = amenities;

    await room.save();
    return success({ room: { ...room.toObject(), id: room._id } }, 'Room updated');
  } catch (e) {
    console.error('Room update error:', e);
    return error(e.message || 'Failed to update room', 500);
  }
}
