/**
 * Get current user from request (JWT in cookie or Authorization header).
 * Use in API routes that require auth.
 */

import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

/**
 * @param {Request} request
 * @returns {Promise<import('mongoose').Document|null>} User doc or null
 */
export async function getAuthUser(request) {
  const token = getTokenFromRequest(request);
  const decoded = verifyToken(token);
  if (!decoded?.userId) return null;
  await connectDB();
  const user = await User.findById(decoded.userId);
  return user;
}

/**
 * Require admin role. Use after getAuthUser.
 * @param {import('mongoose').Document} user
 * @returns {boolean}
 */
export function requireAdmin(user) {
  return user && (user.role === 'admin' || user.role === 'superadmin');
}
