import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useBookingStore = create(
  persist(
    (set) => ({
      selectedFlight: null,
      selectedHotel: null,
      selectedTour: null,
      selectedPackage: null,
      cart: [],
      setSelectedFlight: (flight) => set({ selectedFlight: flight }),
      setSelectedHotel: (hotel) => set({ selectedHotel: hotel }),
      setSelectedTour: (tour) => set({ selectedTour: tour }),
      setSelectedPackage: (pkg) => set({ selectedPackage: pkg }),
      addToCart: (item) =>
        set((state) => ({
          cart: [...state.cart, { ...item, cartId: Date.now().toString() }],
        })),
      removeFromCart: (cartId) =>
        set((state) => ({
          cart: state.cart.filter((i) => i.cartId !== cartId),
        })),
      clearCart: () => set({ cart: [] }),
      clearSelection: () =>
        set({
          selectedFlight: null,
          selectedHotel: null,
          selectedTour: null,
          selectedPackage: null,
        }),
    }),
    { name: 'trips-booking-storage' }
  )
);
