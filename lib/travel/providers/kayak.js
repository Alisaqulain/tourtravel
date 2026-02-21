/**
 * KAYAK – when API key is set, implement real search and return normalized data.
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

export async function searchFlights() {
  return [];
}
export async function searchHotels() {
  return [];
}
export async function searchCars() {
  return [];
}
export async function searchTours() {
  return [];
}
export async function searchBus() {
  return [];
}
export async function searchCruise() {
  return [];
}
export async function searchVisa() {
  return [];
}
export async function searchPackages() {
  return [];
}

export function isConfigured() {
  return !!process.env.KAYAK_API_KEY;
}
