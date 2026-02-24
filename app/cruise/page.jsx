'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Ship, Star, MapPin, Eye } from 'lucide-react';
import { SectionHeader } from '@/components/ui/section-header';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';
import { useBookingStore, useDataStore } from '@/store';
import { CruiseFilters } from '@/components/filters/cruise-filters';

export default function CruisePage() {
  const cruises = useDataStore((s) => s.cruises);
  const setSelectedCruise = useBookingStore((s) => s.setSelectedCruise);
  const [search, setSearch] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const filtered = useMemo(() => {
    let list = [...cruises];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.ship.toLowerCase().includes(q) ||
          c.route.toLowerCase().includes(q)
      );
    }
    if (maxPrice) list = list.filter((c) => c.price <= maxPrice);
    return list;
  }, [cruises, search, maxPrice]);

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
        title="Cruise Vacations"
        subtitle="Sail in style. World-class ships, stunning routes, and unforgettable experiences."
      />

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-80 xl:w-96 shrink-0">
          <CruiseFilters
            search={search}
            setSearch={setSearch}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            onReset={resetFilters}
          />
        </aside>
        <div className="flex-1 min-w-0">
          <p className="text-muted-foreground text-sm mb-4">{filtered.length} cruise(s) found</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((cruise, i) => (
              <motion.div
                key={cruise.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <div className="group rounded-2xl border border-border bg-card overflow-hidden shadow-premium hover:shadow-card-hover transition-all flex flex-col">
                  <div className="relative h-56 md:min-h-[220px] overflow-hidden">
                    <Image
                      src={cruise.image}
                      alt={cruise.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <span className="absolute top-4 left-4 rounded-full bg-primary px-3 py-1 text-xs font-bold text-white">
                      Save {cruise.savePercent}%
                    </span>
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h2 className="text-lg font-bold">{cruise.name}</h2>
                      <p className="text-sm text-white/90 flex items-center gap-1">
                        <Ship className="h-4 w-4" /> {cruise.ship} · {cruise.duration}
                      </p>
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="h-4 w-4 fill-primary text-primary" />
                      <span className="text-sm font-medium">{cruise.rating}</span>
                      <span className="text-muted-foreground text-sm">({cruise.reviewCount} reviews)</span>
                    </div>
                    <p className="text-muted-foreground text-sm flex items-center gap-1 mb-3">
                      <MapPin className="h-4 w-4" /> {cruise.route}
                    </p>
                    <p className="text-xs text-muted-foreground mb-4">Departs {cruise.departureDate}</p>
                    <div className="flex flex-wrap items-center justify-between gap-3 mt-auto pt-4 border-t border-border">
                      <div>
                        <span className="text-2xl font-bold text-primary">{formatPrice(cruise.price)}</span>
                        <span className="text-sm line-through text-muted-foreground ml-2">{formatPrice(cruise.originalPrice)}</span>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/cruise/${cruise.id}`}>
                          <Button variant="outline" size="sm" className="rounded-xl gap-1">
                            <Eye className="h-4 w-4" /> View More
                          </Button>
                        </Link>
                        <Link href="/booking-summary" onClick={() => setSelectedCruise(cruise)}>
                          <Button size="sm" className="rounded-xl">Book Now</Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-12">No cruises match your filters. Try adjusting search or price.</p>
          )}
        </div>
      </div>
    </div>
  );
}
