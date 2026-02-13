'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Plane, ArrowLeft } from 'lucide-react';
import { SectionHeader } from '@/components/ui/section-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatPrice } from '@/lib/utils';
import { useBookingStore } from '@/store';
import { flights } from '@/data/flights';

export default function FlightsPage() {
  const setSelectedFlight = useBookingStore((s) => s.setSelectedFlight);

  return (
    <div className="container mx-auto px-4 py-12">
      <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
        <ArrowLeft className="h-4 w-4" /> Back to Home
      </Link>
      <SectionHeader
        title="Flights"
        subtitle="Compare and book flights at the best prices. All major airlines in one place."
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {flights.map((flight, i) => (
          <motion.div
            key={flight.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link href="/booking-summary" onClick={() => setSelectedFlight(flight)}>
              <Card className="p-6 hover:shadow-card-hover transition-shadow cursor-pointer h-full">
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
                <p className="text-sm text-muted-foreground mb-2">
                  {flight.from} → {flight.to}
                </p>
                <p className="text-xs text-muted-foreground mb-4">
                  {flight.departure} - {flight.arrival} · {flight.duration} · {flight.class}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary">{formatPrice(flight.price)}</span>
                  <Button size="sm" className="rounded-xl">Select</Button>
                </div>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
