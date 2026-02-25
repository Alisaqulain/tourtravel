import { connectDB } from '@/lib/db';
import { Payment } from '@/models/Payment';
import { getAuthUser } from '@/lib/authGuard';
import { success, error } from '@/lib/apiResponse';

/** GET /api/payments - list current user's payment history */
export async function GET(request) {
  const user = await getAuthUser(request);
  if (!user) return error('Login required', 401);
  try {
    await connectDB();
    const list = await Payment.find({ userId: user._id }).sort({ createdAt: -1 }).limit(100).lean();
    return success({ payments: list });
  } catch (e) {
    console.error('Payments GET error:', e);
    return error('Failed to fetch payments', 500);
  }
}
