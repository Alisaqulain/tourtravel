import { connectDB } from '@/lib/db';
import { CharDhamPackage } from '@/models/CharDhamPackage';
import { success, error } from '@/lib/apiResponse';
import { DEFAULT_CHAR_DHAM_PACKAGES } from '@/lib/chardhamDefaults';

export async function GET(request) {
  try {
    await connectDB();
    // Ensure 3 default packages exist so /chardham-yatra always shows them by default.
    const existing = await CharDhamPackage.countDocuments();
    if (existing === 0) {
      await CharDhamPackage.insertMany(DEFAULT_CHAR_DHAM_PACKAGES);
    }
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const filter = {};
    if (category && ['standard', 'premium', 'luxury'].includes(category)) {
      filter.category = category;
    }
    const packages = await CharDhamPackage.find(filter).sort({ category: 1, price: 1 }).lean();
    const list = packages.map((p) => ({
      ...p,
      id: p._id?.toString(),
    }));
    return success({ packages: list });
  } catch (e) {
    console.error('CharDham packages GET:', e);
    return error('Failed to fetch packages', 500);
  }
}
