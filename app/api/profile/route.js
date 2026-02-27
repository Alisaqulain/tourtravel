import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { getAuthUser } from '@/lib/authGuard';
import { success, error } from '@/lib/apiResponse';

/** PATCH – update current user name, phone, city, state, country */
export async function PATCH(request) {
  const user = await getAuthUser(request);
  if (!user) return error('Login required', 401);
  try {
    const body = await request.json();
    const name = typeof body.name === 'string' ? body.name.trim().slice(0, 120) : undefined;
    const phone = typeof body.phone === 'string' ? body.phone.trim().slice(0, 20) : body.phone === null ? '' : undefined;
    const city = typeof body.city === 'string' ? body.city.trim().slice(0, 100) : body.city === null ? '' : undefined;
    const state = typeof body.state === 'string' ? body.state.trim().slice(0, 100) : body.state === null ? '' : undefined;
    const country = typeof body.country === 'string' ? body.country.trim().slice(0, 100) : body.country === null ? '' : undefined;
    if (!name && phone === undefined && city === undefined && state === undefined && country === undefined) return error('No updates provided', 400);
    await connectDB();
    const update = {};
    if (name !== undefined) update.name = name;
    if (phone !== undefined) update.phone = phone;
    if (city !== undefined) update.city = city || null;
    if (state !== undefined) update.state = state || null;
    if (country !== undefined) update.country = country || null;
    const updated = await User.findByIdAndUpdate(user._id, { $set: update }, { new: true })
      .select('name email phone role city state country')
      .lean();
    return success({ user: updated });
  } catch (e) {
    console.error('Profile update error:', e);
    return error('Failed to update profile', 500);
  }
}
