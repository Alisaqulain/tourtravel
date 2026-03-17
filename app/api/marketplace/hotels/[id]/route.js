import { connectDB } from '@/lib/db';
import { Hotel } from '@/models/marketplace/Hotel';
import { success, error } from '@/lib/apiResponse';

const OBJECT_ID_REGEX = /^[a-f\d]{24}$/i;

export async function GET(request, { params }) {
  const idOrSlug = params?.id;
  if (!idOrSlug) return error('Hotel ID or slug required', 400);
  try {
    await connectDB();
    const query = { status: 'approved' };
    if (OBJECT_ID_REGEX.test(idOrSlug)) {
      query._id = idOrSlug;
    } else {
      query.slug = idOrSlug;
    }
    const hotel = await Hotel.findOne(query).lean();
    if (!hotel) return error('Hotel not found', 404);
    return success({ hotel: { ...hotel, id: hotel._id?.toString() } });
  } catch (e) {
    console.error('Hotel get error:', e);
    return error('Failed', 500);
  }
}
