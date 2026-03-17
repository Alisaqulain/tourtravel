import { connectDB } from '@/lib/db';
import { CharDhamPackage } from '@/models/CharDhamPackage';
import { requireAdminAuth } from '@/lib/adminGuard';
import { success, error } from '@/lib/apiResponse';

export async function GET(request, { params }) {
  const { response } = await requireAdminAuth(request);
  if (response) return response;
  const id = params?.id;
  if (!id) return error('ID required', 400);
  try {
    await connectDB();
    const pkg = await CharDhamPackage.findById(id).lean();
    if (!pkg) return error('Package not found', 404);
    return success({ ...pkg, id: pkg._id?.toString() });
  } catch (e) {
    console.error('Admin chardham package GET:', e);
    return error('Failed to load', 500);
  }
}

export async function PUT(request, { params }) {
  const { response } = await requireAdminAuth(request);
  if (response) return response;
  const id = params?.id;
  if (!id) return error('ID required', 400);
  try {
    const body = await request.json();
    await connectDB();
    const update = {};
    const allowed = [
      'name', 'category', 'price', 'duration', 'seatsAvailable',
      'shortDescription', 'fullDescription', 'highlights', 'itinerary',
      'included', 'excluded', 'specialFeatures', 'images', 'discountRules', 'isRecommended',
    ];
    for (const key of allowed) {
      if (body[key] !== undefined) {
        if (key === 'highlights' || key === 'included' || key === 'excluded' || key === 'specialFeatures' || key === 'images') {
          update[key] = Array.isArray(body[key]) ? body[key] : [];
        } else if (key === 'itinerary') {
          update[key] = Array.isArray(body[key]) ? body[key] : [];
        } else if (key === 'discountRules') {
          update[key] = Array.isArray(body[key]) ? body[key] : [];
        } else if (key === 'price' || key === 'seatsAvailable') {
          update[key] = Number(body[key]);
        } else if (key === 'isRecommended') {
          update[key] = Boolean(body[key]);
        } else {
          update[key] = body[key];
        }
      }
    }
    const pkg = await CharDhamPackage.findByIdAndUpdate(id, { $set: update }, { new: true }).lean();
    if (!pkg) return error('Package not found', 404);
    return success({ package: { ...pkg, id: pkg._id?.toString() } });
  } catch (e) {
    console.error('Admin chardham package PUT:', e);
    return error(e.message || 'Failed to update', 500);
  }
}

export async function DELETE(request, { params }) {
  const { response } = await requireAdminAuth(request);
  if (response) return response;
  const id = params?.id;
  if (!id) return error('ID required', 400);
  try {
    await connectDB();
    await CharDhamPackage.findByIdAndDelete(id);
    return success({ deleted: true });
  } catch (e) {
    console.error('Admin chardham package DELETE:', e);
    return error('Failed to delete', 500);
  }
}
