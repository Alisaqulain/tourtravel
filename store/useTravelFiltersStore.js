import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Search filters state for travel listing pages.
 * Sync with URL query params where needed.
 */
const defaultFilters = {
  // Flights
  origin: '',
  destination: '',
  date: '',
  adults: 1,
  minPrice: '',
  maxPrice: '',
  stops: '',
  airline: '',
  refundable: false,
  // Hotels
  cityCode: '',
  search: '',
  checkIn: '',
  checkOut: '',
  minRating: '',
  starRating: '',
  amenities: [],
  freeCancellation: false,
  // Cars
  pickUp: '',
  dropOff: '',
  brand: '',
  fuelType: '',
  transmission: '',
  seats: '',
  // Common
  sortBy: 'price',
  order: 'asc',
  page: 1,
  limit: 12,
};

export const useTravelFiltersStore = create(
  persist(
    (set) => ({
      ...defaultFilters,
      setFilters: (payload) => set((state) => ({ ...state, ...payload })),
      setPage: (page) => set({ page: Math.max(1, page) }),
      setSort: (sortBy, order = 'asc') => set({ sortBy, order }),
      resetFilters: () => set(defaultFilters),
    }),
    { name: 'trips-travel-filters' }
  )
);
