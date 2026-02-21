/**
 * Amadeus API – flights & hotels. Test env = cached; production = real-time.
 * Set AMADEUS_API_KEY, AMADEUS_API_SECRET. Optional AMADEUS_BASE (default test.api.amadeus.com).
 */

const BASE = process.env.AMADEUS_BASE || 'https://test.api.amadeus.com';

export async function getToken() {
  const key = process.env.AMADEUS_API_KEY;
  const secret = process.env.AMADEUS_API_SECRET;
  if (!key || !secret) return null;
  const res = await fetch(`${BASE}/v1/security/oauth2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: key,
      client_secret: secret,
    }),
  });
  if (!res.ok) throw new Error(`Amadeus auth failed: ${res.status}`);
  const data = await res.json();
  return data.access_token;
}

/**
 * @param {string} token
 * @param {{ origin?: string, destination?: string, date?: string, adults?: number }} params
 */
export async function searchFlights(token, params = {}) {
  const { origin = 'DEL', destination = 'BOM', date, adults = 1 } = params;
  const url = new URL(`${BASE}/v2/shopping/flight-offers`);
  url.searchParams.set('originLocationCode', (origin || 'DEL').toString().toUpperCase().slice(0, 3));
  url.searchParams.set('destinationLocationCode', (destination || 'BOM').toString().toUpperCase().slice(0, 3));
  url.searchParams.set('departureDate', date || new Date().toISOString().slice(0, 10));
  url.searchParams.set('adults', String(adults));

  const res = await fetch(url.toString(), { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error(`Amadeus flights: ${res.status}`);
  const data = await res.json();
  return normalizeAmadeusFlights(data.data || []);
}

/**
 * @param {string} token
 * @param {{ cityCode?: string, checkIn?: string, checkOut?: string, adults?: number }} params
 */
export async function searchHotels(token, params = {}) {
  const cityCode = (params.cityCode || 'DEL').toString().toUpperCase().slice(0, 3);
  const checkIn = params.checkIn || new Date().toISOString().slice(0, 10);
  const checkOut = params.checkOut || new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 10);

  const url = new URL(`${BASE}/v1/reference-data/locations/hotels/by-city`);
  url.searchParams.set('cityCode', cityCode);

  const res = await fetch(url.toString(), { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) return [];
  const data = await res.json();
  const hotelIds = (data.data || []).slice(0, 20).map((h) => h.hotelId).filter(Boolean);
  if (hotelIds.length === 0) return [];

  const offerRes = await fetch(
    `${BASE}/v1/shopping/hotel-offers?hotelIds=${hotelIds.join(',')}&adults=1&checkInDate=${checkIn}&checkOutDate=${checkOut}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!offerRes.ok) return [];
  const offerData = await offerRes.json();
  return normalizeAmadeusHotels(offerData.data || []);
}

function normalizeAmadeusFlights(offers) {
  return (offers || []).map((o, i) => {
    const seg = o.itineraries?.[0]?.segments?.[0];
    const lastSeg = o.itineraries?.[0]?.segments?.[o.itineraries[0].segments.length - 1];
    const price = o.price?.total ? parseFloat(o.price.total) : 0;
    return {
      id: o.id || `amadeus-${i}`,
      airline: seg?.carrierCode || o.validatingAirlineCodes?.[0] || '—',
      departure: seg?.departure?.at?.slice(11, 16) || '',
      arrival: lastSeg?.arrival?.at?.slice(11, 16) || '',
      duration: o.itineraries?.[0]?.duration?.replace('PT', '').toLowerCase() || '',
      price: Math.round(price),
      currency: o.price?.currency || 'INR',
    };
  });
}

function normalizeAmadeusHotels(offers) {
  return (offers || []).map((h, i) => ({
    id: h.hotel?.hotelId || `amadeus-h-${i}`,
    name: h.hotel?.name || 'Hotel',
    location: h.hotel?.cityCode || '',
    price: Math.round(parseFloat(h.offers?.[0]?.price?.total || 0)),
    currency: h.offers?.[0]?.price?.currency || 'INR',
    rating: null,
  }));
}

export function isConfigured() {
  return !!(process.env.AMADEUS_API_KEY && process.env.AMADEUS_API_SECRET);
}
