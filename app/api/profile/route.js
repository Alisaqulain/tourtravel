import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { getAuthUser } from '@/lib/authGuard';
import { success, error } from '@/lib/apiResponse';

/** PATCH – update current user name and/or phone */
export async function PATCH(request) {
  const user = await getAuthUser(request);
  if (!user) return error('Login required', 401);
  try {
    const body = await request.json();
    const name = typeof body.name === 'string' ? body.name.trim().slice(0, 120) : undefined;
    const phone = typeof body.phone === 'string' ? body.phone.trim().slice(0, 20) : body.phone === null ? '' : undefined;
    if (!name && phone === undefined) return error('No updates provided', 400);
    await connectDB();
    const update = {};
    if (name !== undefined) update.name = name;
    if (phone !== undefined) update.phone = phone;
    const updated = await User.findByIdAndUpdate(user._id, { $set: update }, { new: true })
      .select('name email phone role')
      .lean();
    return success({ user: updated });
  } catch (e) {
    console.error('Profile update error:', e);
    return error('Failed to update profile', 500);
  }
}
