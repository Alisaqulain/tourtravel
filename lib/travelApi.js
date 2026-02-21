/**
 * Travel API helpers – real data from external providers.
 * For earning: use Skyscanner/KAYAK/Booking.com affiliate APIs so you get commission.
 * See docs/BACKEND_TRAVEL_APIS.md for sign-up links and strategy.
 */

// Use test for dev (cached data); switch to https://api.amadeus.com for production (real-time).
const AMADEUS_BASE = process.env.AMADEUS_BASE || 'https://test.api.amadeus.com';

/**
 * Get Amadeus OAuth token (use in API routes only – never expose secret to client).
 * Set AMADEUS_API_KEY and AMADEUS_API_SECRET in .env.local.
 */
export async function getAmadeusToken() {
  const key = process.env.AMADEUS_API_KEY;
  const secret = process.env.AMADEUS_API_SECRET;
  if (!key || !secret) {
    throw new Error('AMADEUS_API_KEY and AMADEUS_API_SECRET must be set');
  }
  const res = await fetch(`${AMADEUS_BASE}/v1/security/oauth2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: key,
      client_secret: secret,
    }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Amadeus auth failed: ${res.status} ${t}`);
  }
  const data = await res.json();
  return data.access_token;
}

/**
 * Search flight offers via Amadeus (test env = cached data; production = real-time).
 * Use this in app/api/travel/flights/route.js and then link users to Skyscanner/KAYAK for booking to earn.
 *
 * @param {string} token - from getAmadeusToken()
 * @param {object} params - { origin, destination, date, adults }
 */
export async function searchFlightsAmadeus(token, params) {
  const { origin = 'DEL', destination = 'BOM', date, adults = 1 } = params || {};
  const url = new URL(`${AMADEUS_BASE}/v2/shopping/flight-offers`);
  url.searchParams.set('originLocationCode', origin);
  url.searchParams.set('destinationLocationCode', destination);
  url.searchParams.set('departureDate', date || new Date().toISOString().slice(0, 10));
  url.searchParams.set('adults', String(adults));

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Amadeus flight search failed: ${res.status} ${t}`);
  }
  const data = await res.json();
  return data;
}

/**
 * Build Skyscanner affiliate search URL (you earn when user books).
 * Use your partner redirect URL from Skyscanner after approval.
 */
export function getSkyscannerAffiliateUrl(origin, destination, dateOut, dateBack = '') {
  const base = 'https://www.skyscanner.net/transport/flights';
  const params = new URLSearchParams({
    origin: origin,
    destination: destination,
    outbounddate: dateOut,
  });
  if (dateBack) params.set('inbounddate', dateBack);
  return `${base}/${origin}/${destination}/${dateOut}${dateBack ? `/${dateBack}` : ''}`;
}

/**
 * Build KAYAK affiliate search URL (you earn on clicks/bookings).
 * Replace YOUR_AFFILIATE_ID with your KAYAK affiliate ID.
 */
export function getKayakAffiliateUrl(origin, destination, dateOut, dateBack = '') {
  const aid = process.env.KAYAK_AFFILIATE_ID || 'YOUR_AFFILIATE_ID';
  const base = 'https://www.kayak.com/flights';
  const params = new URLSearchParams({
    origin: origin,
    destination: destination,
    depart: dateOut,
  });
  if (dateBack) params.set('return', dateBack);
  return `${base}/${origin}-${destination}/${dateOut}${dateBack ? `/${dateBack}` : ''}?affiliateid=${aid}`;
}
