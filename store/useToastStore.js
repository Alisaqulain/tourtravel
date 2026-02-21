'use client';

import { create } from 'zustand';

const DEFAULT_DURATION = 4500;

export const useToastStore = create((set, get) => ({
  toasts: [],
  add: (payload) => {
    const id = payload.id || `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const duration = payload.duration ?? DEFAULT_DURATION;
    set((state) => ({ toasts: [...state.toasts, { ...payload, id, duration }] }));
    if (duration > 0) {
      setTimeout(() => get().remove(id), duration);
    }
    return id;
  },
  remove: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
  clear: () => set({ toasts: [] }),
}));
