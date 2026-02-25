'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Plane, ArrowLeft, Eye, SlidersHorizontal } from 'lucide-react';
import { SectionHeader } from '@/components/ui/section-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatPrice } from '@/lib/utils';
import { useBookingStore } from '@/store';
import { FlightFilters } from '@/components/filters/flight-filters';
import { PagePromoBanner } from '@/components/layout/page-promo-banner';
import { FilterDrawer } from '@/components/layout/filter-drawer';
import { useTravelList } from '@/hooks/useTravelList';
import { toast } from '@/lib/toast';

const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800';

function FlightCardSkeleton() {
  return (
    <Card className="overflow-hidden p-0 animate-pulse">
      <div className="h-32 bg-muted" />
      <div className="p-5 space-y-3">
        <div className="h-5 bg-muted rounded w-2/3" />
        <div className="h-4 bg-muted rounded w-1/2" />
        <div className="h-8 bg-muted rounded w-1/3 mt-4" />
      </div>
    </Card>
  );
}

export default function FlightsPage() {
  const setSelectedFlight = useBookingStore((s) => s.setSelectedFlight);
  const [search, setSearch] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [stops, setStops] = useState('');
  const [refundable, setRefundable] = useState(false);
  const [sortBy, setSortBy] = useState('price');
  const [order, setOrder] = useState('asc');
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const limit = 12;

  const params = useMemo(
    () => ({
      origin: '',
      destination: '',
      adults: 1,
      page,
      limit,
      sortBy,
      order,
      ...(minPrice ? { minPrice: Number(minPrice) } : {}),
      ...(maxPrice ? { maxPrice: Number(maxPrice) } : {}),
      ...(stops !== '' && !Number.isNaN(parseInt(stops, 10)) ? { stops: parseInt(stops, 10) } : {}),
      ...(refundable ? { refundable: 'true' } : {}),
      ...(search ? { airline: search } : {}),
    }),
    [page, limit, sortBy, order, minPrice, maxPrice, stops, refundable, search]
  );

  const { data: flights, total, page: currentPage, totalPages, loading, error, refetch } = useTravelList('flights', params);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const resetFilters = () => {
    setSearch('');
    setMinPrice('');
    setMaxPrice('');
    setStops('');
    setRefundable(false);
    setPage(1);
  };

  const handleSelectFlight = (flight) => {
    setSelectedFlight({
      id: flight.id,
      airline: flight.airline,
      from: flight.departureAirport || flight.departureTime,
      to: flight.arrivalAirport || flight.arrivalTime,
      departure: flight.departureTime,
      arrival: flight.arrivalTime,
      duration: flight.duration,
      price: flight.price,
      currency: flight.currency,
      class: flight.cabinClass,
      stops: flight.stops,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="container mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-10 max-w-7xl"
    >
      <Link href="/" className="inline-flex items-center gap-2 text-foreground/90 hover:text-foreground mb-4 sm:mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Home
      </Link>
      <PagePromoBanner message="FLAT 15% OFF on Flights" code="FLY15" href="/flights" />
      <SectionHeader
        title="Flights"
        subtitle="Compare and book flights at the best prices. All major airlines in one place."
      />

      <div className="flex items-center justify-between gap-4 mb-4 lg:hidden">
        <Button variant="outline" className="rounded-xl gap-2" onClick={() => setFiltersOpen(true)}>
          <SlidersHorizontal className="h-4 w-4" /> Filters
        </Button>
        <span className="text-sm text-muted-foreground">{loading ? 'Loading...' : `${total} flight(s) found`}</span>
      </div>

      <FilterDrawer open={filtersOpen} onClose={() => setFiltersOpen(false)} title="Filters">
        <FlightFilters
          search={search}
          setSearch={setSearch}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          onReset={() => { resetFilters(); setFiltersOpen(false); }}
        />
      </FilterDrawer>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        <aside className="hidden lg:block lg:w-72 xl:w-80 shrink-0">
          <FlightFilters
            search={search}
            setSearch={setSearch}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            onReset={resetFilters}
          />
        </aside>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <p className="text-foreground/90 text-sm hidden lg:block">
              {loading ? 'Loading...' : `${total} flight(s) found`}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-foreground font-medium">Sort:</span>
              <select
                value={`${sortBy}-${order}`}
                onChange={(e) => {
                  const [s, o] = e.target.value.split('-');
                  setSortBy(s);
                  setOrder(o);
                  setPage(1);
                }}
                className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground"
              >
                <option value="price-asc">Price (Low to High)</option>
                <option value="price-desc">Price (High to Low)</option>
                <option value="duration-asc">Duration (Short first)</option>
                <option value="departureTime-asc">Departure (Early first)</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="mb-4 flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => { toast.info('Retrying...'); refetch(); }}>Retry</Button>
            </div>
          )}

          {loading && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <FlightCardSkeleton key={i} />
              ))}
            </div>
          )}

          {!loading && !error && flights.length === 0 && (
            <div className="text-center py-16 rounded-2xl border border-border bg-card">
              <Plane className="h-12 w-12 text-foreground/50 mx-auto mb-4" />
              <p className="text-foreground mb-2">No flights match your filters.</p>
              <p className="text-sm text-foreground/80 mb-4">Try adjusting search, price range or refundable option.</p>
              <Button variant="outline" onClick={resetFilters}>Reset filters</Button>
            </div>
          )}

          {!loading && !error && flights.length > 0 && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {flights.map((flight, i) => (
                  <motion.div
                    key={flight.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <Card className="overflow-hidden p-0 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                      {(flight.images && flight.images[0]) || PLACEHOLDER_IMAGE ? (
                        <div className="relative h-44 w-full flex-shrink-0">
                          <Image
                            src={flight.images?.[0] || PLACEHOLDER_IMAGE}
                            alt={`${flight.departureAirport} to ${flight.arrivalAirport}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            unoptimized={flight.images?.[0]?.startsWith('http')}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          <div className="absolute top-3 left-3 flex items-center gap-2">
                            <div className="h-9 w-9 rounded-lg bg-white/90 flex items-center justify-center">
                              <Plane className="h-4 w-4 text-primary" />
                            </div>
                            <span className="font-semibold text-white drop-shadow">{flight.airline}</span>
                          </div>
                          {flight.refundable && (
                            <span className="absolute top-3 right-3 rounded-full bg-green-600 text-white text-xs font-bold px-3 py-1">
                              Refundable
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="h-24 bg-muted flex items-center gap-2 px-4">
                          <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center">
                            <Plane className="h-5 w-5 text-primary" />
                          </div>
                          <span className="font-semibold">{flight.airline}</span>
                          {flight.refundable && (
                            <span className="rounded-full bg-primary/20 text-primary text-xs font-bold px-2 py-0.5 ml-2">Refundable</span>
                          )}
                        </div>
                      )}
                      <div className="p-5 flex-1 flex flex-col">
                        <p className="text-sm text-foreground/90 mb-1">
                          {flight.departureAirport} → {flight.arrivalAirport}
                        </p>
                        <p className="text-xs text-foreground/80 mb-4">
                          {flight.departureTime} - {flight.arrivalTime} · {flight.duration}
                          {flight.stops !== undefined && flight.stops !== null && ` · ${flight.stops} stop(s)`} · {flight.cabinClass}
                        </p>
                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
                          <span className="text-2xl font-bold text-primary">
                            {formatPrice(flight.price)} {flight.currency && flight.currency !== 'INR' ? flight.currency : ''}
                          </span>
                          <div className="flex gap-2">
                            <Link href={`/flights/${flight.id}`}>
                              <Button variant="outline" size="sm" className="rounded-xl gap-1">
                                <Eye className="h-4 w-4" /> View More
                              </Button>
                            </Link>
                            <Link href="/booking-summary" onClick={() => handleSelectFlight(flight)}>
                              <Button size="sm" className="rounded-xl">Select</Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    disabled={currentPage <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    Previous
                  </Button>
                  <span className="flex items-center px-4 text-sm text-foreground/90">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    disabled={currentPage >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
