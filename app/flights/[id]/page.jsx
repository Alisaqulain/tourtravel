'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Plane, Clock, Calendar, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ImageSlider } from '@/components/ui/image-slider';
import { formatPrice } from '@/lib/utils';
import { useBookingStore, useDataStore } from '@/store';
import { flightReviews } from '@/data/reviews';

export default function FlightDetailPage() {
  const params = useParams();
  const router = useRouter();
  const flights = useDataStore((s) => s.flights);
  const setSelectedFlight = useBookingStore((s) => s.setSelectedFlight);
  const flight = flights.find((f) => f.id === params.id);

  if (!flight) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p>Flight not found.</p>
        <Link href="/flights" className="text-primary mt-4 inline-block">← Back to Flights</Link>
      </div>
    );
  }

  const handleBook = () => {
    setSelectedFlight(flight);
    router.push('/booking-summary');
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Link href="/flights" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
        <ArrowLeft className="h-4 w-4" /> Back to Flights
      </Link>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="overflow-hidden mb-8">
          {(flight.images?.length > 0 || flight.image) && (
            <div className="relative w-full aspect-[16/10] min-h-[280px] md:min-h-[360px]">
              <ImageSlider images={flight.images || (flight.image ? [flight.image] : [])} alt={`${flight.airline} ${flight.from} to ${flight.to}`} priority />
            </div>
          )}
          <div className="p-6 md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 rounded-xl bg-primary/20 flex items-center justify-center">
                <Plane className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{flight.airline}</h1>
                <p className="text-muted-foreground">{flight.from} → {flight.to}</p>
              </div>
            </div>
            {flight.savePercent > 0 && (
              <span className="rounded-full bg-primary/20 text-primary font-bold px-4 py-2">Save {flight.savePercent}%</span>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="rounded-xl bg-muted/50 p-4">
              <p className="text-xs text-muted-foreground">Departure</p>
              <p className="font-semibold">{flight.departure}</p>
            </div>
            <div className="rounded-xl bg-muted/50 p-4">
              <p className="text-xs text-muted-foreground">Arrival</p>
              <p className="font-semibold">{flight.arrival}</p>
            </div>
            <div className="rounded-xl bg-muted/50 p-4">
              <p className="text-xs text-muted-foreground">Duration</p>
              <p className="font-semibold">{flight.duration}</p>
            </div>
            <div className="rounded-xl bg-muted/50 p-4">
              <p className="text-xs text-muted-foreground">Date</p>
              <p className="font-semibold">{flight.date}</p>
            </div>
          </div>

          <div className="rounded-xl bg-muted/50 p-4 mb-6">
            <h3 className="font-semibold mb-2">Flight details</h3>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Class: {flight.class}</li>
              <li>Stops: {flight.stops === 0 ? 'Direct' : `${flight.stops} stop(s)`}</li>
              <li>Baggage: 1 cabin bag (7 kg) + 1 checked bag (23 kg) included</li>
              <li>Refundable: Non-refundable. Date change may be allowed with fee.</li>
            </ul>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border">
            <p className="text-2xl font-bold text-primary">{formatPrice(flight.price)}</p>
            <Button onClick={handleBook} className="rounded-xl">Book Now</Button>
          </div>
          </div>
        </Card>

        <h2 className="text-xl font-bold mb-4">Guest reviews</h2>
        <div className="space-y-4">
          {flightReviews.map((r) => (
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
