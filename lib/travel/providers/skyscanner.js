/**
 * Skyscanner – when API key is set, implement real search and return normalized data.
 * For now returns empty; affiliate URL helper available.
 */

export function getAffiliateUrl(origin, destination, dateOut, dateBack = '') {
  const o = (origin || 'DEL').toString().toUpperCase().slice(0, 3);
  const d = (destination || 'BOM').toString().toUpperCase().slice(0, 3);
  const out = dateOut || new Date().toISOString().slice(0, 10);
  let path = `${o}/${d}/${out}`;
  if (dateBack) path += `/${dateBack}`;
  return `https://www.skyscanner.net/transport/flights/${path}`;
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
  return !!process.env.SKYSCANNER_API_KEY;
}
