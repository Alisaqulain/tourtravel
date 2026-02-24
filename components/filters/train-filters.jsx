'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Search } from 'lucide-react';

export function TrainFilters({ search, setSearch, travelClass, setTravelClass, maxPrice, setMaxPrice, onReset }) {
  const classes = ['All', 'AC 1 Tier', 'AC 2 Tier', 'AC 3 Tier', 'AC Chair Car', 'Executive Chair Car', 'Sleeper'];

  return (
    <Card className="p-4 rounded-2xl border border-border shadow-sm">
      <div className="space-y-4">
        <div>
          <Label className="text-sm font-medium">Source / Destination</Label>
          <div className="relative mt-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden />
            <Input
              placeholder="e.g. Delhi, Mumbai"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 rounded-xl"
              aria-label="Search trains by route"
            />
          </div>
        </div>
        <div>
          <Label className="text-sm font-medium">Class</Label>
          <select
            value={travelClass}
            onChange={(e) => setTravelClass(e.target.value)}
            className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Travel class"
          >
            {classes.map((c) => (
              <option key={c} value={c === 'All' ? '' : c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label className="text-sm font-medium">Max price (₹)</Label>
          <Input
            type="number"
            placeholder="Any"
            min={0}
            value={maxPrice || ''}
            onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : '')}
            className="mt-1 rounded-xl"
            aria-label="Maximum price"
          />
        </div>
        <Button variant="outline" size="sm" className="w-full rounded-xl" onClick={onReset}>
          Reset filters
        </Button>
      </div>
    </Card>
  );
}
