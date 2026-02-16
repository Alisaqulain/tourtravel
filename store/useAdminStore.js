import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Dummy admin credentials (shown on /admin/login for demo)
export const ADMIN_DEMO_EMAIL = 'admin@trips.com';
export const ADMIN_DEMO_PASSWORD = 'admin123';

export const useAdminStore = create(
  persist(
    (set) => ({
      isAdmin: false,
      adminEmail: null,
      loginAdmin: (email, password) => {
        if (email === ADMIN_DEMO_EMAIL && password === ADMIN_DEMO_PASSWORD) {
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
