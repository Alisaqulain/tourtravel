import { connectDB } from '@/lib/db';
import { CharDhamPackage } from '@/models/CharDhamPackage';
import { success, error } from '@/lib/apiResponse';

export async function GET(request, { params }) {
  const id = params?.id;
  if (!id) return error('Package ID required', 400);
  try {
    await connectDB();
    const pkg = await CharDhamPackage.findById(id).lean();
    if (!pkg) return error('Package not found', 404);
    return success({ package: { ...pkg, id: pkg._id?.toString() } });
  } catch (e) {
    console.error('CharDham package GET:', e);
    return error('Failed to fetch package', 500);
  }
}
