import { connectDB } from '@/lib/db';
import { requireAdminAuth } from '@/lib/adminGuard';
import { success, error } from '@/lib/apiResponse';
import { CharDhamPackage } from '@/models/CharDhamPackage';
import { DEFAULT_CHAR_DHAM_PACKAGES } from '@/lib/chardhamDefaults';

export async function POST(request) {
  const { response } = await requireAdminAuth(request);
  if (response) return response;

  try {
    await connectDB();
    const existing = await CharDhamPackage.countDocuments();
    if (existing > 0) return success({ created: 0, message: 'Already has packages' });

    const created = await CharDhamPackage.insertMany(DEFAULT_CHAR_DHAM_PACKAGES);
    return success({ created: created.length });
  } catch (e) {
    console.error('CharDham seed:', e);
    return error('Failed to seed', 500);
  }
}

