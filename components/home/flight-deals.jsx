'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Plane, Clock } from 'lucide-react';
import { SectionHeader } from '@/components/ui/section-header';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';
import { useBookingStore, useDataStore } from '@/store';

export function FlightDeals() {
  const setSelectedFlight = useBookingStore((s) => s.setSelectedFlight);
  const flights = useDataStore((s) => s.flights);

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="Flight Deals"
          subtitle="Grab these limited-time offers on popular routes. Book now and save."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {flights.slice(0, 6).map((flight, i) => (
            <motion.div
              key={flight.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <Link href="/flights">
                <div
                  className="glass-card rounded-2xl p-6 hover:shadow-card-hover transition-all duration-300 group cursor-pointer border border-white/20 dark:border-white/10"
                  onClick={() => setSelectedFlight(flight)}
                >
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
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                    <span>{flight.from}</span>
                    <Clock className="h-4 w-4" />
                    <span>{flight.to}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-4">
                    {flight.departure} - {flight.arrival} · {flight.duration}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">{formatPrice(flight.price)}</span>
                    <Button size="sm" variant="outline" className="rounded-xl group-hover:bg-primary group-hover:text-white group-hover:border-primary">
                      View
                    </Button>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link href="/flights">
            <Button variant="outline" size="lg" className="rounded-xl">
              View All Flights
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
