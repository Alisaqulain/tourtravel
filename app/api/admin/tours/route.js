import { connectDB } from '@/lib/db';
import { Listing } from '@/models/Listing';
import { requireAdminAuth } from '@/lib/adminGuard';
import { success, error } from '@/lib/apiResponse';

const TYPE = 'tour';

export async function GET(request) {
  const { response } = await requireAdminAuth(request);
  if (response) return response;
  try {
    await connectDB();
    const list = await Listing.find({ type: TYPE }).sort({ createdAt: -1 }).lean();
    return success(list.map((l) => ({ ...l.data, _id: l._id.toString() })));
  } catch (e) {
    console.error('Admin tours GET:', e);
    return error('Failed to load', 500);
  }
}

export async function POST(request) {
  const { response } = await requireAdminAuth(request);
  if (response) return response;
  try {
    const body = await request.json();
    if (!body || typeof body !== 'object') return error('Invalid body', 400);
    await connectDB();
    const doc = await Listing.create({ type: TYPE, data: body });
    return success({ id: doc._id, ...doc.data });
  } catch (e) {
    console.error('Admin tours POST:', e);
    return error('Failed to create', 500);
  }
}
