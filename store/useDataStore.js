import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { flights as defaultFlights } from '@/data/flights';
import { hotels as defaultHotels } from '@/data/hotels';
import { tours as defaultTours } from '@/data/tours';
import { packages as defaultPackages } from '@/data/packages';
import { buses as defaultBuses } from '@/data/bus';
import { trains as defaultTrains } from '@/data/trains';
import { cruises as defaultCruises } from '@/data/cruise';
import { cars as defaultCars } from '@/data/cars';

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
      buses: defaultBuses,
      trains: defaultTrains,
      cruises: defaultCruises,
      cars: defaultCars,

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

      // Buses
      setBuses: (buses) => set({ buses }),
      addBus: (bus) =>
        set((s) => ({
          buses: [...s.buses, { ...bus, id: bus.id || nextId(s.buses, 'BS') }],
        })),
      updateBus: (id, updates) =>
        set((s) => ({
          buses: s.buses.map((b) => (b.id === id ? { ...b, ...updates } : b)),
        })),
      deleteBus: (id) => set((s) => ({ buses: s.buses.filter((b) => b.id !== id) })),

      // Trains
      setTrains: (trains) => set({ trains }),
      addTrain: (train) =>
        set((s) => ({
          trains: [...s.trains, { ...train, id: train.id || nextId(s.trains, 'TN') }],
        })),
      updateTrain: (id, updates) =>
        set((s) => ({
          trains: s.trains.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        })),
      deleteTrain: (id) => set((s) => ({ trains: s.trains.filter((t) => t.id !== id) })),

      // Cruises
      setCruises: (cruises) => set({ cruises }),
      addCruise: (cruise) =>
        set((s) => ({
          cruises: [...s.cruises, { ...cruise, id: cruise.id || nextId(s.cruises, 'CR') }],
        })),
      updateCruise: (id, updates) =>
        set((s) => ({
          cruises: s.cruises.map((c) => (c.id === id ? { ...c, ...updates } : c)),
        })),
      deleteCruise: (id) => set((s) => ({ cruises: s.cruises.filter((c) => c.id !== id) })),

      // Cars
      setCars: (cars) => set({ cars }),
      addCar: (car) =>
        set((s) => ({
          cars: [...s.cars, { ...car, id: car.id || nextId(s.cars, 'CAR') }],
        })),
      updateCar: (id, updates) =>
        set((s) => ({
          cars: s.cars.map((c) => (c.id === id ? { ...c, ...updates } : c)),
        })),
      deleteCar: (id) => set((s) => ({ cars: s.cars.filter((c) => c.id !== id) })),

      // Reset to defaults
      resetAllData: () =>
        set({
          flights: defaultFlights,
          hotels: defaultHotels,
          tours: defaultTours,
          packages: defaultPackages,
          buses: defaultBuses,
          trains: defaultTrains,
          cruises: defaultCruises,
          cars: defaultCars,
        }),
    }),
    { name: 'trips-data-storage' }
  )
);
