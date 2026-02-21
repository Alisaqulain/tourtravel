/**
 * GET /api/offers – list active offers (for countdown, promo codes).
 * Query: active=1 (default), limit
 */
import { connectDB } from '@/lib/db';
import { Offer } from '@/models/Offer';
import { success, error } from '@/lib/apiResponse';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active') !== '0';
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20', 10) || 20));

    await connectDB();
    const query = {};
    if (activeOnly) {
      query.active = true;
      query.expiryDate = { $gt: new Date() };
    }
    const list = await Offer.find(query).sort({ expiryDate: 1 }).limit(limit).lean();
    return success(list);
  } catch (e) {
    console.error('Offers API error:', e);
    return error(e.message || 'Failed to load offers', 500);
  }
}
