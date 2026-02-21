/**
 * Unified API provider interface for Trips To Travels.
 * All providers return the same shape so frontend never changes when switching API.
 *
 * Standardized format:
 * { id, type, title, description, images, location, price, currency, rating, amenities, source: "api" | "manual" }
 *
 * Use TRAVEL_PROVIDER env: mock | amadeus | skyscanner | booking
 */

import * as amadeus from './amadeus.js';
import * as skyscanner from './skyscanner.js';
import * as booking from './booking.js';
import * as mock from './mock.js';

const PROVIDER_NAME = (process.env.TRAVEL_PROVIDER || 'mock').toLowerCase();
const PROVIDERS = { amadeus, skyscanner, booking, mock };

function getProvider() {
  const p = PROVIDERS[PROVIDER_NAME] || mock;
  if (typeof p.isConfigured === 'function' && !p.isConfigured()) return mock;
  return p;
}

/**
 * Map flight to unified format.
 * @param {Object} f - Normalized flight from provider
 * @returns {Object} Unified item
 */
function toUnifiedFlight(f) {
  return {
    id: f.id,
    type: 'flight',
    title: `${f.airline || 'Flight'} ${f.departureAirport || ''} → ${f.arrivalAirport || ''}`,
    description: `${f.duration || ''} · ${f.cabinClass || 'Economy'}${f.stops > 0 ? ` · ${f.stops} stop(s)` : ''}`,
    images: f.images || [],
    location: `${f.departureAirport || ''} - ${f.arrivalAirport || ''}`,
    price: f.price,
    currency: f.currency || 'INR',
    rating: f.rating,
    amenities: f.baggage ? [f.baggage] : [],
    source: 'api',
  };
}

/**
 * Map hotel to unified format.
 * @param {Object} h - Normalized hotel from provider
 * @returns {Object} Unified item
 */
function toUnifiedHotel(h) {
  return {
    id: h.id,
    type: 'hotel',
    title: h.name,
    description: h.description || h.address || '',
    images: h.images || [],
    location: [h.city, h.country].filter(Boolean).join(', '),
    price: h.pricePerNight ?? h.totalPrice ?? 0,
    currency: h.currency || 'INR',
    rating: h.reviewScore ?? h.starRating,
    amenities: h.amenities || [],
    source: 'api',
  };
}

/**
 * Map tour to unified format.
 * @param {Object} t - Normalized tour from provider
 * @returns {Object} Unified item
 */
function toUnifiedTour(t) {
  return {
    id: t.id,
    type: 'tour',
    title: t.name || t.title,
    description: t.description || '',
    images: t.images || [],
    location: t.destination || t.location || '',
    price: t.price ?? 0,
    currency: t.currency || 'INR',
    rating: t.rating,
    amenities: t.included || [],
    source: 'api',
  };
}

/**
 * Get flights from active provider. Returns standardized format.
 * @param {Object} params - { origin, destination, date, adults, ... }
 * @returns {Promise<Array<{ id, type, title, description, images, location, price, currency, rating, amenities, source }>>}
 */
export async function getFlights(params = {}) {
  const provider = getProvider();
  const list = await (provider.searchFlights?.(params) ?? Promise.resolve([]));
  return (list || []).map((f) => toUnifiedFlight(f));
}

/**
 * Get hotels from active provider. Returns standardized format.
 * @param {Object} params - { cityCode, search, checkIn, checkOut, adults, ... }
 * @returns {Promise<Array<{ id, type, title, description, images, location, price, currency, rating, amenities, source }>>}
 */
export async function getHotels(params = {}) {
  const provider = getProvider();
  const list = await (provider.searchHotels?.(params) ?? Promise.resolve([]));
  return (list || []).map((h) => toUnifiedHotel(h));
}

/**
 * Get tours from active provider. Returns standardized format.
 * @param {Object} params - { destination, date, ... }
 * @returns {Promise<Array<{ id, type, title, description, images, location, price, currency, rating, amenities, source }>>}
 */
export async function getTours(params = {}) {
  const provider = getProvider();
  const list = await (provider.searchTours?.(params) ?? Promise.resolve([]));
  return (list || []).map((t) => toUnifiedTour(t));
}

export { amadeus, skyscanner, booking, mock };
