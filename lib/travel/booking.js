/**
 * Booking.com Demand API – hotels. Set BOOKING_API_KEY when approved.
 */

export async function searchHotels(params = {}) {
  if (!process.env.BOOKING_API_KEY) return [];
  // TODO: implement Booking.com Demand API when key is set
  return [];
}

export function isConfigured() {
  return !!process.env.BOOKING_API_KEY;
}
