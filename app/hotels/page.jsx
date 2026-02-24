'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Star, Eye } from 'lucide-react';
import { SectionHeader } from '@/components/ui/section-header';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';
import { useBookingStore, useDataStore } from '@/store';
import { HotelFilters } from '@/components/filters/hotel-filters';

export default function HotelsPage() {
  const hotels = useDataStore((s) => s.hotels);
  const setSelectedHotel = useBookingStore((s) => s.setSelectedHotel);
  const [search, setSearch] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minRating, setMinRating] = useState('');

  const filtered = useMemo(() => {
    let list = [...hotels];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (h) =>
          h.name.toLowerCase().includes(q) ||
          h.location.toLowerCase().includes(q)
      );
    }
    if (maxPrice) list = list.filter((h) => h.pricePerNight <= maxPrice);
    if (minRating) list = list.filter((h) => h.rating >= minRating);
    return list;
  }, [hotels, search, maxPrice, minRating]);

  const resetFilters = () => {
    setSearch('');
    setMaxPrice('');
    setMinRating('');
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
        <ArrowLeft className="h-4 w-4" /> Back to Home
      </Link>
      <SectionHeader
        title="Hotels"
        subtitle="Find and book the perfect stay. From budget to luxury, we have it all."
      />

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-80 xl:w-96 shrink-0">
          <HotelFilters
            search={search}
            setSearch={setSearch}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            minRating={minRating}
            setMinRating={setMinRating}
            onReset={resetFilters}
          />
        </aside>
        <div className="flex-1 min-w-0">
          <p className="text-muted-foreground text-sm mb-4">{filtered.length} hotel(s) found</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((hotel, i) => (
              <motion.div
                key={hotel.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <div className="group rounded-2xl border border-border bg-card overflow-hidden shadow-premium hover:shadow-card-hover transition-all flex flex-col md:flex-row">
                  <div className="relative h-56 md:min-h-[220px] md:w-72 flex-shrink-0">
                    <Image
                      src={hotel.image}
                      alt={hotel.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 350px"
                    />
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, k) => (
                          <Star key={k} className="h-4 w-4 fill-primary text-primary" />
                        ))}
                        <span className="text-sm text-muted-foreground">({hotel.reviewCount.toLocaleString()} reviews)</span>
                      </div>
                      <h2 className="text-xl font-bold mb-1">{hotel.name}</h2>
                      <p className="text-muted-foreground flex items-center gap-1 mb-3">
                        <MapPin className="h-4 w-4" /> {hotel.location}
                      </p>
                      <p className="text-sm text-muted-foreground">{hotel.amenities.join(' · ')}</p>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-4 border-t border-border">
                      <div>
                        <span className="text-2xl font-bold text-primary">{formatPrice(hotel.pricePerNight)}</span>
                        <span className="text-muted-foreground"> / night</span>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/hotels/${hotel.id}`}>
                          <Button variant="outline" size="sm" className="rounded-xl gap-1">
                            <Eye className="h-4 w-4" /> View More
                          </Button>
                        </Link>
                        <Link href="/booking-summary" onClick={() => setSelectedHotel(hotel)}>
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
            <p className="text-center text-muted-foreground py-12">No hotels match your filters. Try adjusting search or filters.</p>
          )}
        </div>
      </div>
    </div>
  );
}
