'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Search } from 'lucide-react';

export function HotelFilters({ search, setSearch, maxPrice, setMaxPrice, minRating, setMinRating, onReset }) {
  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div>
          <Label className="text-sm">Search hotel or location</Label>
          <div className="relative mt-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="e.g. Maldives, Marina"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 rounded-xl"
            />
          </div>
        </div>
        <div>
          <Label className="text-sm">Max price per night (USD)</Label>
          <Input
            type="number"
            placeholder="Any"
            value={maxPrice || ''}
            onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : '')}
            className="mt-1 rounded-xl"
          />
        </div>
        <div>
          <Label className="text-sm">Min rating (1-5)</Label>
          <select
            value={minRating || ''}
            onChange={(e) => setMinRating(e.target.value ? Number(e.target.value) : '')}
            className="mt-1 flex h-11 w-full rounded-xl border border-border bg-background px-4 py-2 text-sm"
          >
            <option value="">Any</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
            <option value="5">5 only</option>
          </select>
        </div>
        <Button variant="outline" size="sm" className="w-full rounded-xl" onClick={onReset}>
          Reset filters
        </Button>
      </div>
    </Card>
  );
}
