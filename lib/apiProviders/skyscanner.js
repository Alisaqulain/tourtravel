/**
 * Skyscanner API provider stub.
 * Configure with SKYSCANNER_API_KEY or RapidAPI key.
 * Implement searchFlights (and hotels if supported).
 */

function isConfigured() {
  return !!(process.env.SKYSCANNER_API_KEY || process.env.RAPIDAPI_KEY);
}

async function searchFlights(params = {}) {
  if (!isConfigured()) return [];
  // TODO: call Skyscanner/RapidAPI, map to normalized format
  return [];
}

async function searchHotels(params = {}) {
  return [];
}

async function searchTours(params = {}) {
  return [];
}

export default { isConfigured, searchFlights, searchHotels, searchTours };
export { isConfigured, searchFlights, searchHotels, searchTours };
