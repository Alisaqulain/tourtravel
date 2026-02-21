import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useWishlistStore = create(
  persist(
    (set) => ({
      count: 0,
      setCount: (count) => set({ count }),
      hydrate: (items) => set({ count: Array.isArray(items) ? items.length : 0 }),
    }),
    { name: 'trips-wishlist-count' }
  )
);
