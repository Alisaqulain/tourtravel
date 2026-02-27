'use client';

import { useState, useEffect } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';

export function AdminLocationMap() {
  const [geo, setGeo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/admin/geo', { credentials: 'include' });
        const json = await res.json();
        if (cancelled) return;
        if (json.success && json.data) {
          setGeo(json.data);
        } else {
          setError('Could not load location');
        }
      } catch (e) {
        if (!cancelled) setError('Failed to load location');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading your location…</span>
        </div>
      </Card>
    );
  }

  if (error || !geo) {
    return (
      <Card className="p-6">
        <p className="text-muted-foreground">{error || 'Location unavailable'}</p>
      </Card>
    );
  }

  const { lat, lng, city, country } = geo;
  const bbox = `${Number(lng) - 0.02},${Number(lat) - 0.02},${Number(lng) + 0.02},${Number(lat) + 0.02}`;
  const embedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`;

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
        <MapPin className="h-5 w-5 text-primary" />
        Your location (from IP)
      </h2>
      <p className="text-sm text-muted-foreground mb-4">
        {city && country ? `${city}, ${country}` : 'Location on map below'}
      </p>
      <div className="rounded-xl overflow-hidden border border-border bg-muted/30">
        <iframe
          title="Your location map"
          src={embedUrl}
          className="w-full h-[280px] border-0 block"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </Card>
  );
}
