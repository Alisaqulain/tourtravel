import { connectDB } from '@/lib/db';
import { Hotel } from '@/models/marketplace/Hotel';
import { User } from '@/models/User';
import { requireAdmin } from '@/lib/marketplaceAuth';
import { error, success } from '@/lib/apiResponse';

export async function GET(request) {
  const { response } = await requireAdmin(request);
  if (response) return response;

  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const filter = {};
    if (status) {
      if (status === 'pending') {
        filter.status = { $in: ['pending', 'pending_verification'] };
      } else {
        filter.status = status;
      }
    }

    const hotels = await Hotel.find(filter)
      .populate('ownerId', 'name email phone')
      .sort({ createdAt: -1 })
      .lean();

    const list = hotels.map((h) => ({
      ...h,
      id: h._id?.toString(),
      owner: h.ownerId,
      ownerId: h.ownerId?._id?.toString(),
    }));

    return success({ hotels: list });
  } catch (e) {
    console.error('Admin hotels list error:', e);
    return error('Failed to list hotels', 500);
  }
}
