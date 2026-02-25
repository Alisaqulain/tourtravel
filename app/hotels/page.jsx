'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Star, Eye, SlidersHorizontal } from 'lucide-react';
import { SectionHeader } from '@/components/ui/section-header';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';
import { useBookingStore, useDataStore } from '@/store';
import { HotelFilters } from '@/components/filters/hotel-filters';
import { FilterDrawer } from '@/components/layout/filter-drawer';

export default function HotelsPage() {
  const hotels = useDataStore((s) => s.hotels);
  const setSelectedHotel = useBookingStore((s) => s.setSelectedHotel);
  const [search, setSearch] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minRating, setMinRating] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);

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
    <div className="overflow-x-hidden">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-10 max-w-7xl min-w-0">
      <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 sm:mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to Home
      </Link>
      <SectionHeader
        title="Hotels"
        subtitle="Find and book the perfect stay. From budget to luxury, we have it all."
      />

      <div className="flex items-center justify-between gap-4 mb-4 lg:hidden">
        <Button variant="outline" className="rounded-xl gap-2" onClick={() => setFiltersOpen(true)}>
          <SlidersHorizontal className="h-4 w-4" /> Filters
        </Button>
        <span className="text-sm text-muted-foreground">{filtered.length} hotel(s) found</span>
      </div>

      <FilterDrawer open={filtersOpen} onClose={() => setFiltersOpen(false)} title="Filters">
        <HotelFilters
          search={search}
          setSearch={setSearch}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          minRating={minRating}
          setMinRating={setMinRating}
          onReset={() => { resetFilters(); setFiltersOpen(false); }}
        />
      </FilterDrawer>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        <aside className="hidden lg:block lg:w-72 xl:w-80 shrink-0">
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
        <div className="flex-1 min-w-0 overflow-hidden">
          <p className="text-muted-foreground text-sm mb-4 hidden lg:block">{filtered.length} hotel(s) found</p>
          <div className="grid grid-cols-1 gap-5 sm:gap-6">
            {filtered.map((hotel, i) => (
              <motion.div
                key={hotel.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="min-w-0"
              >
                <div className="group rounded-2xl border border-border bg-card overflow-hidden shadow-premium hover:shadow-card-hover transition-all flex flex-col sm:flex-row min-w-0">
                  <div className="relative h-56 sm:h-44 sm:min-h-[160px] sm:w-64 md:w-72 flex-shrink-0">
                    <Image
                      src={hotel.image}
                      alt={hotel.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, 288px"
                    />
                  </div>
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between min-w-0">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1 mb-1.5 flex-wrap">
                        {[...Array(5)].map((_, k) => (
                          <Star key={k} className="h-4 w-4 fill-primary text-primary shrink-0" />
                        ))}
                        <span className="text-sm text-muted-foreground shrink-0">({hotel.reviewCount.toLocaleString()} reviews)</span>
                      </div>
                      <h2 className="text-lg font-bold mb-1 break-words" title={hotel.name}>{hotel.name}</h2>
                      <p className="text-muted-foreground text-sm flex items-center gap-1 mb-2 min-w-0">
                        <MapPin className="h-4 w-4 shrink-0" /> {hotel.location}
                      </p>
                      <p className="text-sm text-muted-foreground line-clamp-2 min-w-0">{hotel.amenities.join(' · ')}</p>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-3 mt-3 pt-3 border-t border-border">
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-bold text-primary">{formatPrice(hotel.pricePerNight)}</span>
                        <span className="text-muted-foreground text-sm">/ night</span>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <Link href={`/hotels/${hotel.id}`}>
                          <Button variant="outline" size="sm" className="rounded-xl gap-1 shrink-0">
                            <Eye className="h-4 w-4" /> View More
                          </Button>
                        </Link>
                        <Link href="/booking-summary" onClick={() => setSelectedHotel(hotel)}>
                          <Button size="sm" className="rounded-xl shrink-0 whitespace-nowrap">Book Now</Button>
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
    </div>
  );
}
