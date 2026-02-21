import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/** Selected currency for display (conversion can be done client or server). */
const DEFAULT_CURRENCY = 'INR';

/** Recently viewed items (id + type) for "Recently viewed" sections. */
const MAX_RECENT = 20;

/** Compare list: array of { id, type } for comparison feature. */
const MAX_COMPARE = 4;

export const useTravelStore = create(
  persist(
    (set, get) => ({
      currency: DEFAULT_CURRENCY,
      setCurrency: (currency) => set({ currency: currency || DEFAULT_CURRENCY }),

      recentlyViewed: [],
      addRecentlyViewed: (id, type) =>
        set((state) => {
          const next = [{ id, type }, ...state.recentlyViewed.filter((x) => !(x.id === id && x.type === type))].slice(0, MAX_RECENT);
          return { recentlyViewed: next };
        }),

      compareList: [],
      addToCompare: (id, type) =>
        set((state) => {
          if (state.compareList.some((x) => x.id === id && x.type === type)) return state;
          if (state.compareList.length >= MAX_COMPARE) return state;
          return { compareList: [...state.compareList, { id, type }] };
        }),
      removeFromCompare: (id, type) =>
        set((state) => ({
          compareList: state.compareList.filter((x) => !(x.id === id && x.type === type)),
        })),
      clearCompare: () => set({ compareList: [] }),
      isInCompare: (id, type) => get().compareList.some((x) => x.id === id && x.type === type),
    }),
    { name: 'trips-travel-store' }
  )
);
