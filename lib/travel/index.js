/**
 * Provider-agnostic travel engine. Frontend never knows which provider is active.
 * Switch via TRAVEL_PROVIDER env: mock | amadeus | skyscanner | kayak | booking
 */

import * as mockProvider from './providers/mock.js';
import * as amadeusProvider from './providers/amadeus.js';
import * as skyscannerProvider from './providers/skyscanner.js';
import * as kayakProvider from './providers/kayak.js';
import * as bookingProvider from './providers/booking.js';
import * as mapper from './mapper.js';

const ACTIVE_PROVIDER = (process.env.TRAVEL_PROVIDER || 'mock').toLowerCase();

const PROVIDERS = {
  mock: mockProvider,
  amadeus: amadeusProvider,
  skyscanner: skyscannerProvider,
  kayak: kayakProvider,
  booking: bookingProvider,
};

function getProvider() {
  const p = PROVIDERS[ACTIVE_PROVIDER] || mockProvider;
  if (p !== mockProvider && typeof p.isConfigured === 'function' && !p.isConfigured()) {
    return mockProvider;
  }
  return p;
}

/**
 * @param {{ origin?: string, destination?: string, date?: string, adults?: number, [key: string]: any }} params
 * @returns {Promise<Array<import('./schemas.js').NormalizedFlight>>}
 */
export async function searchFlights(params = {}) {
  const provider = getProvider();
  let list = await provider.searchFlights(params);
  if (!list?.length && provider !== mockProvider) {
    list = await mockProvider.searchFlights(params);
  }
  return (list || []).map((f) => mapper.normalizeFlight(f));
}

/**
 * @param {{ cityCode?: string, search?: string, checkIn?: string, checkOut?: string, adults?: number, maxPrice?: number, minRating?: number, nights?: number, [key: string]: any }} params
 * @returns {Promise<Array<import('./schemas.js').NormalizedHotel>>}
 */
export async function searchHotels(params = {}) {
  const provider = getProvider();
  let list = await provider.searchHotels(params);
  if (!list?.length && provider !== mockProvider) {
    list = await mockProvider.searchHotels(params);
  }
  return (list || []).map((h) => mapper.normalizeHotel(h));
}

/**
 * @param {{ pickUp?: string, dropOff?: string, from?: string, to?: string, [key: string]: any }} params
 * @returns {Promise<Array<import('./schemas.js').NormalizedCar>>}
 */
export async function searchCars(params = {}) {
  const provider = getProvider();
  let list = await provider.searchCars(params);
  if (!list?.length && provider !== mockProvider) {
    list = await mockProvider.searchCars(params);
  }
  return (list || []).map((c) => mapper.normalizeCar(c));
}

/**
 * @param {{ destination?: string, date?: string, [key: string]: any }} params
 * @returns {Promise<Array<import('./schemas.js').NormalizedTour>>}
 */
export async function searchTours(params = {}) {
  const provider = getProvider();
  let list = await provider.searchTours(params);
  if (!list?.length && provider !== mockProvider) {
    list = await mockProvider.searchTours(params);
  }
  return (list || []).map((t) => mapper.normalizeTour(t));
}

/**
 * @param {{ from?: string, to?: string, date?: string, [key: string]: any }} params
 * @returns {Promise<Array<import('./schemas.js').NormalizedBus>>}
 */
export async function searchBus(params = {}) {
  const provider = getProvider();
  let list = await provider.searchBus(params);
  if (!list?.length && provider !== mockProvider) {
    list = await mockProvider.searchBus(params);
  }
  return (list || []).map((b) => mapper.normalizeBus(b));
}

/**
 * @param {{ destination?: string, date?: string, [key: string]: any }} params
 * @returns {Promise<Array<import('./schemas.js').NormalizedCruise>>}
 */
export async function searchCruise(params = {}) {
  const provider = getProvider();
  let list = await provider.searchCruise(params);
  if (!list?.length && provider !== mockProvider) {
    list = await mockProvider.searchCruise(params);
  }
  return (list || []).map((c) => mapper.normalizeCruise(c));
}

/**
 * @param {{ country?: string, type?: string, [key: string]: any }} params
 * @returns {Promise<Array<import('./schemas.js').NormalizedVisa>>}
 */
export async function searchVisa(params = {}) {
  const provider = getProvider();
  let list = await provider.searchVisa(params);
  if (!list?.length && provider !== mockProvider) {
    list = await mockProvider.searchVisa(params);
  }
  return (list || []).map((v) => mapper.normalizeVisa(v));
}

/**
 * @param {{ destination?: string, duration?: string, [key: string]: any }} params
 * @returns {Promise<Array<import('./schemas.js').NormalizedPackage>>}
 */
export async function searchPackages(params = {}) {
  const provider = getProvider();
  let list = await provider.searchPackages(params);
  if (!list?.length && provider !== mockProvider) {
    list = await mockProvider.searchPackages(params);
  }
  return (list || []).map((p) => mapper.normalizePackage(p));
}

/** Affiliate / redirect URLs for earning when user books on partner site */
export const affiliate = {
  skyscanner: skyscannerProvider.getAffiliateUrl,
  kayak: kayakProvider.getAffiliateUrl,
};

export { mapper };
