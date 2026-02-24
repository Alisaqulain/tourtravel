'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Train, ArrowLeft, Eye } from 'lucide-react';
import { SectionHeader } from '@/components/ui/section-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatPrice } from '@/lib/utils';
import { useBookingStore, useDataStore } from '@/store';
import { TrainFilters } from '@/components/filters/train-filters';

export default function TrainPage() {
  const setSelectedTrain = useBookingStore((s) => s.setSelectedTrain);
  const trains = useDataStore((s) => s.trains);
  const [search, setSearch] = useState('');
  const [travelClass, setTravelClass] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const filtered = useMemo(() => {
    let list = [...trains];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.from.toLowerCase().includes(q) ||
          t.to.toLowerCase().includes(q) ||
          t.trainNo.toLowerCase().includes(q)
      );
    }
    if (travelClass) list = list.filter((t) => t.classes?.includes(travelClass) || t.class === travelClass);
    if (maxPrice) list = list.filter((t) => t.price <= maxPrice);
    return list;
  }, [trains, search, travelClass, maxPrice]);

  const resetFilters = () => {
    setSearch('');
    setTravelClass('');
    setMaxPrice('');
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
        <ArrowLeft className="h-4 w-4" aria-hidden /> Back to Home
      </Link>
      <SectionHeader
        title="Train Booking"
        subtitle="Book IRCTC and other train tickets. Check availability, compare fares, and redirect to official booking."
      />

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-64 shrink-0">
          <TrainFilters
            search={search}
            setSearch={setSearch}
            travelClass={travelClass}
            setTravelClass={setTravelClass}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            onReset={resetFilters}
          />
        </aside>
        <div className="flex-1 min-w-0">
          <p className="text-muted-foreground text-sm mb-4">{filtered.length} train(s) found</p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filtered.map((train, i) => (
              <motion.div
                key={train.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <Card className="overflow-hidden p-0 hover:shadow-lg transition-all h-full flex flex-col border border-border rounded-2xl">
                  {train.image && (
                    <div className="relative h-40 w-full flex-shrink-0">
                      <Image
                        src={train.image}
                        alt={`${train.name} ${train.from} to ${train.to}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <div className="h-9 w-9 rounded-lg bg-white/90 flex items-center justify-center">
                          <Train className="h-4 w-4 text-primary" />
                        </div>
                        <span className="font-semibold text-white drop-shadow">{train.name}</span>
                      </div>
                      {train.savePercent > 0 && (
                        <span className="absolute top-3 right-3 rounded-full bg-primary text-white text-xs font-bold px-3 py-1">
                          Save {train.savePercent}%
                        </span>
                      )}
                    </div>
                  )}
                  <div className="p-5 flex-1 flex flex-col">
                    {!train.image && (
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center">
                            <Train className="h-5 w-5 text-primary" />
                          </div>
                          <span className="font-semibold">{train.name}</span>
                        </div>
                        {train.savePercent > 0 && (
                          <span className="rounded-full bg-primary/20 text-primary text-xs font-bold px-3 py-1">
                            Save {train.savePercent}%
                          </span>
                        )}
                      </div>
                    )}
                    <p className="text-sm text-muted-foreground mb-1">
                      {train.from} → {train.to}
                    </p>
                    <p className="text-xs text-muted-foreground mb-3">
                      {train.departure} - {train.arrival} · {train.duration} · {train.class}
                    </p>
                    <p className="text-xs text-muted-foreground mb-4">Train no. {train.trainNo} · {train.seatsAvailable} seats left</p>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
                      <span className="text-xl font-bold text-primary">{formatPrice(train.price)}</span>
                      <div className="flex gap-2">
                        <Link href={`/train/${train.id}`}>
                          <Button variant="outline" size="sm" className="rounded-xl gap-1">
                            <Eye className="h-4 w-4" /> View More
                          </Button>
                        </Link>
                        <Link href="/booking-summary" onClick={() => setSelectedTrain(train)}>
                          <Button size="sm" className="rounded-xl">Book Now</Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-12">No trains match your filters. Try adjusting search or class.</p>
          )}
        </div>
      </div>
    </div>
  );
}
