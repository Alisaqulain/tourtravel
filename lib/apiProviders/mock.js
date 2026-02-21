/**
 * Mock API provider for development. Always configured.
 */

function isConfigured() {
  return true;
}

async function searchFlights(params = {}) {
  return [
    {
      id: 'mock-f-1',
      airline: 'Mock Air',
      departureAirport: 'DEL',
      arrivalAirport: 'BOM',
      departureTime: '10:00',
      arrivalTime: '12:00',
      duration: '2h',
      stops: 0,
      cabinClass: 'Economy',
      price: 5000,
      currency: 'INR',
      images: [],
      rating: 4.5,
    },
  ];
}

async function searchHotels(params = {}) {
  return [
    {
      id: 'mock-h-1',
      name: 'Mock Hotel',
      city: 'Mumbai',
      country: 'India',
      pricePerNight: 3000,
      currency: 'INR',
      images: [],
      amenities: ['WiFi', 'Pool'],
      reviewScore: 4.2,
    },
  ];
}

async function searchTours(params = {}) {
  return [
    {
      id: 'mock-t-1',
      name: 'Mock Tour',
      destination: 'Goa',
      price: 8000,
      currency: 'INR',
      images: [],
      included: ['Guide', 'Meals'],
      rating: 4.8,
    },
  ];
}

export default { isConfigured, searchFlights, searchHotels, searchTours };
export { isConfigured, searchFlights, searchHotels, searchTours };
