/**
 * Unified normalized data structures for all travel types.
 * All providers must map their response to these shapes.
 * Frontend never sees provider-specific fields.
 */

/** @typedef {Object} NormalizedFlight
 * @property {string} id
 * @property {string} provider
 * @property {string} airline
 * @property {string} [airlineLogo]
 * @property {string} departureAirport
 * @property {string} arrivalAirport
 * @property {string} departureTime
 * @property {string} arrivalTime
 * @property {string} duration
 * @property {number} stops
 * @property {string} cabinClass
 * @property {string} [baggage]
 * @property {number} price
 * @property {string} currency
 * @property {boolean} [refundable]
 * @property {string} [cancellationPolicy]
 * @property {string} [bookingUrl]
 * @property {string[]} [images]
 * @property {number} [rating]
 */

/** @typedef {Object} NormalizedHotel
 * @property {string} id
 * @property {string} provider
 * @property {string} name
 * @property {string} [slug]
 * @property {string} [description]
 * @property {string} [address]
 * @property {string} city
 * @property {string} [country]
 * @property {number} [latitude]
 * @property {number} [longitude]
 * @property {number} [starRating]
 * @property {number} [reviewScore]
 * @property {number} [reviewCount]
 * @property {string[]} [amenities]
 * @property {string[]} [images]
 * @property {Array<{name:string, price?:number}>} [roomTypes]
 * @property {string} [cancellationPolicy]
 * @property {number} pricePerNight
 * @property {number} [totalPrice]
 * @property {string} currency
 * @property {boolean} [available]
 * @property {string} [bookingUrl]
 */

/** @typedef {Object} NormalizedCar
 * @property {string} id
 * @property {string} provider
 * @property {string} name
 * @property {string} [brand]
 * @property {string} [type]
 * @property {string} [fuelType]
 * @property {string} [transmission]
 * @property {number} [seats]
 * @property {number} [luggage]
 * @property {string} [pickupLocation]
 * @property {string} [dropLocation]
 * @property {number} pricePerDay
 * @property {string} currency
 * @property {string[]} [images]
 * @property {string} [bookingUrl]
 */

/** @typedef {Object} NormalizedTour
 * @property {string} id
 * @property {string} provider
 * @property {string} name
 * @property {string} [slug]
 * @property {string} [description]
 * @property {string} [destination]
 * @property {string} [duration]
 * @property {number} [rating]
 * @property {number} [reviewCount]
 * @property {string[]} [images]
 * @property {number} price
 * @property {string} currency
 * @property {string} [inclusions]
 * @property {string} [cancellationPolicy]
 * @property {string} [bookingUrl]
 */

/** @typedef {Object} NormalizedBus
 * @property {string} id
 * @property {string} provider
 * @property {string} operator
 * @property {string} departureCity
 * @property {string} arrivalCity
 * @property {string} departureTime
 * @property {string} arrivalTime
 * @property {string} duration
 * @property {string} [busType]
 * @property {number} price
 * @property {string} currency
 * @property {string[]} [amenities]
 * @property {string} [bookingUrl]
 */

/** @typedef {Object} NormalizedCruise
 * @property {string} id
 * @property {string} provider
 * @property {string} name
 * @property {string} [slug]
 * @property {string} [description]
 * @property {string} [shipName]
 * @property {string} [duration]
 * @property {string[]} [ports]
 * @property {number} price
 * @property {string} currency
 * @property {number} [rating]
 * @property {string[]} [images]
 * @property {string} [bookingUrl]
 */

/** @typedef {Object} NormalizedVisa
 * @property {string} id
 * @property {string} provider
 * @property {string} country
 * @property {string} [slug]
 * @property {string} [type]
 * @property {string} [processingTime]
 * @property {number} price
 * @property {string} currency
 * @property {string[]} [requirements]
 * @property {string} [bookingUrl]
 */

/** @typedef {Object} NormalizedPackage
 * @property {string} id
 * @property {string} provider
 * @property {string} name
 * @property {string} [slug]
 * @property {string} [description]
 * @property {string[]} [destinations]
 * @property {string} [duration]
 * @property {number} price
 * @property {string} currency
 * @property {string[]} [inclusions]
 * @property {number} [rating]
 * @property {string[]} [images]
 * @property {string} [bookingUrl]
 */

export const SCHEMAS = Object.freeze({
  flight: 'flight',
  hotel: 'hotel',
  car: 'car',
  tour: 'tour',
  bus: 'bus',
  cruise: 'cruise',
  visa: 'visa',
  package: 'package',
});
