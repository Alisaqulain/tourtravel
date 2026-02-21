/**
 * Mock travel provider – realistic demo data for all categories.
 * Used when TRAVEL_PROVIDER=mock or no real API keys. UI stays fully functional.
 */

const PROVIDER = 'mock';

const AIRLINES = [
  { name: 'SkyWings', logo: '/images/airlines/skywings.png' },
  { name: 'GlobalAir', logo: '/images/airlines/globalair.png' },
  { name: 'EuroJet', logo: '/images/airlines/eurojet.png' },
  { name: 'Pacific Express', logo: '/images/airlines/pacific.png' },
  { name: 'IndiGo', logo: '/images/airlines/indigo.png' },
  { name: 'Air India', logo: '/images/airlines/airindia.png' },
];

const ROUTES = [
  { from: 'DEL', to: 'BOM', fromName: 'New Delhi', toName: 'Mumbai' },
  { from: 'BOM', to: 'GOI', fromName: 'Mumbai', toName: 'Goa' },
  { from: 'BLR', to: 'DEL', fromName: 'Bangalore', toName: 'New Delhi' },
  { from: 'CCU', to: 'BOM', fromName: 'Kolkata', toName: 'Mumbai' },
  { from: 'MAA', to: 'HYD', fromName: 'Chennai', toName: 'Hyderabad' },
  { from: 'DEL', to: 'DXB', fromName: 'New Delhi', toName: 'Dubai' },
  { from: 'BOM', to: 'SIN', fromName: 'Mumbai', toName: 'Singapore' },
];

const FLIGHT_IMAGES = [
  'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800',
  'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800',
  'https://images.unsplash.com/photo-1514214246283-d427a95c5d2f?w=800',
  'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800',
];

const HOTEL_IMAGES = [
  'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800',
  'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
  'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800',
  'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800',
];

const HOTELS = [
  { name: 'Grand Marina Resort', city: 'Maldives', country: 'Maldives', stars: 5 },
  { name: 'Skyline Suites', city: 'Dubai', country: 'UAE', stars: 5 },
  { name: 'Alpine Lodge', city: 'Swiss Alps', country: 'Switzerland', stars: 5 },
  { name: 'Santorini View Hotel', city: 'Santorini', country: 'Greece', stars: 4 },
  { name: 'Metro Central', city: 'Mumbai', country: 'India', stars: 4 },
  { name: 'Goa Beach Resort', city: 'Goa', country: 'India', stars: 5 },
  { name: 'Rajasthan Heritage', city: 'Jaipur', country: 'India', stars: 5 },
  { name: 'Kerala Backwaters Stay', city: 'Kochi', country: 'India', stars: 4 },
];

const AMENITIES = ['Pool', 'Spa', 'WiFi', 'Gym', 'Restaurant', 'Bar', 'Beach', 'Free cancellation'];

const CARS = [
  { name: 'Toyota Innova', brand: 'Toyota', type: 'SUV', fuel: 'Diesel', trans: 'Automatic', seats: 7 },
  { name: 'Honda City', brand: 'Honda', type: 'Sedan', fuel: 'Petrol', trans: 'Automatic', seats: 5 },
  { name: 'Maruti Ertiga', brand: 'Maruti', type: 'MPV', fuel: 'Petrol', trans: 'Manual', seats: 7 },
  { name: 'Hyundai Creta', brand: 'Hyundai', type: 'SUV', fuel: 'Petrol', trans: 'Automatic', seats: 5 },
  { name: 'Mercedes E-Class', brand: 'Mercedes', type: 'Luxury', fuel: 'Diesel', trans: 'Automatic', seats: 5 },
];

const TOURS = [
  { name: 'Golden Triangle', destination: 'Delhi, Agra, Jaipur', duration: '5D/4N' },
  { name: 'Kerala Backwaters', destination: 'Kerala', duration: '4D/3N' },
  { name: 'Ladakh Explorer', destination: 'Leh, Nubra', duration: '7D/6N' },
  { name: 'Goa Beach Tour', destination: 'Goa', duration: '3D/2N' },
  { name: 'Rajasthan Heritage', destination: 'Rajasthan', duration: '6D/5N' },
];

const BUS_OPERATORS = ['RedBus', 'VRL', 'Orange', 'Sharma Travels', 'Neeta Volvo'];
const BUS_ROUTES = [
  { dep: 'Mumbai', arr: 'Pune' },
  { dep: 'Bangalore', arr: 'Chennai' },
  { dep: 'Delhi', arr: 'Jaipur' },
  { dep: 'Hyderabad', arr: 'Bangalore' },
];

const CRUISES = [
  { name: 'Mumbai – Goa Cruise', ship: 'Ocean Queen', duration: '2 Nights' },
  { name: 'Singapore – Penang', ship: 'Star Cruises', duration: '3 Nights' },
  { name: 'Mediterranean Explorer', ship: 'Royal Voyager', duration: '7 Nights' },
];

const VISAS = [
  { country: 'Thailand', type: 'Tourist', processing: '3-5 days' },
  { country: 'Dubai', type: 'Tourist', processing: '2-4 days' },
  { country: 'Singapore', type: 'Tourist', processing: '3-5 days' },
  { country: 'UK', type: 'Tourist', processing: '15-20 days' },
  { country: 'USA', type: 'Tourist', processing: '21-30 days' },
];

const PACKAGES = [
  { name: 'Best of North India', destinations: ['Delhi', 'Agra', 'Jaipur'], duration: '6D/5N' },
  { name: 'South India Highlights', destinations: ['Kerala', 'Tamil Nadu'], duration: '7D/6N' },
  { name: 'Beach & Backwaters', destinations: ['Goa', 'Kerala'], duration: '5D/4N' },
  { name: 'Himalayan Escape', destinations: ['Manali', 'Shimla'], duration: '5D/4N' },
];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function pickN(arr, n) {
  const shuf = [...arr].sort(() => Math.random() - 0.5);
  return shuf.slice(0, n);
}
function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function slug(s) {
  return (s || '').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export async function searchFlights(params = {}) {
  const origin = (params.origin || 'DEL').toUpperCase().slice(0, 3);
  const destination = (params.destination || 'BOM').toUpperCase().slice(0, 3);
  const count = rand(8, 18);
  const results = [];
  for (let i = 0; i < count; i++) {
    const route = pick(ROUTES);
    const air = pick(AIRLINES);
    const depH = rand(5, 22);
    const depM = pick([0, 15, 30, 45]);
    const durMin = rand(60, 480);
    const arrMin = depH * 60 + depM + durMin;
    const arrH = Math.floor(arrMin / 60) % 24;
    const arrM = arrMin % 60;
    const stops = pick([0, 0, 0, 1, 1, 2]);
    const basePrice = rand(3500, 25000);
    const price = stops === 0 ? Math.round(basePrice * 1.1) : basePrice;
    results.push({
      id: `mock-fl-${Date.now()}-${i}`,
      provider: PROVIDER,
      airline: air.name,
      airlineLogo: air.logo,
      departureAirport: params.origin ? origin : route.from,
      arrivalAirport: params.destination ? destination : route.to,
      departureTime: `${String(depH).padStart(2, '0')}:${String(depM).padStart(2, '0')}`,
      arrivalTime: `${String(arrH).padStart(2, '0')}:${String(arrM).padStart(2, '0')}`,
      duration: `${Math.floor(durMin / 60)}h ${durMin % 60}m`,
      stops,
      cabinClass: pick(['Economy', 'Economy', 'Premium Economy', 'Business']),
      baggage: stops === 0 ? '15 kg' : '20 kg',
      price,
      currency: 'INR',
      refundable: Math.random() > 0.6,
      cancellationPolicy: 'As per airline policy. Refundable fares may apply fee.',
      bookingUrl: null,
      images: pickN(FLIGHT_IMAGES, 4),
      rating: rand(38, 50) / 10,
    });
  }
  return results.sort((a, b) => a.price - b.price);
}

export async function searchHotels(params = {}) {
  const count = rand(10, 20);
  const results = [];
  for (let i = 0; i < count; i++) {
    const h = pick(HOTELS);
    const pricePerNight = rand(2500, 15000);
    const images = pickN(HOTEL_IMAGES, 5);
    results.push({
      id: `mock-ht-${Date.now()}-${i}`,
      provider: PROVIDER,
      name: h.name,
      slug: slug(h.name) + '-' + i,
      description: `Experience luxury at ${h.name} in ${h.city}. Perfect for leisure and business.`,
      address: `${rand(1, 200)} Main Street`,
      city: h.city,
      country: h.country,
      latitude: 12 + Math.random() * 20,
      longitude: 72 + Math.random() * 25,
      starRating: h.stars,
      reviewScore: rand(38, 50) / 10,
      reviewCount: rand(500, 3000),
      amenities: pickN(AMENITIES, rand(4, 8)),
      images,
      roomTypes: [
        { name: 'Standard Room', price: pricePerNight },
        { name: 'Deluxe Room', price: Math.round(pricePerNight * 1.3) },
        { name: 'Suite', price: Math.round(pricePerNight * 2) },
      ],
      cancellationPolicy: 'Free cancellation until 24 hours before check-in.',
      pricePerNight,
      totalPrice: pricePerNight * (params.nights || 2),
      currency: 'INR',
      available: true,
      bookingUrl: null,
    });
  }
  return results.sort((a, b) => a.pricePerNight - b.pricePerNight);
}

export async function searchCars(params = {}) {
  const count = rand(6, 12);
  const results = [];
  for (let i = 0; i < count; i++) {
    const c = pick(CARS);
    const pricePerDay = rand(1500, 8000);
    results.push({
      id: `mock-car-${Date.now()}-${i}`,
      provider: PROVIDER,
      name: c.name,
      brand: c.brand,
      type: c.type,
      fuelType: c.fuel,
      transmission: c.trans,
      seats: c.seats,
      luggage: rand(2, 4),
      pickupLocation: params.pickUp || params.pickupLocation || 'City Center',
      dropLocation: params.dropOff || params.dropLocation || 'City Center',
      pricePerDay,
      currency: 'INR',
      images: ['https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800'],
      bookingUrl: null,
    });
  }
  return results.sort((a, b) => a.pricePerDay - b.pricePerDay);
}

export async function searchTours(params = {}) {
  const count = rand(6, 14);
  const results = [];
  for (let i = 0; i < count; i++) {
    const t = pick(TOURS);
    const price = rand(8000, 85000);
    results.push({
      id: `mock-tour-${Date.now()}-${i}`,
      provider: PROVIDER,
      name: t.name,
      slug: slug(t.name) + '-' + i,
      description: `Explore ${t.destination} with our curated ${t.name} package. Includes accommodation, transport and key experiences.`,
      destination: t.destination,
      duration: t.duration,
      rating: rand(42, 50) / 10,
      reviewCount: rand(100, 1200),
      images: pickN(HOTEL_IMAGES, 4),
      price,
      currency: 'INR',
      inclusions: 'Accommodation, Transport, Guide, Meals as per itinerary',
      cancellationPolicy: 'Free cancellation 7 days before start.',
      bookingUrl: null,
    });
  }
  return results.sort((a, b) => a.price - b.price);
}

export async function searchBus(params = {}) {
  const count = rand(5, 12);
  const results = [];
  for (let i = 0; i < count; i++) {
    const r = pick(BUS_ROUTES);
    const depH = rand(6, 22);
    const durMin = rand(240, 600);
    const arrMin = depH * 60 + durMin;
    const arrH = Math.floor(arrMin / 60) % 24;
    results.push({
      id: `mock-bus-${Date.now()}-${i}`,
      provider: PROVIDER,
      operator: pick(BUS_OPERATORS),
      departureCity: r.dep,
      arrivalCity: r.arr,
      departureTime: `${String(depH).padStart(2, '0')}:00`,
      arrivalTime: `${String(arrH).padStart(2, '0')}:${String(durMin % 60).padStart(2, '0')}`,
      duration: `${Math.floor(durMin / 60)}h ${durMin % 60}m`,
      busType: pick(['AC Sleeper', 'Non-AC', 'Volvo', 'Seater']),
      price: rand(500, 3500),
      currency: 'INR',
      amenities: pickN(['AC', 'Charging', 'WiFi', 'Blanket'], rand(2, 4)),
      bookingUrl: null,
    });
  }
  return results.sort((a, b) => a.price - b.price);
}

export async function searchCruise(params = {}) {
  const count = rand(4, 8);
  const results = [];
  for (let i = 0; i < count; i++) {
    const c = pick(CRUISES);
    const price = rand(15000, 95000);
    results.push({
      id: `mock-cruise-${Date.now()}-${i}`,
      provider: PROVIDER,
      name: c.name,
      slug: slug(c.name) + '-' + i,
      description: `Sail with ${c.ship}. ${c.duration} of luxury.`,
      shipName: c.ship,
      duration: c.duration,
      ports: ['Mumbai', 'Goa', 'Cochin'],
      price,
      currency: 'INR',
      rating: rand(42, 50) / 10,
      images: pickN(HOTEL_IMAGES, 4),
      bookingUrl: null,
    });
  }
  return results.sort((a, b) => a.price - b.price);
}

export async function searchVisa(params = {}) {
  const count = rand(4, 8);
  const results = [];
  for (let i = 0; i < count; i++) {
    const v = pick(VISAS);
    const price = rand(2500, 15000);
    results.push({
      id: `mock-visa-${Date.now()}-${i}`,
      provider: PROVIDER,
      country: v.country,
      slug: slug(v.country),
      type: v.type,
      processingTime: v.processing,
      price,
      currency: 'INR',
      requirements: ['Passport', 'Photo', 'Application form', 'Proof of travel'],
      bookingUrl: null,
    });
  }
  return results.sort((a, b) => a.price - b.price);
}

export async function searchPackages(params = {}) {
  const count = rand(5, 12);
  const results = [];
  for (let i = 0; i < count; i++) {
    const p = pick(PACKAGES);
    const price = rand(15000, 120000);
    results.push({
      id: `mock-pkg-${Date.now()}-${i}`,
      provider: PROVIDER,
      name: p.name,
      slug: slug(p.name) + '-' + i,
      description: `All-inclusive package: ${p.destinations.join(', ')}. Duration: ${p.duration}.`,
      destinations: p.destinations,
      duration: p.duration,
      price,
      currency: 'INR',
      inclusions: ['Flights', 'Hotels', 'Transport', 'Sightseeing', 'Meals'],
      rating: rand(42, 50) / 10,
      images: pickN(HOTEL_IMAGES, 4),
      bookingUrl: null,
    });
  }
  return results.sort((a, b) => a.price - b.price);
}

export function isConfigured() {
  return true;
}
