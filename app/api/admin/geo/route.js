import { requireAdminAuth } from '@/lib/adminGuard';

/** GET: return current request's location from IP (no user prompt). Admin only. */
export async function GET(request) {
  const { response } = await requireAdminAuth(request);
  if (response) return response;

  try {
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const ip = (forwarded?.split(',')[0]?.trim() || realIp || '').trim() || null;

    if (!ip || ip === '127.0.0.1' || ip === '::1') {
      return Response.json({
        success: true,
        data: { lat: 28.6139, lng: 77.209, city: 'New Delhi', country: 'India', fromIp: false },
      });
    }

    const res = await fetch(
      `http://ip-api.com/json/${encodeURIComponent(ip)}?fields=status,lat,lon,city,country`,
      { next: { revalidate: 3600 } }
    );
    const data = await res.json();

    if (data.status !== 'success') {
      return Response.json({
        success: true,
        data: { lat: 28.6139, lng: 77.209, city: 'Unknown', country: '', fromIp: false },
      });
    }

    return Response.json({
      success: true,
      data: {
        lat: data.lat,
        lng: data.lon,
        city: data.city || '',
        country: data.country || '',
        fromIp: true,
      },
    });
  } catch (e) {
    console.error('Admin geo:', e);
    return Response.json({
      success: true,
      data: { lat: 28.6139, lng: 77.209, city: 'Unknown', country: '', fromIp: false },
    });
  }
}
