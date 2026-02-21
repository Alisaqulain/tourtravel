/**
 * KAYAK Affiliate – add API calls when approved. Set KAYAK_API_KEY.
 */

export function getAffiliateUrl(origin, destination, dateOut, dateBack = '') {
  const aid = process.env.KAYAK_AFFILIATE_ID || '';
  const o = (origin || 'DEL').toString();
  const d = (destination || 'BOM').toString();
  const out = dateOut || new Date().toISOString().slice(0, 10);
  let url = `https://www.kayak.com/flights/${o}-${d}/${out}`;
  if (dateBack) url += `/${dateBack}`;
  if (aid) url += `?affiliateid=${aid}`;
  return url;
}

export async function searchFlights(params) {
  if (!process.env.KAYAK_API_KEY) return [];
  return [];
}

export async function searchHotels(params) {
  if (!process.env.KAYAK_API_KEY) return [];
  return [];
}

export function isConfigured() {
  return !!process.env.KAYAK_API_KEY;
}
