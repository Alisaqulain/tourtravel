import { getMarketplaceUser } from '@/lib/marketplaceAuth';
import { saveFile, generateUploadPath } from '@/lib/storage';
import { error, success } from '@/lib/apiResponse';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_DOC_TYPES = ['application/pdf', ...ALLOWED_IMAGE_TYPES];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request) {
  const { user, response } = await getMarketplaceUser(request);
  if (response) return response;
  if (!['hotel_owner', 'admin', 'superadmin'].includes(user.role)) {
    return error('Only hotel owners or admin can upload', 403);
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') || formData.get('image');
    if (!file || typeof file === 'string') return error('No file provided', 400);

    const { name, type, size } = file;
    const prefix = formData.get('prefix')?.toString() || 'img';
    const allowedTypes = prefix === 'doc' ? ALLOWED_DOC_TYPES : ALLOWED_IMAGE_TYPES;
    if (!allowedTypes.includes(type)) {
      return error(prefix === 'doc' ? 'Allowed: PDF, JPEG, PNG, WebP, GIF' : 'Allowed types: JPEG, PNG, WebP, GIF', 400);
    }
    if (size > MAX_SIZE) return error('File too large (max 5MB)', 400);

    const relativePath = generateUploadPath(name || (prefix === 'doc' ? 'document.pdf' : 'image.jpg'), prefix);
    const buffer = Buffer.from(await file.arrayBuffer());
    const urlPath = await saveFile(buffer, relativePath);

    return success({ url: `/api/storage/${urlPath.replace(/^\/+/, '')}`, path: urlPath });
  } catch (e) {
    console.error('Upload error:', e);
    return error(e.message || 'Upload failed', 500);
  }
}
