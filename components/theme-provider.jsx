'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { SiteThemeInjector } from '@/components/theme-site-injector';

const ThemeContext = createContext(undefined);

export function ThemeProvider({ children, defaultTheme = 'light', storageKey = 'trips-theme' }) {
  const [theme, setTheme] = useState(defaultTheme);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(storageKey);
    if (stored === 'dark' || stored === 'light') {
      setTheme(stored);
    } else {
      setTheme(defaultTheme);
    }
  }, [storageKey, defaultTheme]);

  useEffect(() => {
    if (!mounted) return;
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem(storageKey, theme);
  }, [theme, mounted, storageKey]);

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

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
