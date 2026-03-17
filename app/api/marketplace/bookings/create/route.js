import { connectDB } from '@/lib/db';
import { Hotel } from '@/models/marketplace/Hotel';
import { Room } from '@/models/marketplace/Room';
import { MarketplaceBooking } from '@/models/marketplace/Booking';
import { CommissionSettings } from '@/models/marketplace/CommissionSettings';
import { getMarketplaceUser } from '@/lib/marketplaceAuth';
import { error, success } from '@/lib/apiResponse';

export async function POST(request) {
  const { user, response } = await getMarketplaceUser(request);
  if (response) return response;
  if (!['customer', 'user'].includes(user.role)) return error('Only customers can book', 403);

  try {
    const body = await request.json();
    const { roomId, checkIn, checkOut, guests } = body;
    if (!roomId || !checkIn || !checkOut || !guests) {
      return error('roomId, checkIn, checkOut and guests are required', 400);
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    if (checkInDate >= checkOutDate) return error('Check-out must be after check-in', 400);
    if (guests < 1) return error('At least 1 guest required', 400);

    await connectDB();
    const room = await Room.findById(roomId);
    if (!room) return error('Room not found', 404);
    if (room.availableRooms < 1) return error('Room not available', 400);
    if (room.capacity < guests) return error('Room capacity exceeded', 400);

    const hotel = await Hotel.findById(room.hotelId);
    if (!hotel || hotel.status !== 'approved') return error('Hotel not available', 400);

    const nights = Math.ceil((checkOutDate - checkInDate) / (24 * 60 * 60 * 1000));
    const totalAmount = room.pricePerNight * nights;

    let settings = await CommissionSettings.findOne({ key: 'default' }).lean();
    const commissionPercent = settings?.commissionPercent ?? 15;
    const commission = Math.round((totalAmount * commissionPercent) / 100);
    const hotelEarning = totalAmount - commission;

    await Room.findByIdAndUpdate(roomId, { $inc: { availableRooms: -1 } });

    const booking = await MarketplaceBooking.create({
      userId: user._id,
      hotelId: hotel._id,
      roomId: room._id,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests,
      totalAmount,
      commission,
      hotelEarning,
      paymentStatus: 'pending',
      bookingStatus: 'confirmed',
    });

    return success(
      {
        booking: {
          id: booking._id,
          totalAmount: booking.totalAmount,
          paymentStatus: booking.paymentStatus,
        },
      },
      'Booking created'
    );
  } catch (e) {
    console.error('Booking create error:', e);
    return error(e.message || 'Failed to create booking', 500);
  }
}
