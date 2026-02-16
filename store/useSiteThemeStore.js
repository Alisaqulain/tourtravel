import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const THEMES = [
  { id: 'default', name: 'Default (Red)', primary: '#E50914', background: '#0B1F3A', card: '#0f2744', muted: '#1e3a5f', border: '#1e3a5f' },
  { id: 'ocean', name: 'Ocean Blue', primary: '#0ea5e9', background: '#0c2438', card: '#0f3147', muted: '#1e3d52', border: '#1e3d52' },
  { id: 'forest', name: 'Forest Green', primary: '#22c55e', background: '#0d2818', card: '#0f3520', muted: '#1e4a2e', border: '#1e4a2e' },
  { id: 'sunset', name: 'Sunset Orange', primary: '#f97316', background: '#2d1f0c', card: '#3d2a0f', muted: '#5f421e', border: '#5f421e' },
  { id: 'violet', name: 'Violet', primary: '#8b5cf6', background: '#1e1a2e', card: '#2a2440', muted: '#3d3555', border: '#3d3555' },
  { id: 'rose', name: 'Rose', primary: '#f43f5e', background: '#2e0f18', card: '#3d1520', muted: '#5f1e2e', border: '#5f1e2e' },
];

/** Derive dark background colors from primary hex (for custom themes). */
export function deriveThemeFromPrimary(primaryHex, name) {
  const hex = primaryHex.replace('#', '').slice(0, 6);
  if (hex.length !== 6) return null;
  const r = Math.min(255, parseInt(hex.slice(0, 2), 16) || 0);
  const g = Math.min(255, parseInt(hex.slice(2, 4), 16) || 0);
  const b = Math.min(255, parseInt(hex.slice(4, 6), 16) || 0);
  const darken = (ratio) => ({
    r: Math.round(r * ratio),
    g: Math.round(g * ratio),
    b: Math.round(b * ratio),
  });
  const toHex = (o) => '#' + [o.r, o.g, o.b].map((x) => x.toString(16).padStart(2, '0')).join('');
  return {
    id: 'custom-' + Date.now(),
    name,
    primary: '#' + hex,
    background: toHex(darken(0.12)),
    card: toHex(darken(0.16)),
    muted: toHex(darken(0.22)),
    border: toHex(darken(0.22)),
  };
}

export const useSiteThemeStore = create(
  persist(
    (set, get) => ({
      themeId: 'default',
      customThemes: [],
      setThemeId: (themeId) => set({ themeId }),
      addCustomTheme: (theme) =>
        set((s) => ({ customThemes: [...s.customThemes, { ...theme, id: theme.id || 'custom-' + Date.now() }] })),
      removeCustomTheme: (id) =>
        set((s) => ({
          customThemes: s.customThemes.filter((t) => t.id !== id),
          themeId: s.themeId === id ? 'default' : s.themeId,
        })),
      getTheme: (themeId) => {
        const built = THEMES.find((t) => t.id === themeId);
        if (built) return built;
        return get().customThemes.find((t) => t.id === themeId) || THEMES[0];
      },
    }),
    { name: 'trips-site-theme' }
  )
);
