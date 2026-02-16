'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Search } from 'lucide-react';

export function FlightFilters({ search, setSearch, maxPrice, setMaxPrice, onReset }) {
  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div>
          <Label className="text-sm">Search route or airline</Label>
          <div className="relative mt-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="e.g. London, SkyWings"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 rounded-xl"
            />
          </div>
        </div>
        <div>
          <Label className="text-sm">Max price (USD)</Label>
          <Input
            type="number"
            placeholder="Any"
            value={maxPrice || ''}
            onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : '')}
            className="mt-1 rounded-xl"
          />
        </div>
        <Button variant="outline" size="sm" className="w-full rounded-xl" onClick={onReset}>
          Reset filters
        </Button>
      </div>
    </Card>
  );
}
