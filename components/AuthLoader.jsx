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
        if (data.user) login({ name: data.user.name, email: data.user.email });
      })
      .catch(() => {});
  }, [login]);

  return null;
}
