import { connectDB } from '@/lib/db';
import { Wishlist } from '@/models/Wishlist';
import { getAuthUser } from '@/lib/authGuard';
import { success, error } from '@/lib/apiResponse';

export async function GET(request) {
  const user = await getAuthUser(request);
  if (!user) return success({ inWishlist: false });
  try {
    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get('itemId');
    const type = searchParams.get('type');
    if (!itemId || !type) return success({ inWishlist: false });
    await connectDB();
    const found = await Wishlist.findOne({ userId: user._id, itemId, type });
    return success({ inWishlist: !!found });
  } catch (e) {
    return success({ inWishlist: false });
  }
}
