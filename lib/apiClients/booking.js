/**
 * Placeholder for Booking.com API client.
 * Replace with real implementation when API keys and approval are available.
 */

// const BOOKING_API_BASE = process.env.BOOKING_API_URL || 'https://api.booking.com';

export async function searchHotels(params) {
  // TODO: integrate Booking.com API
  return { results: [], total: 0 };
}

export async function getHotelDetails(hotelId) {
  return null;
}

export async function createBooking(payload) {
  return { success: false, bookingId: null };
}
