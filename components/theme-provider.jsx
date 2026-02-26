'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { SiteThemeInjector } from '@/components/theme-site-injector';

const ThemeContext = createContext(undefined);

export function ThemeProvider({ children, defaultTheme = 'light', storageKey = 'trips-theme' }) {
  const [theme, setTheme] = useState(defaultTheme);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = typeof window !== 'undefined' && window.localStorage?.getItem(storageKey);
      if (stored === 'dark' || stored === 'light') setTheme(stored);
    } catch (_) {}
  }, [defaultTheme, storageKey]);

  useEffect(() => {
    if (!mounted) return;
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    try { window.localStorage.setItem(storageKey, theme); } catch (_) {}
  }, [mounted, theme, storageKey]);

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      <SiteThemeInjector />
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
