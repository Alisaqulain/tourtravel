/**
 * Get approximate location from IP (e.g. ip-api.com). No API key required.
 * @param {string|null} ip
 * @returns {Promise<{ lat: number, lng: number, city: string, country: string }|null>}
 */
export async function getGeoFromIp(ip) {
  if (!ip || ip === '127.0.0.1' || ip === '::1') {
    return { lat: 28.6139, lng: 77.209, city: 'New Delhi', country: 'India' };
  }
  try {
    const res = await fetch(
      `http://ip-api.com/json/${encodeURIComponent(ip)}?fields=status,lat,lon,city,country`,
      { next: { revalidate: 3600 } }
    );
    const data = await res.json();
    if (data.status !== 'success') return null;
    return {
      lat: data.lat,
      lng: data.lon,
      city: data.city || '',
      country: data.country || '',
    };
  } catch {
    return null;
  }
}
