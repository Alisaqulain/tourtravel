'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, MapPin, Eye } from 'lucide-react';
import { SectionHeader } from '@/components/ui/section-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatPrice } from '@/lib/utils';
import { useBookingStore, useDataStore } from '@/store';
import { TourFilters } from '@/components/filters/tour-filters';

export default function ToursPage() {
  const tours = useDataStore((s) => s.tours);
  const setSelectedTour = useBookingStore((s) => s.setSelectedTour);
  const [search, setSearch] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const filtered = useMemo(() => {
    let list = [...tours];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.destination.toLowerCase().includes(q)
      );
    }
    if (maxPrice) list = list.filter((t) => t.price <= maxPrice);
    return list;
  }, [tours, search, maxPrice]);

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
        title="Tours"
        subtitle="Guided tours and experiences around the world. Expert guides and small groups."
      />

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-80 xl:w-96 shrink-0">
          <TourFilters
            search={search}
            setSearch={setSearch}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            onReset={resetFilters}
          />
        </aside>
        <div className="flex-1 min-w-0">
          <p className="text-muted-foreground text-sm mb-4">{filtered.length} tour(s) found</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((tour, i) => (
              <motion.div
                key={tour.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <Card className="overflow-hidden h-full hover:shadow-card-hover transition-all flex flex-col">
                  <div className="relative h-48">
                    <Image
                      src={tour.image}
                      alt={tour.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute top-4 right-4 rounded-full bg-primary text-white text-xs font-bold px-3 py-1">
                      {tour.duration}
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="h-4 w-4 fill-primary text-primary" />
                      <span className="text-sm font-medium">{tour.rating}</span>
                      <span className="text-muted-foreground text-sm">({tour.reviewCount} reviews)</span>
                    </div>
                    <h3 className="text-lg font-bold mb-1">{tour.title}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mb-4">
                      <MapPin className="h-4 w-4" /> {tour.destination}
                    </p>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
                      <div>
                        <span className="text-xl font-bold text-primary">{formatPrice(tour.price)}</span>
                        <span className="text-sm line-through text-muted-foreground ml-2">{formatPrice(tour.originalPrice)}</span>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/tours/${tour.id}`}>
                          <Button variant="outline" size="sm" className="rounded-xl gap-1">
                            <Eye className="h-4 w-4" /> View More
                          </Button>
                        </Link>
                        <Link href="/booking-summary" onClick={() => setSelectedTour(tour)}>
                          <Button size="sm" className="rounded-xl">Book</Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-12">No tours match your filters. Try adjusting search or price.</p>
          )}
        </div>
      </div>
    </div>
  );
}
