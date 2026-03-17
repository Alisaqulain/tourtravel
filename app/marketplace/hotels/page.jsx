'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Building2 } from 'lucide-react';

export default function CustomerHotelsPage() {
  const [hotels, setHotels] = useState([]);
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);

  const search = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (city) params.set('city', city);
    fetch(`/api/marketplace/hotels?${params}`)
      .then((r) => r.json())
      .then((d) => setHotels(d?.data?.hotels ?? []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    search();
  }, []);

  return (
    <div className="min-h-screen bg-muted/30 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Find Hotels</h1>
        <div className="flex gap-2 mb-6">
          <Input placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} className="max-w-xs" />
          <Button onClick={search} disabled={loading}>{loading ? 'Searching...' : 'Search'}</Button>
        </div>
        <div className="grid gap-4">
          {hotels.map((h) => (
            <Link key={h.id ?? h._id} href={`/marketplace/hotels/${h.id ?? h._id}`}>
              <Card className="p-4 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer">
                <Building2 className="h-12 w-12 text-muted-foreground shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{h.name}</p>
                  <p className="text-sm text-muted-foreground">{h.city} · {h.address}</p>
                  {h.minPrice != null && <p className="text-sm text-primary font-medium mt-1">From ₹ {h.minPrice}/night</p>}
                </div>
              </Card>
            </Link>
          ))}
          {hotels.length === 0 && !loading && <p className="text-muted-foreground">No hotels found. Try another city.</p>}
        </div>
      </div>
    </div>
  );
}
