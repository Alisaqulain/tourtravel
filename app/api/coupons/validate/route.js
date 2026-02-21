import { connectDB } from '@/lib/db';
import { Coupon } from '@/models/Coupon';
import { success, error } from '@/lib/apiResponse';

export async function POST(request) {
  try {
    const body = await request.json();
    const code = (body?.code || '').toString().trim().toUpperCase();
    const orderAmount = Number(body?.orderAmount) || 0;
    if (!code) return error('Code required', 400);
    await connectDB();
    const coupon = await Coupon.findOne({ code, active: true });
    if (!coupon) return error('Invalid or expired coupon', 404);
    if (coupon.expiryDate && new Date() > coupon.expiryDate)
      return error('Coupon has expired', 400);
    if (coupon.usageLimit != null && coupon.usedCount >= coupon.usageLimit)
      return error('Coupon usage limit reached', 400);
    if (coupon.minOrderAmount > 0 && orderAmount < coupon.minOrderAmount)
      return error(`Minimum order amount is ${coupon.minOrderAmount}`, 400);
    const discount =
      coupon.discountType === 'percentage'
        ? Math.min((orderAmount * coupon.value) / 100, orderAmount)
        : Math.min(coupon.value, orderAmount);
    return success({
      valid: true,
      discount,
      discountType: coupon.discountType,
      value: coupon.value,
    });
  } catch (e) {
    console.error('Coupon validate:', e);
    return error('Validation failed', 500);
  }
}
