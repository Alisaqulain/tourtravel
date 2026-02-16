'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Bus, Clock, Calendar, Star, Wifi, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatPrice } from '@/lib/utils';
import { useBookingStore, useDataStore } from '@/store';
import { busReviews } from '@/data/reviews';

export default function BusDetailPage() {
  const params = useParams();
  const router = useRouter();
  const buses = useDataStore((s) => s.buses);
  const setSelectedBus = useBookingStore((s) => s.setSelectedBus);
  const bus = buses.find((b) => b.id === params.id);

  if (!bus) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p>Bus trip not found.</p>
        <Link href="/bus" className="text-primary mt-4 inline-block">← Back to Bus</Link>
      </div>
    );
  }

  const handleBook = () => {
    setSelectedBus(bus);
    router.push('/booking-summary');
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Link href="/bus" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
        <ArrowLeft className="h-4 w-4" /> Back to Bus
      </Link>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="p-6 md:p-8 mb-8 border border-border/60 bg-card/80">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 rounded-xl bg-primary/20 flex items-center justify-center">
                <Bus className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{bus.operator}</h1>
                <p className="text-muted-foreground">{bus.from} → {bus.to}</p>
                {bus.busType === 'Premium' && (
                  <span className="inline-block mt-2 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 text-sm font-medium px-3 py-1">
                    Premium
                  </span>
                )}
              </div>
            </div>
            {bus.savePercent > 0 && (
              <span className="rounded-full bg-primary/20 text-primary font-bold px-4 py-2">Save {bus.savePercent}%</span>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="rounded-xl bg-muted/50 p-4">
              <p className="text-xs text-muted-foreground">Departure</p>
              <p className="font-semibold">{bus.departure}</p>
            </div>
            <div className="rounded-xl bg-muted/50 p-4">
              <p className="text-xs text-muted-foreground">Arrival</p>
              <p className="font-semibold">{bus.arrival}</p>
            </div>
            <div className="rounded-xl bg-muted/50 p-4">
              <p className="text-xs text-muted-foreground">Duration</p>
              <p className="font-semibold">{bus.duration}</p>
            </div>
            <div className="rounded-xl bg-muted/50 p-4">
              <p className="text-xs text-muted-foreground">Date</p>
              <p className="font-semibold">{bus.date}</p>
            </div>
          </div>

          <h3 className="font-semibold mb-2">Amenities</h3>
          <div className="flex flex-wrap gap-2 mb-6">
            {bus.amenities.map((a) => (
              <span key={a} className="inline-flex items-center gap-2 rounded-xl bg-muted px-3 py-2 text-sm">
                {a === 'WiFi' ? <Wifi className="h-4 w-4" /> : a === 'Power Outlets' ? <Zap className="h-4 w-4" /> : null}
                {a}
              </span>
            ))}
          </div>

          <p className="text-sm text-muted-foreground mb-4">Seats available: {bus.seatsAvailable}</p>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border">
            <p className="text-2xl font-bold text-primary">{formatPrice(bus.price)}</p>
            <Button onClick={handleBook} className="rounded-xl">Book Now</Button>
          </div>
        </Card>

        <h2 className="text-xl font-bold mb-4">Reviews</h2>
        <div className="space-y-4">
          {busReviews.map((r) => (
            <Card key={r.id} className="p-4">
              <div className="flex items-center gap-2 mb-2">
                {[...Array(r.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
                <span className="font-medium">{r.name}</span>
                <span className="text-muted-foreground text-sm">{r.date}</span>
              </div>
              <p className="text-muted-foreground">{r.text}</p>
            </Card>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
