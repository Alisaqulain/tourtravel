/**
 * Auth helpers: cookie handling + token from request. JWT sign/verify in lib/jwt.js.
 */

import { signToken as jwtSign, verifyToken as jwtVerify } from '@/lib/jwt';

const COOKIE_NAME = 'trips_token';
const MAX_AGE_SEC = 60 * 60 * 24 * 7; // 7 days

export function signToken(payload) {
  return jwtSign(payload);
}

export function verifyToken(token) {
  return jwtVerify(token);
}

export function getTokenFromRequest(request) {
  const cookie = request.cookies?.get?.(COOKIE_NAME) || request.cookies?.[COOKIE_NAME];
  return cookie?.value ?? request.headers?.get?.('authorization')?.replace(/^Bearer\s+/i, '') ?? null;
}

export function setAuthCookie(response, token) {
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    maxAge: MAX_AGE_SEC,
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });
}

export function clearAuthCookie(response) {
  response.cookies.set(COOKIE_NAME, '', {
    httpOnly: true,
    maxAge: 0,
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });
}
