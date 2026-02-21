/**
 * Maps provider-specific responses to unified normalized structures.
 * Used by Amadeus, Skyscanner, etc. Mock provider returns normalized directly.
 */

const PROVIDER = 'amadeus';

/**
 * @param {Object} o - Amadeus flight offer
 * @param {number} i - Index
 * @returns {import('./schemas.js').NormalizedFlight}
 */
export function toFlightFromAmadeus(o, i = 0) {
  const seg = o.itineraries?.[0]?.segments?.[0];
  const lastSeg = o.itineraries?.[0]?.segments?.[o.itineraries?.[0]?.segments?.length - 1];
  const price = o.price?.total ? parseFloat(o.price.total) : 0;
  const depAt = seg?.departure?.at || '';
  const arrAt = lastSeg?.arrival?.at || '';
  return {
    id: o.id || `amadeus-${i}`,
    provider: PROVIDER,
    airline: seg?.carrierCode || o.validatingAirlineCodes?.[0] || '—',
    airlineLogo: undefined,
    departureAirport: seg?.departure?.iataCode || '',
    arrivalAirport: lastSeg?.arrival?.iataCode || '',
    departureTime: depAt.slice(11, 16) || '',
    arrivalTime: arrAt.slice(11, 16) || '',
    duration: o.itineraries?.[0]?.duration?.replace(/^PT/, '').toLowerCase() || '',
    stops: Math.max(0, (o.itineraries?.[0]?.segments?.length || 1) - 1),
    cabinClass: seg?.coverage?.cabin || 'ECONOMY',
    baggage: undefined,
    price: Math.round(price),
    currency: o.price?.currency || 'INR',
    refundable: false,
    cancellationPolicy: undefined,
    bookingUrl: undefined,
    images: [],
    rating: undefined,
  };
}

/**
 * @param {Object} h - Amadeus hotel offer
 * @param {number} i - Index
 * @returns {import('./schemas.js').NormalizedHotel}
 */
export function toHotelFromAmadeus(h, i = 0) {
  const offer = h.offers?.[0];
  const hotel = h.hotel || {};
  const total = offer?.price?.total ? parseFloat(offer.price.total) : 0;
  return {
    id: hotel.hotelId || `amadeus-h-${i}`,
    provider: PROVIDER,
    name: hotel.name || 'Hotel',
    slug: undefined,
    description: undefined,
    address: undefined,
    city: hotel.cityCode || '',
    country: undefined,
    latitude: undefined,
    longitude: undefined,
    starRating: undefined,
    reviewScore: undefined,
    reviewCount: undefined,
    amenities: [],
    images: [],
    roomTypes: [],
    cancellationPolicy: undefined,
    pricePerNight: Math.round(total),
    totalPrice: Math.round(total),
    currency: offer?.price?.currency || 'INR',
    available: true,
    bookingUrl: undefined,
  };
}

/**
 * Ensure flight object has all normalized fields (fill defaults).
 * @param {Object} raw
 * @returns {import('./schemas.js').NormalizedFlight}
 */
export function normalizeFlight(raw) {
  return {
    id: raw.id || raw._id || '',
    provider: raw.provider || 'mock',
    airline: raw.airline || '',
    airlineLogo: raw.airlineLogo,
    departureAirport: raw.departureAirport || raw.from || '',
    arrivalAirport: raw.arrivalAirport || raw.to || '',
    departureTime: raw.departureTime || raw.departure || '',
    arrivalTime: raw.arrivalTime || raw.arrival || '',
    duration: raw.duration || '',
    stops: Number(raw.stops) || 0,
    cabinClass: raw.cabinClass || raw.class || 'Economy',
    baggage: raw.baggage,
    price: Number(raw.price) || 0,
    currency: raw.currency || 'INR',
    refundable: !!raw.refundable,
    cancellationPolicy: raw.cancellationPolicy,
    bookingUrl: raw.bookingUrl,
    images: Array.isArray(raw.images) ? raw.images : raw.image ? [raw.image] : [],
    rating: raw.rating,
  };
}

/**
 * Ensure hotel object has all normalized fields.
 * @param {Object} raw
 * @returns {import('./schemas.js').NormalizedHotel}
 */
export function normalizeHotel(raw) {
  return {
    id: raw.id || raw._id || '',
    provider: raw.provider || 'mock',
    name: raw.name || '',
    slug: raw.slug,
    description: raw.description,
    address: raw.address,
    city: raw.city || raw.location || '',
    country: raw.country,
    latitude: raw.latitude,
    longitude: raw.longitude,
    starRating: raw.starRating ?? raw.rating,
    reviewScore: raw.reviewScore ?? raw.rating,
    reviewCount: raw.reviewCount,
    amenities: Array.isArray(raw.amenities) ? raw.amenities : [],
    images: Array.isArray(raw.images) ? raw.images : raw.image ? [raw.image] : [],
    roomTypes: Array.isArray(raw.roomTypes) ? raw.roomTypes : [],
    cancellationPolicy: raw.cancellationPolicy,
    pricePerNight: Number(raw.pricePerNight ?? raw.price) || 0,
    totalPrice: raw.totalPrice ?? raw.pricePerNight ?? raw.price,
    currency: raw.currency || 'INR',
    available: raw.available !== false,
    bookingUrl: raw.bookingUrl,
  };
}

/**
 * @param {Object} raw
 * @returns {import('./schemas.js').NormalizedCar}
 */
export function normalizeCar(raw) {
  return {
    id: raw.id || raw._id || '',
    provider: raw.provider || 'mock',
    name: raw.name || '',
    brand: raw.brand,
    type: raw.type,
    fuelType: raw.fuelType,
    transmission: raw.transmission,
    seats: raw.seats,
    luggage: raw.luggage,
    pickupLocation: raw.pickupLocation,
    dropLocation: raw.dropLocation,
    pricePerDay: Number(raw.pricePerDay ?? raw.price) || 0,
    currency: raw.currency || 'INR',
    images: Array.isArray(raw.images) ? raw.images : raw.image ? [raw.image] : [],
    bookingUrl: raw.bookingUrl,
  };
}

/**
 * @param {Object} raw
 * @returns {import('./schemas.js').NormalizedTour}
 */
export function normalizeTour(raw) {
  return {
    id: raw.id || raw._id || '',
    provider: raw.provider || 'mock',
    name: raw.name || '',
    slug: raw.slug,
    description: raw.description,
    destination: raw.destination,
    duration: raw.duration,
    rating: raw.rating,
    reviewCount: raw.reviewCount,
    images: Array.isArray(raw.images) ? raw.images : raw.image ? [raw.image] : [],
    price: Number(raw.price) || 0,
    currency: raw.currency || 'INR',
    inclusions: raw.inclusions,
    cancellationPolicy: raw.cancellationPolicy,
    bookingUrl: raw.bookingUrl,
  };
}

/**
 * @param {Object} raw
 * @returns {import('./schemas.js').NormalizedBus}
 */
export function normalizeBus(raw) {
  return {
    id: raw.id || raw._id || '',
    provider: raw.provider || 'mock',
    operator: raw.operator || '',
    departureCity: raw.departureCity || '',
    arrivalCity: raw.arrivalCity || '',
    departureTime: raw.departureTime || '',
    arrivalTime: raw.arrivalTime || '',
    duration: raw.duration || '',
    busType: raw.busType,
    price: Number(raw.price) || 0,
    currency: raw.currency || 'INR',
    amenities: Array.isArray(raw.amenities) ? raw.amenities : [],
    bookingUrl: raw.bookingUrl,
  };
}

/**
 * @param {Object} raw
 * @returns {import('./schemas.js').NormalizedCruise}
 */
export function normalizeCruise(raw) {
  return {
    id: raw.id || raw._id || '',
    provider: raw.provider || 'mock',
    name: raw.name || '',
    slug: raw.slug,
    description: raw.description,
    shipName: raw.shipName,
    duration: raw.duration,
    ports: Array.isArray(raw.ports) ? raw.ports : [],
    price: Number(raw.price) || 0,
    currency: raw.currency || 'INR',
    rating: raw.rating,
    images: Array.isArray(raw.images) ? raw.images : raw.image ? [raw.image] : [],
    bookingUrl: raw.bookingUrl,
  };
}

/**
 * @param {Object} raw
 * @returns {import('./schemas.js').NormalizedVisa}
 */
export function normalizeVisa(raw) {
  return {
    id: raw.id || raw._id || '',
    provider: raw.provider || 'mock',
    country: raw.country || '',
    slug: raw.slug,
    type: raw.type,
    processingTime: raw.processingTime,
    price: Number(raw.price) || 0,
    currency: raw.currency || 'INR',
    requirements: Array.isArray(raw.requirements) ? raw.requirements : [],
    bookingUrl: raw.bookingUrl,
  };
}

/**
 * @param {Object} raw
 * @returns {import('./schemas.js').NormalizedPackage}
 */
export function normalizePackage(raw) {
  return {
    id: raw.id || raw._id || '',
    provider: raw.provider || 'mock',
    name: raw.name || '',
    slug: raw.slug,
    description: raw.description,
    destinations: Array.isArray(raw.destinations) ? raw.destinations : [],
    duration: raw.duration,
    price: Number(raw.price) || 0,
    currency: raw.currency || 'INR',
    inclusions: Array.isArray(raw.inclusions) ? raw.inclusions : [],
    rating: raw.rating,
    images: Array.isArray(raw.images) ? raw.images : raw.image ? [raw.image] : [],
    bookingUrl: raw.bookingUrl,
  };
}
