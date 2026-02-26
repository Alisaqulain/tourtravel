import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const THEMES = [
  { id: 'default', name: 'Amber Gold', primary: '#EAB308', primaryForeground: '#1c1917', background: '#FFFBEB', card: '#FEF9C3', muted: '#FEF3C7', border: '#FDE68A' },
  { id: 'sunset', name: 'Sunset', primary: '#d97706', primaryForeground: '#fff', background: '#f8f5f1', card: '#f0ebe3', muted: '#e5d9cc', border: '#d4c2ab' },
  { id: 'forest', name: 'Forest Green', primary: '#1a8f3a', primaryForeground: '#fff', background: '#f2f5f2', card: '#e6ebe6', muted: '#d1dcd1', border: '#a8bda8' },
  { id: 'violet', name: 'Violet', primary: '#6d28d9', primaryForeground: '#fff', background: '#f4f2f9', card: '#ebe7f4', muted: '#ddd4ea', border: '#c4b2d9' },
  { id: 'rose', name: 'Rose', primary: '#be185d', primaryForeground: '#fff', background: '#f8f4f5', card: '#f0e8eb', muted: '#e5d8dc', border: '#d4b8c0' },
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
