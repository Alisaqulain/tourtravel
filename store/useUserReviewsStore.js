import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUserReviewsStore = create(
  persist(
    (set) => ({
      reviews: [],
      addReview: (review) =>
        set((state) => ({
          reviews: [
            {
              id: 'R' + Date.now(),
              ...review,
              createdAt: new Date().toISOString().slice(0, 10),
            },
            ...state.reviews,
          ],
        })),
    }),
    { name: 'trips-user-reviews' }
  )
);
