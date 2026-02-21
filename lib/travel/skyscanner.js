/**
 * Skyscanner – affiliate/API. When approved, add API calls here.
 * For now: affiliate URL builder for earning. Set SKYSCANNER_API_KEY when you have API access.
 */

export function getAffiliateUrl(origin, destination, dateOut, dateBack = '') {
  const o = (origin || 'DEL').toString().toUpperCase().slice(0, 3);
  const d = (destination || 'BOM').toString().toUpperCase().slice(0, 3);
  const out = dateOut || new Date().toISOString().slice(0, 10);
  let path = `${o}/${d}/${out}`;
  if (dateBack) path += `/${dateBack}`;
  return `https://www.skyscanner.net/transport/flights/${path}`;
}

/**
 * When Skyscanner API is approved, implement real search and return normalized flights.
 * @param {{ origin?: string, destination?: string, date?: string, adults?: number }} params
 */
export async function searchFlights(params) {
  if (!process.env.SKYSCANNER_API_KEY) return [];
  // TODO: call Skyscanner API when key is set; normalize to common format
  return [];
}

export function isConfigured() {
  return !!process.env.SKYSCANNER_API_KEY;
}
