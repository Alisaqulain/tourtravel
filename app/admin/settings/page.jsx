'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Settings, Save, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from '@/lib/toast';

const BUSINESS_MODELS = [
  { value: 'api', label: 'API Only', desc: 'Show only API-sourced results (Amadeus, Skyscanner, etc.)' },
  { value: 'manual', label: 'Manual Only', desc: 'Show only admin-created listings' },
  { value: 'hybrid', label: 'Hybrid', desc: 'API results first, then featured manual listings' },
];

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    businessModel: 'hybrid',
    commissionPercentage: 0,
    markupPercentage: 0,
    taxPercentage: 0,
    currency: 'INR',
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/admin/settings', { credentials: 'include' });
        const data = await res.json();
        if (data.success && data.data) {
          setForm((f) => ({
            ...f,
            businessModel: data.data.businessModel ?? 'hybrid',
            commissionPercentage: data.data.commissionPercentage ?? 0,
            markupPercentage: data.data.markupPercentage ?? 0,
            taxPercentage: data.data.taxPercentage ?? 0,
            currency: data.data.currency ?? 'INR',
          }));
        }
      } catch (e) {
        toast.error('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Settings saved. Frontend will adapt to the selected business model.');
      } else {
        toast.error(data.message || 'Failed to save');
      }
    } catch (e) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div>
        <div className="h-8 w-48 bg-muted rounded animate-pulse mb-6" />
        <Card className="p-8 animate-pulse h-64" />
      </div>
    );
  }

  return (
    <div>
      <Link
        href="/admin"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 text-sm"
      >
        <ArrowLeft className="h-4 w-4" /> Dashboard
      </Link>
      <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
        <Settings className="h-8 w-8" /> Business Model & Settings
      </h1>
      <p className="text-muted-foreground mb-8">
        Choose how your site serves content: API only, manual only, or hybrid. Set commission, markup, and tax.
      </p>

      <motion.form
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSave}
        className="space-y-8"
      >
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Business Model</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {BUSINESS_MODELS.map((m) => (
              <label
                key={m.value}
                className={`flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  form.businessModel === m.value ? 'border-primary bg-primary/5' : 'border-border hover:border-muted-foreground/30'
                }`}
              >
                <input
                  type="radio"
                  name="businessModel"
                  value={m.value}
                  checked={form.businessModel === m.value}
                  onChange={(e) => setForm((f) => ({ ...f, businessModel: e.target.value }))}
                  className="sr-only"
                />
                <span className="font-medium">{m.label}</span>
                <span className="text-sm text-muted-foreground mt-1">{m.desc}</span>
              </label>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Pricing & Tax</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="currency">Currency</Label>
              <Input
                id="currency"
                value={form.currency}
                onChange={(e) => setForm((f) => ({ ...f, currency: e.target.value.slice(0, 10) }))}
                className="mt-1 rounded-xl"
                placeholder="INR"
              />
            </div>
            <div>
              <Label htmlFor="commission">Commission %</Label>
              <Input
                id="commission"
                type="number"
                min={0}
                max={100}
                step={0.5}
                value={form.commissionPercentage}
                onChange={(e) =>
                  setForm((f) => ({ ...f, commissionPercentage: Number(e.target.value) || 0 }))
                }
                className="mt-1 rounded-xl"
              />
            </div>
            <div>
              <Label htmlFor="markup">Markup % (API items)</Label>
              <Input
                id="markup"
                type="number"
                min={0}
                max={100}
                step={0.5}
                value={form.markupPercentage}
                onChange={(e) =>
                  setForm((f) => ({ ...f, markupPercentage: Number(e.target.value) || 0 }))
                }
                className="mt-1 rounded-xl"
              />
            </div>
            <div>
              <Label htmlFor="tax">Tax %</Label>
              <Input
                id="tax"
                type="number"
                min={0}
                max={100}
                step={0.5}
                value={form.taxPercentage}
                onChange={(e) =>
                  setForm((f) => ({ ...f, taxPercentage: Number(e.target.value) || 0 }))
                }
                className="mt-1 rounded-xl"
              />
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            API: finalPrice = apiPrice + markup% + tax%. Manual: finalPrice = basePrice + contract margin + tax%.
          </p>
        </Card>

        <div className="flex gap-3">
          <Button type="submit" disabled={saving} className="rounded-xl gap-2">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save settings
          </Button>
          <Link href="/admin">
            <Button type="button" variant="outline" className="rounded-xl">
              Cancel
            </Button>
          </Link>
        </div>
      </motion.form>
    </div>
  );
}
