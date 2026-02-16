'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Plane, ArrowLeft, Eye } from 'lucide-react';
import { SectionHeader } from '@/components/ui/section-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatPrice } from '@/lib/utils';
import { useBookingStore, useDataStore } from '@/store';
import { FlightFilters } from '@/components/filters/flight-filters';

export default function FlightsPage() {
  const setSelectedFlight = useBookingStore((s) => s.setSelectedFlight);
  const flights = useDataStore((s) => s.flights);
  const [search, setSearch] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const filtered = useMemo(() => {
    let list = [...flights];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (f) =>
          f.airline.toLowerCase().includes(q) ||
          f.from.toLowerCase().includes(q) ||
          f.to.toLowerCase().includes(q)
      );
    }
    if (maxPrice) list = list.filter((f) => f.price <= maxPrice);
    return list;
  }, [flights, search, maxPrice]);

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
        title="Flights"
        subtitle="Compare and book flights at the best prices. All major airlines in one place."
      />

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-64 shrink-0">
          <FlightFilters
            search={search}
            setSearch={setSearch}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            onReset={resetFilters}
          />
        </aside>
        <div className="flex-1 min-w-0">
          <p className="text-muted-foreground text-sm mb-4">{filtered.length} flight(s) found</p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filtered.map((flight, i) => (
              <motion.div
                key={flight.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <Card className="overflow-hidden p-0 hover:shadow-card-hover transition-all h-full flex flex-col">
                  {flight.image && (
                    <div className="relative h-44 w-full flex-shrink-0">
                      <Image src={flight.image} alt={`${flight.from} to ${flight.to}`} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <div className="h-9 w-9 rounded-lg bg-white/90 flex items-center justify-center">
                          <Plane className="h-4 w-4 text-primary" />
                        </div>
                        <span className="font-semibold text-white drop-shadow">{flight.airline}</span>
                      </div>
                      {flight.savePercent > 0 && (
                        <span className="absolute top-3 right-3 rounded-full bg-primary text-white text-xs font-bold px-3 py-1">
                          Save {flight.savePercent}%
                        </span>
                      )}
                    </div>
                  )}
                  <div className="p-5 flex-1 flex flex-col">
                    {!flight.image && (
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2">
                          <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center">
                            <Plane className="h-5 w-5 text-primary" />
                          </div>
                          <span className="font-semibold">{flight.airline}</span>
                        </div>
                        {flight.savePercent > 0 && (
                          <span className="rounded-full bg-primary/20 text-primary text-xs font-bold px-3 py-1">
                            Save {flight.savePercent}%
                          </span>
                        )}
                      </div>
                    )}
                    <p className="text-sm text-muted-foreground mb-1">
                      {flight.from} → {flight.to}
                    </p>
                    <p className="text-xs text-muted-foreground mb-4">
                      {flight.departure} - {flight.arrival} · {flight.duration} · {flight.class}
                    </p>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
                      <span className="text-2xl font-bold text-primary">{formatPrice(flight.price)}</span>
                      <div className="flex gap-2">
                        <Link href={`/flights/${flight.id}`}>
                          <Button variant="outline" size="sm" className="rounded-xl gap-1">
                            <Eye className="h-4 w-4" /> View More
                          </Button>
                        </Link>
                        <Link href="/booking-summary" onClick={() => setSelectedFlight(flight)}>
                          <Button size="sm" className="rounded-xl">Select</Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-12">No flights match your filters. Try adjusting search or price.</p>
          )}
        </div>
      </div>
    </div>
  );
}
