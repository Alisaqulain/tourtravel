/**
 * Require admin role. Use in API routes under /api/admin/*.
 * Returns 401 if not logged in, 403 if not admin.
 */

import { getAuthUser } from '@/lib/authGuard';
import { requireAdmin } from '@/lib/authGuard';
import { error } from '@/lib/apiResponse';

/**
 * @param {Request} request
 * @returns {Promise<{ user: import('mongoose').Document | null, response: import('next/server').NextResponse | null }>}
 * If response is non-null, caller should return it (unauthorized). Otherwise user is set and is admin.
 */
export async function requireAdminAuth(request) {
  const user = await getAuthUser(request);
  if (!user) return { user: null, response: error('Login required', 401) };
  if (!requireAdmin(user)) return { user, response: error('Admin access required', 403) };
  return { user, response: null };
}
