import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { flights as defaultFlights } from '@/data/flights';
import { hotels as defaultHotels } from '@/data/hotels';
import { tours as defaultTours } from '@/data/tours';
import { packages as defaultPackages } from '@/data/packages';

function nextId(items, prefix) {
  const nums = items.map((i) => parseInt((i.id || '').replace(prefix, ''), 10)).filter(Boolean);
  const max = nums.length ? Math.max(...nums) : 0;
  return `${prefix}${String(max + 1).padStart(3, '0')}`;
}

export const useDataStore = create(
  persist(
    (set, get) => ({
      flights: defaultFlights,
      hotels: defaultHotels,
      tours: defaultTours,
      packages: defaultPackages,

      // Flights
      setFlights: (flights) => set({ flights }),
      addFlight: (flight) =>
        set((s) => ({
          flights: [...s.flights, { ...flight, id: flight.id || nextId(s.flights, 'FL') }],
        })),
      updateFlight: (id, updates) =>
        set((s) => ({
          flights: s.flights.map((f) => (f.id === id ? { ...f, ...updates } : f)),
        })),
      deleteFlight: (id) => set((s) => ({ flights: s.flights.filter((f) => f.id !== id) })),

      // Hotels
      setHotels: (hotels) => set({ hotels }),
      addHotel: (hotel) =>
        set((s) => ({
          hotels: [...s.hotels, { ...hotel, id: hotel.id || nextId(s.hotels, 'HT') }],
        })),
      updateHotel: (id, updates) =>
        set((s) => ({
          hotels: s.hotels.map((h) => (h.id === id ? { ...h, ...updates } : h)),
        })),
      deleteHotel: (id) => set((s) => ({ hotels: s.hotels.filter((h) => h.id !== id) })),

      // Tours
      setTours: (tours) => set({ tours }),
      addTour: (tour) =>
        set((s) => ({
          tours: [...s.tours, { ...tour, id: tour.id || nextId(s.tours, 'TR') }],
        })),
      updateTour: (id, updates) =>
        set((s) => ({
          tours: s.tours.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        })),
      deleteTour: (id) => set((s) => ({ tours: s.tours.filter((t) => t.id !== id) })),

      // Packages
      setPackages: (packages) => set({ packages }),
      addPackage: (pkg) =>
        set((s) => ({
          packages: [...s.packages, { ...pkg, id: pkg.id || nextId(s.packages, 'PK') }],
        })),
      updatePackage: (id, updates) =>
        set((s) => ({
          packages: s.packages.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        })),
      deletePackage: (id) => set((s) => ({ packages: s.packages.filter((p) => p.id !== id) })),

      // Reset to defaults
      resetAllData: () =>
        set({
          flights: defaultFlights,
          hotels: defaultHotels,
          tours: defaultTours,
          packages: defaultPackages,
        }),
    }),
    { name: 'trips-data-storage' }
  )
);
