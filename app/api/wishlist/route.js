import { connectDB } from '@/lib/db';
import { Wishlist } from '@/models/Wishlist';
import { getAuthUser } from '@/lib/authGuard';
import { success, error } from '@/lib/apiResponse';

export async function GET(request) {
  const user = await getAuthUser(request);
  if (!user) return error('Login required', 401);
  try {
    await connectDB();
    const list = await Wishlist.find({ userId: user._id }).sort({ createdAt: -1 }).lean();
    return success({ items: list });
  } catch (e) {
    console.error('Wishlist GET:', e);
    return error('Failed to load wishlist', 500);
  }
}

export async function POST(request) {
  const user = await getAuthUser(request);
  if (!user) return error('Login required', 401);
  try {
    const body = await request.json();
    const { itemId, type, itemSnapshot } = body || {};
    if (!itemId || !type) return error('itemId and type required', 400);
    const validTypes = ['flight', 'hotel', 'tour', 'package', 'bus', 'cruise', 'car'];
    if (!validTypes.includes(type)) return error('Invalid type', 400);
    await connectDB();
    const existing = await Wishlist.findOne({ userId: user._id, itemId, type });
    if (existing) return success({ added: false, message: 'Already in wishlist' });
    await Wishlist.create({
      userId: user._id,
      itemId,
      type,
      itemSnapshot: itemSnapshot || null,
    });
    return success({ added: true });
  } catch (e) {
    console.error('Wishlist POST:', e);
    return error('Failed to add', 500);
  }
}

export async function DELETE(request) {
  const user = await getAuthUser(request);
  if (!user) return error('Login required', 401);
  try {
    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get('itemId');
    const type = searchParams.get('type');
    if (!itemId || !type) return error('itemId and type required', 400);
    await connectDB();
    await Wishlist.findOneAndDelete({ userId: user._id, itemId, type });
    return success({ removed: true });
  } catch (e) {
    console.error('Wishlist DELETE:', e);
    return error('Failed to remove', 500);
  }
}
