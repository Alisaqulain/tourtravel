import { connectDB } from '@/lib/db';
import { Listing } from '@/models/Listing';
import { requireAdminAuth } from '@/lib/adminGuard';
import { success, error } from '@/lib/apiResponse';

const TYPE = 'tour';

export async function GET(request, { params }) {
  const { response } = await requireAdminAuth(request);
  if (response) return response;
  try {
    const id = params?.id;
    if (!id) return error('ID required', 400);
    await connectDB();
    const doc = await Listing.findOne({ _id: id, type: TYPE });
    if (!doc) return error('Not found', 404);
    return success({ ...doc.data, _id: doc._id.toString() });
  } catch (e) {
    console.error('Admin tour GET:', e);
    return error('Failed to load', 500);
  }
}

export async function PUT(request, { params }) {
  const { response } = await requireAdminAuth(request);
  if (response) return response;
  try {
    const id = params?.id;
    if (!id) return error('ID required', 400);
    const body = await request.json();
    if (!body || typeof body !== 'object') return error('Invalid body', 400);
    await connectDB();
    const doc = await Listing.findOneAndUpdate(
      { _id: id, type: TYPE },
      { $set: { data: body } },
      { new: true }
    );
    if (!doc) return error('Not found', 404);
    return success({ ...doc.data, _id: doc._id.toString() });
  } catch (e) {
    console.error('Admin tour PUT:', e);
    return error('Failed to update', 500);
  }
}

export async function DELETE(request, { params }) {
  const { response } = await requireAdminAuth(request);
  if (response) return response;
  try {
    const id = params?.id;
    if (!id) return error('ID required', 400);
    await connectDB();
    const doc = await Listing.findOneAndDelete({ _id: id, type: TYPE });
    if (!doc) return error('Not found', 404);
    return success({ deleted: true });
  } catch (e) {
    console.error('Admin tour DELETE:', e);
    return error('Failed to delete', 500);
  }
}
