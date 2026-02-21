/**
 * GET /api/admin/contacts – list contact messages (admin only).
 * PATCH to mark as replied (body: { id, replied: true }).
 */
import { connectDB } from '@/lib/db';
import { Contact } from '@/models/Contact';
import { requireAdminAuth } from '@/lib/adminGuard';
import { success, error } from '@/lib/apiResponse';

export async function GET(request) {
  const { response } = await requireAdminAuth(request);
  if (response) return response;
  try {
    await connectDB();
    const list = await Contact.find().sort({ createdAt: -1 }).limit(200).lean();
    return success(list);
  } catch (e) {
    console.error('Admin contacts error:', e);
    return error('Failed to load messages', 500);
  }
}

export async function PATCH(request) {
  const { response } = await requireAdminAuth(request);
  if (response) return response;
  try {
    const body = await request.json();
    const id = body.id;
    const replied = body.replied;
    if (!id) return error('id required', 400);
    await connectDB();
    const doc = await Contact.findByIdAndUpdate(id, { replied: !!replied }, { new: true });
    if (!doc) return error('Message not found', 404);
    return success(doc);
  } catch (e) {
    console.error('Admin contacts patch error:', e);
    return error('Failed to update', 500);
  }
}
