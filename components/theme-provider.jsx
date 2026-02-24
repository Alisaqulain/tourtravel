'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { SiteThemeInjector } from '@/components/theme-site-injector';

const ThemeContext = createContext(undefined);

export function ThemeProvider({ children, defaultTheme = 'light', storageKey = 'trips-theme' }) {
  const [theme, setTheme] = useState(defaultTheme);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTheme('dark');
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const root = window.document.documentElement;
    root.classList.remove('light');
    root.classList.add('dark');
  }, [mounted]);

  const toggleTheme = () => {};

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
