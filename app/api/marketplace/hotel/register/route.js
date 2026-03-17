import { connectDB } from '@/lib/db';
import { Hotel } from '@/models/marketplace/Hotel';
import { HotelWallet } from '@/models/marketplace/HotelWallet';
import { requireHotelOwner } from '@/lib/marketplaceAuth';
import { error, success } from '@/lib/apiResponse';

export async function POST(request) {
  const { response, user } = await requireHotelOwner(request);
  if (response) return response;

  try {
    const body = await request.json();
    const { hotelName, address, city, description, documents, amenities } = body;
    if (!hotelName?.trim() || !address?.trim() || !city?.trim()) {
      return error('Hotel name, address and city are required', 400);
    }

    await connectDB();

    const existing = await Hotel.findOne({ ownerId: user._id });
    if (existing) {
      if (existing.status === 'pending' || existing.status === 'pending_verification') return error('You already have a hotel under review', 400);
      if (existing.status === 'approved') return error('You already have an approved hotel', 400);
    }

    const hotel = await Hotel.create({
      ownerId: user._id,
      name: hotelName.trim(),
      address: address.trim(),
      city: city.trim(),
      description: description?.trim() || '',
      documents: Array.isArray(documents) ? documents : documents ? [documents] : [],
      amenities: Array.isArray(amenities) ? amenities : amenities ? [amenities] : [],
      status: 'pending',
    });

    await HotelWallet.findOneAndUpdate(
      { hotelId: hotel._id },
      { $setOnInsert: { hotelId: hotel._id } },
      { upsert: true, new: true }
    );

    return success(
      { hotel: { id: hotel._id, name: hotel.name, status: hotel.status } },
      'Hotel submitted for verification'
    );
  } catch (e) {
    console.error('Hotel register error:', e);
    return error(e.message || 'Failed to register hotel', 500);
  }
}

export async function PATCH(request) {
  const { response, user } = await requireHotelOwner(request);
  if (response) return response;

  try {
    const body = await request.json();
    await connectDB();
    const hotel = await Hotel.findOne({ ownerId: user._id });
    if (!hotel) return error('Hotel not found', 404);

    const allowed = [
      'name', 'description', 'address', 'city', 'country', 'amenities', 'images', 'documents',
      'starRating', 'totalRooms',
    ];
    for (const key of allowed) {
      if (body[key] !== undefined) {
        if (key === 'amenities' || key === 'images' || key === 'documents') {
          hotel[key] = Array.isArray(body[key]) ? body[key] : body[key] ? [body[key]] : [];
        } else if (key === 'starRating' || key === 'totalRooms') {
          hotel[key] = Number(body[key]);
        } else {
          hotel[key] = body[key];
        }
      }
    }
    await hotel.save();
    return success({ hotel: { id: hotel._id, name: hotel.name, status: hotel.status } }, 'Profile updated');
  } catch (e) {
    console.error('Hotel update error:', e);
    return error(e.message || 'Failed to update', 500);
  }
}

export async function GET(request) {
  const { response, user } = await requireHotelOwner(request);
  if (response) return response;

  try {
    await connectDB();
    const hotel = await Hotel.findOne({ ownerId: user._id }).lean();
    if (!hotel) return success({ hotel: null });
    return success({ hotel: { ...hotel, id: hotel._id?.toString() } });
  } catch (e) {
    console.error('Hotel get error:', e);
    return error('Failed to get hotel', 500);
  }
}
