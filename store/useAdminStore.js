import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/** Verify with server that current session is admin. Call on admin layout load so refresh keeps you in. */
async function checkAdminSession(set) {
  try {
    const res = await fetch('/api/auth/me', { credentials: 'include' });
    const data = await res.json();
    const user = data?.user ?? data?.data?.user;
    const role = user?.role;
    if (user && (role === 'admin' || role === 'superadmin')) {
      set({ isAdmin: true, adminEmail: user.email });
      return true;
    }
  } catch (_) {}
  set({ isAdmin: false, adminEmail: null });
  return false;
}

/** Real admin login: calls /api/auth/login and checks role === 'admin'. */
export const useAdminStore = create(
  persist(
    (set, get) => ({
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
        const role = data.user?.role;
        if (!data.success || (role !== 'admin' && role !== 'superadmin')) return false;
        set({ isAdmin: true, adminEmail: data.user.email });
        return true;
      },
      logoutAdmin: () => {
        fetch('/api/auth/logout', { method: 'POST', credentials: 'include' }).catch(() => {});
        set({ isAdmin: false, adminEmail: null });
      },
      /** Call on admin layout mount (except login page) to restore session after refresh. */
      checkAdminSession: () => checkAdminSession(set),
    }),
    { name: 'trips-admin-storage' }
  )
);
