/**
 * Amadeus API provider stub.
 * Configure with AMADEUS_CLIENT_ID, AMADEUS_CLIENT_SECRET.
 * Implement searchFlights, searchHotels using Amadeus SDK or REST.
 */

function isConfigured() {
  return !!(process.env.AMADEUS_CLIENT_ID && process.env.AMADEUS_CLIENT_SECRET);
}

async function searchFlights(params = {}) {
  if (!isConfigured()) return [];
  // TODO: call Amadeus Flight Offers Search API, map to normalized format
  return [];
}

async function searchHotels(params = {}) {
  if (!isConfigured()) return [];
  // TODO: call Amadeus Hotel Search API, map to normalized format
  return [];
}

async function searchTours(params = {}) {
  return [];
}

export default { isConfigured, searchFlights, searchHotels, searchTours };
export { isConfigured, searchFlights, searchHotels, searchTours };
