/**
 * JWT sign and verify helpers. Use JWT_SECRET and JWT_EXPIRES_IN from env.
 * Never expose JWT_SECRET to the client.
 */

import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

function getSecret() {
  if (!JWT_SECRET || JWT_SECRET === 'your-secret-change-in-production') {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('JWT_SECRET must be set in production');
    }
    return JWT_SECRET || 'dev-secret-do-not-use-in-production';
  }
  return JWT_SECRET;
}

/**
 * @param {object} payload - { userId, email, role? }
 * @returns {string} JWT token
 */
export function signToken(payload) {
  return jwt.sign(payload, getSecret(), { expiresIn: JWT_EXPIRES_IN });
}

/**
 * @param {string} token
 * @returns {object|null} Decoded payload or null if invalid/expired
 */
export function verifyToken(token) {
  if (!token || typeof token !== 'string') return null;
  try {
    return jwt.verify(token, getSecret());
  } catch {
    return null;
  }
}
