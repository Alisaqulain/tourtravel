/**
 * Booking service – orchestrates hotel/flight/train bookings.
 * Uses apiClients (Booking.com, Agoda, Skyscanner) when integrated.
 * Currently works with mock data and app/api/bookings.
 */

// import * as bookingClient from '@/lib/apiClients/booking';
// import * as skyscannerClient from '@/lib/apiClients/skyscanner';

export async function searchHotels(params) {
  // TODO: call booking/agoda APIs via apiClients
  return { results: [], total: 0 };
}

export async function searchFlights(params) {
  // TODO: call Skyscanner API via apiClients
  return { results: [], total: 0 };
}

export async function createBooking(userId, payload) {
  // Use app/api/bookings or external API when ready
  return { success: false, bookingId: null };
}
