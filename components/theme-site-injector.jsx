'use client';

import { useEffect } from 'react';
import { useSiteThemeStore, THEMES } from '@/store';

export function SiteThemeInjector() {
  const themeId = useSiteThemeStore((s) => s.themeId);
  const customThemes = useSiteThemeStore((s) => s.customThemes);

  useEffect(() => {
    const theme = useSiteThemeStore.getState().getTheme(themeId) || THEMES[0];
    const root = document.documentElement;
    root.style.setProperty('--primary', theme.primary);
    root.style.setProperty('--ring', theme.primary);
    root.style.setProperty('--background', theme.background);
    root.style.setProperty('--card', theme.card);
    root.style.setProperty('--muted', theme.muted);
    root.style.setProperty('--border', theme.border);
  }, [themeId, customThemes]);

  return null;
}
