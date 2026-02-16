'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Palette, Check, Plus, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSiteThemeStore, THEMES, deriveThemeFromPrimary } from '@/store';

export default function AdminThemePage() {
  const themeId = useSiteThemeStore((s) => s.themeId);
  const setThemeId = useSiteThemeStore((s) => s.setThemeId);
  const customThemes = useSiteThemeStore((s) => s.customThemes);
  const addCustomTheme = useSiteThemeStore((s) => s.addCustomTheme);
  const removeCustomTheme = useSiteThemeStore((s) => s.removeCustomTheme);

  const [name, setName] = useState('');
  const [primaryHex, setPrimaryHex] = useState('#e11d48');
  const [showForm, setShowForm] = useState(false);

  const allThemes = [...THEMES, ...customThemes];

  const handleAddTheme = (e) => {
    e.preventDefault();
    const theme = deriveThemeFromPrimary(primaryHex, name.trim());
    if (theme && name.trim()) {
      addCustomTheme(theme);
      setThemeId(theme.id);
      setName('');
      setPrimaryHex('#e11d48');
      setShowForm(false);
    }
  };

  return (
    <div>
      <Link href="/admin" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 text-sm">
        <ArrowLeft className="h-4 w-4" /> Dashboard
      </Link>
      <h1 className="text-2xl font-bold mb-2">Website Theme</h1>
      <p className="text-muted-foreground mb-6">Change the theme for the whole website (background, buttons, accents). Add custom themes like Valentine, Independence Day, etc.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {allThemes.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: allThemes.indexOf(t) * 0.03 }}
            className="relative"
          >
            <Card
              className={`p-6 cursor-pointer transition-all border-2 hover:shadow-card-hover ${themeId === t.id ? 'border-primary ring-2 ring-primary/20' : 'border-border'}`}
              onClick={() => setThemeId(t.id)}
            >
              {t.id.startsWith('custom-') && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); removeCustomTheme(t.id); }}
                  className="absolute top-2 right-2 p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  title="Remove theme"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
              <div className="flex items-center justify-between mb-3">
                <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: t.primary + '30' }}>
                  <Palette className="h-5 w-5" style={{ color: t.primary }} />
                </div>
                {themeId === t.id && (
                  <div className="h-6 w-6 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: t.primary }}>
                    <Check className="h-4 w-4" />
                  </div>
                )}
              </div>
              <h3 className="font-semibold">{t.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">Primary: <span className="font-mono" style={{ color: t.primary }}>{t.primary}</span></p>
              {t.id.startsWith('custom-') && <span className="text-xs text-muted-foreground mt-1 block">Custom</span>}
            </Card>
          </motion.div>
        ))}
      </div>

      {!showForm ? (
        <Button type="button" variant="outline" className="mt-6 gap-2" onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4" /> Add custom theme
        </Button>
      ) : (
        <Card className="mt-6 p-6 max-w-md">
          <h3 className="font-semibold mb-4">Add custom theme</h3>
          <form onSubmit={handleAddTheme} className="space-y-4">
            <div>
              <Label htmlFor="theme-name">Theme name</Label>
              <Input
                id="theme-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Valentine, Independence Day"
                className="mt-1 rounded-xl"
                required
              />
            </div>
            <div>
              <Label htmlFor="theme-primary">Primary color</Label>
              <div className="flex gap-2 mt-1">
                <input
                  type="color"
                  value={primaryHex}
                  onChange={(e) => setPrimaryHex(e.target.value)}
                  className="h-10 w-14 rounded-xl cursor-pointer border border-border"
                />
                <Input
                  id="theme-primary"
                  value={primaryHex}
                  onChange={(e) => setPrimaryHex(e.target.value)}
                  placeholder="#e11d48"
                  className="flex-1 rounded-xl font-mono"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">Background and surfaces are auto-generated from this color.</p>
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="rounded-xl">Add theme</Button>
              <Button type="button" variant="outline" onClick={() => { setShowForm(false); setName(''); }} className="rounded-xl">Cancel</Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
}
