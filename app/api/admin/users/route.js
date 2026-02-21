import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { requireAdminAuth } from '@/lib/adminGuard';
import { success, error } from '@/lib/apiResponse';

export async function GET(request) {
  const { response } = await requireAdminAuth(request);
  if (response) return response;

  try {
    await connectDB();
    const list = await User.find().select('name email role isVerified createdAt').sort({ createdAt: -1 }).lean();
    return success({ users: list });
  } catch (e) {
    console.error('Admin users error:', e);
    return error('Failed to load users', 500);
  }
}
