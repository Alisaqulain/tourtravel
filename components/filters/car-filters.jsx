'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Search, SlidersHorizontal } from 'lucide-react';

export function CarFilters({ search, setSearch, maxPrice, setMaxPrice, onReset }) {
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
          <Label className="text-base font-medium text-foreground">Search car or location</Label>
          <div className="relative mt-2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="e.g. Mercedes, LAX"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 h-12 rounded-xl text-base"
            />
          </div>
        </div>
        <div>
          <Label className="text-base font-medium text-foreground">Max price per day (USD)</Label>
          <Input
            type="number"
            placeholder="Any"
            value={maxPrice || ''}
            onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : '')}
            className="mt-2 h-12 rounded-xl text-base"
          />
        </div>
        <Button variant="outline" size="lg" className="w-full rounded-xl h-12 text-base font-medium" onClick={onReset}>
          Reset filters
        </Button>
      </div>
    </Card>
  );
}
