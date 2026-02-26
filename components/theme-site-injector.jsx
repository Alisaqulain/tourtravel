'use client';

import { useEffect } from 'react';
import { useSiteThemeStore, THEMES } from '@/store';

/** Site is dark-only: only primary/ring are overridden; background/card/muted/border come from .dark in globals.css */
export function SiteThemeInjector() {
  const themeId = useSiteThemeStore((s) => s.themeId);
  const customThemes = useSiteThemeStore((s) => s.customThemes);

  useEffect(() => {
    const theme = useSiteThemeStore.getState().getTheme(themeId) || THEMES[0];
    const root = document.documentElement;
    root.style.setProperty('--primary', theme.primary);
    root.style.setProperty('--ring', theme.primary);
    if (theme.primaryForeground) root.style.setProperty('--primary-foreground', theme.primaryForeground);
    else root.style.removeProperty('--primary-foreground');
  }, [themeId, customThemes]);

  return null;
}
