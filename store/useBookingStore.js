import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useBookingStore = create(
  persist(
    (set) => ({
      selectedFlight: null,
      selectedHotel: null,
      selectedTour: null,
      selectedPackage: null,
      selectedBus: null,
      selectedCruise: null,
      selectedCar: null,
      cart: [],
      setSelectedFlight: (flight) => set({ selectedFlight: flight }),
      setSelectedHotel: (hotel) => set({ selectedHotel: hotel }),
      setSelectedTour: (tour) => set({ selectedTour: tour }),
      setSelectedPackage: (pkg) => set({ selectedPackage: pkg }),
      setSelectedBus: (bus) => set({ selectedBus: bus }),
      setSelectedCruise: (cruise) => set({ selectedCruise: cruise }),
      setSelectedCar: (car) => set({ selectedCar: car }),
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
          selectedBus: null,
          selectedCruise: null,
          selectedCar: null,
        }),
      // Completed bookings (for admin)
      completedBookings: [],
      addCompletedBooking: (booking) =>
        set((state) => ({
          completedBookings: [{ ...booking, id: 'B' + Date.now(), date: new Date().toISOString().slice(0, 10) }, ...state.completedBookings].slice(0, 100),
        })),
    }),
    { name: 'trips-booking-storage' }
  )
);
