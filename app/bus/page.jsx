'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Bus, ArrowLeft, Eye, Wifi, Zap } from 'lucide-react';
import { SectionHeader } from '@/components/ui/section-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatPrice } from '@/lib/utils';
import { useBookingStore, useDataStore } from '@/store';
import { BusFilters } from '@/components/filters/bus-filters';

export default function BusPage() {
  const setSelectedBus = useBookingStore((s) => s.setSelectedBus);
  const buses = useDataStore((s) => s.buses);
  const [search, setSearch] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const filtered = useMemo(() => {
    let list = [...buses];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (b) =>
          b.operator.toLowerCase().includes(q) ||
          b.from.toLowerCase().includes(q) ||
          b.to.toLowerCase().includes(q)
      );
    }
    if (maxPrice) list = list.filter((b) => b.price <= maxPrice);
    return list;
  }, [buses, search, maxPrice]);

  const resetFilters = () => {
    setSearch('');
    setMaxPrice('');
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
        <ArrowLeft className="h-4 w-4" /> Back to Home
      </Link>
      <SectionHeader
        title="Bus Travel"
        subtitle="Comfortable and affordable bus rides. WiFi, power outlets, and premium operators."
      />

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-64 shrink-0">
          <BusFilters
            search={search}
            setSearch={setSearch}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            onReset={resetFilters}
          />
        </aside>
        <div className="flex-1 min-w-0">
          <p className="text-muted-foreground text-sm mb-4">{filtered.length} bus trip(s) found</p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filtered.map((bus, i) => (
              <motion.div
                key={bus.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <Card className="p-6 hover:shadow-card-hover transition-all h-full flex flex-col border border-border/60 bg-card/80">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center">
                        <Bus className="h-5 w-5 text-primary" />
                      </div>
                      <span className="font-semibold">{bus.operator}</span>
                      {bus.busType === 'Premium' && (
                        <span className="rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-medium px-2 py-0.5">
                          Premium
                        </span>
                      )}
                    </div>
                    {bus.savePercent > 0 && (
                      <span className="rounded-full bg-primary/20 text-primary text-xs font-bold px-3 py-1">
                        Save {bus.savePercent}%
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {bus.from} → {bus.to}
                  </p>
                  <p className="text-xs text-muted-foreground mb-3">
                    {bus.departure} - {bus.arrival} · {bus.duration}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {bus.amenities.slice(0, 4).map((a) => (
                      <span key={a} className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        {a === 'WiFi' ? <Wifi className="h-3 w-3" /> : a === 'Power Outlets' ? <Zap className="h-3 w-3" /> : null}
                        {a}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
                    <span className="text-2xl font-bold text-primary">{formatPrice(bus.price)}</span>
                    <div className="flex gap-2">
                      <Link href={`/bus/${bus.id}`}>
                        <Button variant="outline" size="sm" className="rounded-xl gap-1">
                          <Eye className="h-4 w-4" /> View More
                        </Button>
                      </Link>
                      <Link href="/booking-summary" onClick={() => setSelectedBus(bus)}>
                        <Button size="sm" className="rounded-xl">Book Now</Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-12">No bus trips match your filters. Try adjusting search or price.</p>
          )}
        </div>
      </div>
    </div>
  );
}
