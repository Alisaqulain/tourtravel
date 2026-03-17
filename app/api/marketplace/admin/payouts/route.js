import { connectDB } from '@/lib/db';
import { PayoutRequest } from '@/models/marketplace/PayoutRequest';
import { Hotel } from '@/models/marketplace/Hotel';
import { requireAdmin } from '@/lib/marketplaceAuth';
import { error, success } from '@/lib/apiResponse';

export async function GET(request) {
  const { response } = await requireAdmin(request);
  if (response) return response;

  try {
    await connectDB();
    const payouts = await PayoutRequest.find()
      .populate('hotelId', 'name')
      .sort({ createdAt: -1 })
      .lean();

    const list = payouts.map((p) => ({
      ...p,
      id: p._id?.toString(),
      hotelName: p.hotelId?.name,
      hotelId: p.hotelId?._id?.toString(),
    }));
    return success({ payouts: list });
  } catch (e) {
    console.error('Admin payouts list error:', e);
    return error('Failed to list payouts', 500);
  }
}
