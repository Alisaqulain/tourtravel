/**
 * Marketplace auth: get current user and require specific roles for /admin, /hotel, customer.
 */

import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';
import { error } from '@/lib/apiResponse';

/**
 * @param {Request} request
 * @returns {Promise<{ user: import('mongoose').Document | null, response: import('next/server').NextResponse | null }>}
 */
export async function getMarketplaceUser(request) {
  const token = getTokenFromRequest(request);
  const decoded = verifyToken(token);
  if (!decoded?.userId) return { user: null, response: error('Unauthorized', 401) };
  await connectDB();
  const user = await User.findById(decoded.userId);
  if (!user) return { user: null, response: error('User not found', 401) };
  if (user.isBlocked) return { user: null, response: error('Account blocked', 403) };
  return { user, response: null };
}

/**
 * Require one of the given roles.
 * @param {Request} request
 * @param {string[]} allowedRoles - e.g. ['admin', 'superadmin']
 */
export async function requireMarketplaceRole(request, allowedRoles) {
  const { user, response } = await getMarketplaceUser(request);
  if (response) return { user: null, response };
  const role = user.role;
  if (!allowedRoles.includes(role)) {
    return { user, response: error('Forbidden', 403) };
  }
  return { user, response: null };
}

export async function requireAdmin(request) {
  return requireMarketplaceRole(request, ['admin', 'superadmin']);
}

export async function requireHotelOwner(request) {
  return requireMarketplaceRole(request, ['hotel_owner']);
}

export async function requireCustomer(request) {
  return requireMarketplaceRole(request, ['customer', 'user']);
}
