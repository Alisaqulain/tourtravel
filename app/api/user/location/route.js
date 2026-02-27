import { connectDB } from '@/lib/db';
import { getAuthUser } from '@/lib/authGuard';
import { getGeoFromIp } from '@/lib/geoFromIp';

/**
 * POST: Update the current user's last known location from request IP.
 * Called by the client once per session so admin can see user locations.
 */
export async function POST(request) {
  const user = await getAuthUser(request);
  if (!user) {
    return Response.json({ success: false, message: 'Login required' }, { status: 401 });
  }

  try {
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const ip = (forwarded?.split(',')[0]?.trim() || realIp || '').trim() || null;

    const geo = await getGeoFromIp(ip);
    if (!geo) return Response.json({ success: true });

    await connectDB();
    const { User } = await import('@/models/User');
    await User.findByIdAndUpdate(user._id, {
      lastLocationCity: geo.city,
      lastLocationCountry: geo.country,
      lastLocationLat: geo.lat,
      lastLocationLng: geo.lng,
      lastLocationAt: new Date(),
    });

    return Response.json({ success: true });
  } catch (e) {
    console.error('User location update:', e);
    return Response.json({ success: false }, { status: 500 });
  }
}
