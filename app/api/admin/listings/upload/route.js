import { requireAdminAuth } from '@/lib/adminGuard';
import { success, error } from '@/lib/apiResponse';
import { generateUploadRelPath, saveUpload } from '@/lib/chardhamStorage';

const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const MAX_SIZE = 5 * 1024 * 1024;

/** POST multipart: file — same storage as Char Dham; served via /api/chardham/storage/... */
export async function POST(request) {
  const { response } = await requireAdminAuth(request);
  if (response) return response;

  try {
    const form = await request.formData();
    const file = form.get('file');
    if (!file) return error('file is required', 400);
    if (typeof file === 'string') return error('Invalid file', 400);

    const { name, type, size } = file;
    if (!ALLOWED.has(type)) return error('Only image files are allowed', 400);
    if (size > MAX_SIZE) return error('Max file size is 5MB', 400);

    const rel = generateUploadRelPath(name || 'image.jpg');
    const buffer = Buffer.from(await file.arrayBuffer());
    const stored = await saveUpload(buffer, rel);

    return success({ url: `/api/chardham/storage/${stored}` });
  } catch (e) {
    console.error('Listings upload:', e);
    return error(e.message || 'Upload failed', 500);
  }
}
