/**
 * Amadeus API – flights & hotels. Returns normalized shape via mapper.
 * Set AMADEUS_API_KEY, AMADEUS_API_SECRET. Optional AMADEUS_BASE.
 */

import { toFlightFromAmadeus, toHotelFromAmadeus } from '../mapper.js';

const BASE = process.env.AMADEUS_BASE || 'https://test.api.amadeus.com';

export async function getToken() {
  const key = process.env.AMADEUS_API_KEY;
  const secret = process.env.AMADEUS_API_SECRET;
  if (!key || !secret) return null;
  const res = await fetch(`${BASE}/v1/security/oauth2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: key,
      client_secret: secret,
    }),
  });
  if (!res.ok) throw new Error(`Amadeus auth failed: ${res.status}`);
  const data = await res.json();
  return data.access_token;
}

export async function searchFlights(params = {}) {
  const token = await getToken();
  if (!token) return [];
  const { origin = 'DEL', destination = 'BOM', date, adults = 1 } = params;
  const url = new URL(`${BASE}/v2/shopping/flight-offers`);
  url.searchParams.set('originLocationCode', (origin || 'DEL').toString().toUpperCase().slice(0, 3));
  url.searchParams.set('destinationLocationCode', (destination || 'BOM').toString().toUpperCase().slice(0, 3));
  url.searchParams.set('departureDate', date || new Date().toISOString().slice(0, 10));
  url.searchParams.set('adults', String(adults));

  const res = await fetch(url.toString(), { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error(`Amadeus flights: ${res.status}`);
  const data = await res.json();
  return (data.data || []).map((o, i) => toFlightFromAmadeus(o, i));
}

export async function searchHotels(params = {}) {
  const token = await getToken();
  if (!token) return [];
  const cityCode = (params.cityCode || 'DEL').toString().toUpperCase().slice(0, 3);
  const checkIn = params.checkIn || new Date().toISOString().slice(0, 10);
  const checkOut = params.checkOut || new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 10);

  const url = new URL(`${BASE}/v1/reference-data/locations/hotels/by-city`);
  url.searchParams.set('cityCode', cityCode);

  const res = await fetch(url.toString(), { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) return [];
  const data = await res.json();
  const hotelIds = (data.data || []).slice(0, 20).map((h) => h.hotelId).filter(Boolean);
  if (hotelIds.length === 0) return [];

  const offerRes = await fetch(
    `${BASE}/v1/shopping/hotel-offers?hotelIds=${hotelIds.join(',')}&adults=1&checkInDate=${checkIn}&checkOutDate=${checkOut}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!offerRes.ok) return [];
  const offerData = await offerRes.json();
  return (offerData.data || []).map((h, i) => toHotelFromAmadeus(h, i));
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
  return !!(process.env.AMADEUS_API_KEY && process.env.AMADEUS_API_SECRET);
}
