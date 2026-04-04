import { connectDB } from '@/lib/db';
import { CharDhamPackage } from '@/models/CharDhamPackage';
import { requireAdminAuth } from '@/lib/adminGuard';
import { success, error } from '@/lib/apiResponse';

export async function GET(request) {
  const { response } = await requireAdminAuth(request);
  if (response) return response;
  try {
    await connectDB();
    const list = await CharDhamPackage.find().sort({ category: 1, price: 1 }).lean();
    return success(list.map((p) => ({ ...p, id: p._id?.toString() })));
  } catch (e) {
    console.error('Admin chardham packages GET:', e);
    return error('Failed to load', 500);
  }
}

export async function POST(request) {
  const { response } = await requireAdminAuth(request);
  if (response) return response;
  try {
    const body = await request.json();
    const {
      name, category, price, offerText, duration, seatsAvailable,
      shortDescription, fullDescription, highlights, itinerary,
      included, excluded, specialFeatures, images, discountRules, isRecommended,
    } = body || {};
    if (!name?.trim() || !category || price == null || !duration?.trim()) {
      return error('Name, category, price and duration are required', 400);
    }
    await connectDB();
    const pkg = await CharDhamPackage.create({
      name: name.trim(),
      category: ['standard', 'premium', 'luxury'].includes(category) ? category : 'standard',
      price: Number(price) || 0,
      offerText: typeof offerText === 'string' ? offerText.trim().slice(0, 500) : '',
      duration: duration.trim(),
      seatsAvailable: Math.max(0, Number(seatsAvailable) || 0),
      shortDescription: shortDescription?.trim() || '',
      fullDescription: fullDescription?.trim() || '',
      highlights: Array.isArray(highlights) ? highlights : [],
      itinerary: Array.isArray(itinerary) ? itinerary : [],
      included: Array.isArray(included) ? included : [],
      excluded: Array.isArray(excluded) ? excluded : [],
      specialFeatures: Array.isArray(specialFeatures) ? specialFeatures : [],
      images: Array.isArray(images) ? images : [],
      discountRules: Array.isArray(discountRules) ? discountRules : [],
      isRecommended: Boolean(isRecommended),
    });
    return success({ package: { ...pkg.toObject(), id: pkg._id?.toString() } });
  } catch (e) {
    console.error('Admin chardham packages POST:', e);
    return error(e.message || 'Failed to create', 500);
  }
}
