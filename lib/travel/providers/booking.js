/**
 * Booking.com – when API key is set, implement real hotel search and return normalized data.
 */

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
  return !!process.env.BOOKING_API_KEY;
}
