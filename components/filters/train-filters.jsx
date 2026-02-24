'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Search, SlidersHorizontal } from 'lucide-react';

export function TrainFilters({ search, setSearch, travelClass, setTravelClass, maxPrice, setMaxPrice, onReset }) {
  const classes = ['All', 'AC 1 Tier', 'AC 2 Tier', 'AC 3 Tier', 'AC Chair Car', 'Executive Chair Car', 'Sleeper'];

  return (
    <Card className="p-6 md:p-8 rounded-2xl border-2 border-border/80 shadow-lg">
      <div className="space-y-6">
        <div className="flex items-center gap-3 pb-2 border-b border-border">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15">
            <SlidersHorizontal className="h-5 w-5 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Filters</h3>
        </div>
        <div>
          <Label className="text-base font-medium text-foreground">Source / Destination</Label>
          <div className="relative mt-2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" aria-hidden />
            <Input
              placeholder="e.g. Delhi, Mumbai"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 h-12 rounded-xl text-base"
              aria-label="Search trains by route"
            />
          </div>
        </div>
        <div>
          <Label className="text-base font-medium text-foreground">Class</Label>
          <select
            value={travelClass}
            onChange={(e) => setTravelClass(e.target.value)}
            className="mt-2 w-full h-12 rounded-xl border border-border bg-background px-4 py-2 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
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
          <Label className="text-base font-medium text-foreground">Max price (₹)</Label>
          <Input
            type="number"
            placeholder="Any"
            min={0}
            value={maxPrice || ''}
            onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : '')}
            className="mt-2 h-12 rounded-xl text-base"
            aria-label="Maximum price"
          />
        </div>
        <Button variant="outline" size="lg" className="w-full rounded-xl h-12 text-base font-medium" onClick={onReset}>
          Reset filters
        </Button>
      </div>
    </Card>
  );
}
