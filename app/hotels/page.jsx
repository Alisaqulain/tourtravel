'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Building2 } from 'lucide-react';

export default function PublicHotelsPage() {
  const [city, setCity] = useState('');
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);

  const search = () => {
    if (!city.trim()) return;
    setLoading(true);
    fetch(`/api/marketplace/hotels?city=${encodeURIComponent(city.trim())}`)
      .then((r) => r.json())
      .then((d) => setHotels(d?.data?.hotels ?? []))
      .finally(() => setLoading(false));
  };

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-2">Hotels</h1>
      <p className="text-muted-foreground mb-6">Search by city to find and book hotels.</p>
      <div className="flex gap-2 mb-8">
        <Input
          placeholder="City name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && search()}
          className="max-w-xs"
        />
        <Button onClick={search} disabled={loading}>{loading ? 'Searching...' : 'Search'}</Button>
      </div>
      <div className="grid gap-4">
        {hotels.map((h) => (
          <Link key={h.id ?? h._id} href={`/hotels/${h.slug || h.id || h._id}`}>
            <Card className="p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
              <Building2 className="h-12 w-12 text-muted-foreground shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{h.name}</p>
                <p className="text-sm text-muted-foreground truncate">{h.city}{h.address ? ` · ${h.address}` : ''}</p>
                {h.minPrice != null && <p className="text-sm text-primary mt-1">From ₹ {h.minPrice}/night</p>}
              </div>
            </Card>
          </Link>
        ))}
      </div>
      {!loading && hotels.length === 0 && city && <p className="text-muted-foreground">No hotels found. Try another city.</p>}
    </div>
  );
}
