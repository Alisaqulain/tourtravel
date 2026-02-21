import { NextResponse } from 'next/server';

const COOKIE_NAME = 'trips_token';

// In-memory rate limit store (use Redis in multi-instance production)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 min
const RATE_LIMIT_MAX = 100; // requests per window per IP

function getClientIp(request) {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

function rateLimit(ip) {
  const now = Date.now();
  let entry = rateLimitMap.get(ip);
  if (!entry) {
    entry = { count: 0, resetAt: now + RATE_LIMIT_WINDOW_MS };
    rateLimitMap.set(ip, entry);
  }
  if (now > entry.resetAt) {
    entry.count = 0;
    entry.resetAt = now + RATE_LIMIT_WINDOW_MS;
  }
  entry.count++;
  return entry.count <= RATE_LIMIT_MAX;
}

// Pages anyone can see without login (limited public access)
const publicPathPrefixes = [
  '/',
  '/login',
  '/signup',
  '/forgot-password',
  '/about',
  '/contact',
  '/terms',
  '/privacy',
  '/cancellation',
  '/offers',
  '/flights',
  '/hotels',
  '/tours',
  '/packages',
  '/visa',
  '/cruise',
  '/bus',
  '/cars',
];
// Admin base path (admin login is allowed without cookie; rest require auth)
const adminPathPrefix = '/admin';

function hasAuthCookie(request) {
  const cookie = request.cookies.get(COOKIE_NAME);
  return !!cookie?.value;
}

function isPublicPath(pathname) {
  if (pathname === '/') return true;
  return publicPathPrefixes.some(
    (p) => p !== '/' && (pathname === p || pathname.startsWith(p + '/'))
  );
}

function isAdminPath(pathname) {
  return pathname === adminPathPrefix || pathname.startsWith(adminPathPrefix + '/');
}

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Security headers (Helmet-style)
  const response = NextResponse.next();
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Rate limiting for API
  if (pathname.startsWith('/api/')) {
    const ip = getClientIp(request);
    if (!rateLimit(ip)) {
      return NextResponse.json(
        { success: false, message: 'Too many requests' },
        { status: 429 }
      );
    }
    return response;
  }

  // Admin: only /admin/login is allowed without cookie; all other /admin/* require login
  if (isAdminPath(pathname)) {
    if (pathname === '/admin/login') return response;
    if (!hasAuthCookie(request)) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    return response;
  }

  // All other pages: allow only if public path OR user has auth cookie
  if (isPublicPath(pathname)) return response;
  if (hasAuthCookie(request)) return response;

  // Not public and not logged in → redirect to signup
  const signupUrl = new URL('/signup', request.url);
  signupUrl.searchParams.set('from', pathname);
  return NextResponse.redirect(signupUrl);
}

export const config = {
  matcher: [
    '/api/:path*',
    '/admin',
    '/admin/:path*',
    '/profile',
    '/profile/:path*',
    '/my-bookings',
    '/booking-summary',
    '/payment',
    '/wishlist',
    '/notifications',
    '/booking-confirmation',
    '/',
    '/login',
    '/signup',
    '/forgot-password',
    '/about',
    '/contact',
    '/terms',
    '/privacy',
    '/cancellation',
    '/offers',
    '/flights',
    '/flights/:path*',
    '/hotels',
    '/hotels/:path*',
    '/tours',
    '/tours/:path*',
    '/packages',
    '/packages/:path*',
    '/visa',
    '/visa/:path*',
    '/cruise',
    '/cruise/:path*',
    '/bus',
    '/bus/:path*',
    '/cars',
    '/cars/:path*',
  ],
};
