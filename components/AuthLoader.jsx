'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store';

export function AuthLoader() {
  const login = useAuthStore((s) => s.login);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) login({
          ...data.user,
          name: data.user.name,
          email: data.user.email,
          phone: data.user.phone ?? '',
          city: data.user.city ?? '',
          state: data.user.state ?? '',
          country: data.user.country ?? '',
          role: data.user.role ?? 'user',
        });
      })
      .catch(() => {});
  }, [login]);

  return null;
}
