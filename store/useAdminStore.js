import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const ADMIN_EMAIL = 'admin@trips.com';
const ADMIN_PASSWORD = 'admin123';

export const useAdminStore = create(
  persist(
    (set) => ({
      isAdmin: false,
      adminEmail: null,
      loginAdmin: (email, password) => {
        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
          set({ isAdmin: true, adminEmail: email });
          return true;
        }
        return false;
      },
      logoutAdmin: () => set({ isAdmin: false, adminEmail: null }),
    }),
    { name: 'trips-admin-storage' }
  )
);
