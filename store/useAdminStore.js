import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/** Real admin login: calls /api/auth/login and checks role === 'admin'. */
export const useAdminStore = create(
  persist(
    (set) => ({
      isAdmin: false,
      adminEmail: null,
      loginAdmin: async (email, password) => {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
          credentials: 'include',
        });
        const data = await res.json();
        if (!data.success || data.user?.role !== 'admin') return false;
        set({ isAdmin: true, adminEmail: data.user.email });
        return true;
      },
      logoutAdmin: async () => {
        await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
        set({ isAdmin: false, adminEmail: null });
      },
    }),
    { name: 'trips-admin-storage' }
  )
);
