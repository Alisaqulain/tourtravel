'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Car, Star, MapPin, Eye, Users, Briefcase } from 'lucide-react';
import { SectionHeader } from '@/components/ui/section-header';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';
import { useBookingStore, useDataStore } from '@/store';
import { CarFilters } from '@/components/filters/car-filters';

export default function CarsPage() {
  const cars = useDataStore((s) => s.cars);
  const setSelectedCar = useBookingStore((s) => s.setSelectedCar);
  const [search, setSearch] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const filtered = useMemo(() => {
    let list = [...cars];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q) ||
          c.location.toLowerCase().includes(q)
      );
    }
    if (maxPrice) list = list.filter((c) => c.pricePerDay <= maxPrice);
    return list;
  }, [cars, search, maxPrice]);

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
        title="Premium Cars"
        subtitle="Luxury and premium rentals. Mercedes, BMW, Audi, Porsche & more. Best rates guaranteed."
      />

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-64 shrink-0">
          <CarFilters
            search={search}
            setSearch={setSearch}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            onReset={resetFilters}
          />
        </aside>
        <div className="flex-1 min-w-0">
          <p className="text-muted-foreground text-sm mb-4">{filtered.length} car(s) found</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((car, i) => (
              <motion.div
                key={car.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <div className="group rounded-2xl border border-border bg-card overflow-hidden shadow-premium hover:shadow-card-hover transition-all flex flex-col md:flex-row">
                  <div className="relative h-52 md:min-h-[220px] md:w-72 flex-shrink-0">
                    <Image
                      src={car.image}
                      alt={car.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 350px"
                    />
                    <span className="absolute top-4 left-4 rounded-full bg-amber-500/90 text-white text-xs font-bold px-3 py-1">
                      Premium
                    </span>
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1 mb-2">
                        <Star className="h-4 w-4 fill-primary text-primary" />
                        <span className="text-sm font-medium">{car.rating}</span>
                        <span className="text-muted-foreground text-sm">({car.reviewCount} reviews)</span>
                      </div>
                      <h2 className="text-xl font-bold mb-1">{car.name}</h2>
                      <p className="text-muted-foreground text-sm flex items-center gap-1 mb-2">
                        <MapPin className="h-4 w-4" /> {car.location}
                      </p>
                      <p className="text-xs text-muted-foreground mb-3">{car.category} · {car.transmission}</p>
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {car.seats} seats</span>
                        <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" /> {car.bags} bags</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-4 border-t border-border">
                      <div>
                        <span className="text-2xl font-bold text-primary">{formatPrice(car.pricePerDay)}</span>
                        <span className="text-muted-foreground text-sm"> / day</span>
                        {car.originalPrice && (
                          <span className="text-sm line-through text-muted-foreground ml-2">{formatPrice(car.originalPrice)}</span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/cars/${car.id}`}>
                          <Button variant="outline" size="sm" className="rounded-xl gap-1">
                            <Eye className="h-4 w-4" /> View More
                          </Button>
                        </Link>
                        <Link href="/booking-summary" onClick={() => setSelectedCar(car)}>
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
            <p className="text-center text-muted-foreground py-12">No cars match your filters. Try adjusting search or price.</p>
          )}
        </div>
      </div>
    </div>
  );
}
