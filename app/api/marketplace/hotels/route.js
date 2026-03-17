import { connectDB } from '@/lib/db';
import { Hotel } from '@/models/marketplace/Hotel';
import { Room } from '@/models/marketplace/Room';
import { success, error } from '@/lib/apiResponse';

/** Public search: city, minPrice, maxPrice, rating, amenities */
export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city')?.trim();
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const rating = searchParams.get('rating');
    const amenities = searchParams.get('amenities')?.split(',').filter(Boolean);

    const filter = { status: 'approved' };
    if (city) filter.city = new RegExp(city, 'i');
    if (rating) filter.rating = { $gte: Number(rating) };
    if (amenities?.length) filter.amenities = { $all: amenities };

    let hotels = await Hotel.find(filter).lean();
    const hotelIds = hotels.map((h) => h._id);

    const roomFilter = { hotelId: { $in: hotelIds }, availableRooms: { $gt: 0 } };
    const priceCond = {};
    if (minPrice != null) priceCond.$gte = Number(minPrice);
    if (maxPrice != null) priceCond.$lte = Number(maxPrice);
    if (Object.keys(priceCond).length) roomFilter.pricePerNight = priceCond;

    const roomPrices = await Room.aggregate([
      { $match: roomFilter },
      { $group: { _id: '$hotelId', minPrice: { $min: '$pricePerNight' } } },
    ]);
    const priceMap = Object.fromEntries(roomPrices.map((r) => [r._id.toString(), r.minPrice]));

    hotels = hotels
      .filter((h) => priceMap[h._id.toString()] != null)
      .map((h) => ({ ...h, id: h._id?.toString(), minPrice: priceMap[h._id.toString()] }))
      .sort((a, b) => (a.minPrice || 0) - (b.minPrice || 0));

    return success({ hotels });
  } catch (e) {
    console.error('Hotels search error:', e);
    return error('Search failed', 500);
  }
}
