'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function AdminMarketplaceCommissionPage() {
  const [percent, setPercent] = useState(15);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/marketplace/admin/commission', { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => {
        const v = d?.data?.commissionPercent;
        if (v != null) setPercent(v);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (percent < 0 || percent > 100) return;
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch('/api/marketplace/admin/commission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ commissionPercent: percent }),
      });
      const data = await res.json();
      if (data?.success) setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-muted-foreground">Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Marketplace Commission</h1>
      <Card className="p-6 max-w-md">
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <Label htmlFor="commission">Platform commission (%)</Label>
            <Input
              id="commission"
              type="number"
              min={0}
              max={100}
              value={percent}
              onChange={(e) => setPercent(Number(e.target.value))}
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">Applied to each booking. Hotel receives (100 - commission)%.</p>
          </div>
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </Button>
          {saved && <span className="text-sm text-green-600 ml-2">Saved.</span>}
        </form>
      </Card>
    </div>
  );
}
