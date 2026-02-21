/**
 * Booking.com API provider stub.
 * Configure with BOOKING_API_KEY or affiliate credentials.
 * Implement searchHotels (and possibly flights/tours if available).
 */

function isConfigured() {
  return !!(process.env.BOOKING_API_KEY || process.env.BOOKING_PARTNER_ID);
}

async function searchFlights(params = {}) {
  return [];
}

async function searchHotels(params = {}) {
  if (!isConfigured()) return [];
  // TODO: call Booking.com API, map to normalized format
  return [];
}

async function searchTours(params = {}) {
  return [];
}

export default { isConfigured, searchFlights, searchHotels, searchTours };
export { isConfigured, searchFlights, searchHotels, searchTours };
