'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, Plane, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatPrice } from '@/lib/utils';
import { useBookingStore } from '@/store';

export default function BookingSummaryPage() {
  const { selectedFlight, selectedHotel, selectedTour, selectedPackage } = useBookingStore();

  const hasBooking = selectedFlight || selectedHotel || selectedTour || selectedPackage;

  return (
    <div className="container mx-auto px-4 py-12">
      <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
        <ArrowLeft className="h-4 w-4" /> Back to Home
      </Link>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <h1 className="text-3xl font-bold mb-8">Booking Summary</h1>

        {!hasBooking ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground mb-6">You haven&apos;t selected any booking yet.</p>
            <Link href="/flights">
              <Button className="rounded-xl">Browse Flights</Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-6">
            {selectedFlight && (
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Plane className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">Flight</h3>
                    <p className="text-muted-foreground">
                      {selectedFlight.from} → {selectedFlight.to}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedFlight.airline} · {selectedFlight.departure} - {selectedFlight.arrival} · {selectedFlight.date}
                    </p>
                    <p className="text-xl font-bold text-primary mt-2">{formatPrice(selectedFlight.price)}</p>
                  </div>
                </div>
              </Card>
            )}
            {selectedHotel && (
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">Hotel</h3>
                    <p className="text-muted-foreground">{selectedHotel.name}</p>
                    <p className="text-sm text-muted-foreground mt-1">{selectedHotel.location}</p>
                    <p className="text-xl font-bold text-primary mt-2">
                      {formatPrice(selectedHotel.pricePerNight)} / night
                    </p>
                  </div>
                </div>
              </Card>
            )}
            {selectedTour && (
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Plane className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">Tour</h3>
                    <p className="text-muted-foreground">{selectedTour.title}</p>
                    <p className="text-sm text-muted-foreground mt-1">{selectedTour.destination} · {selectedTour.duration}</p>
                    <p className="text-xl font-bold text-primary mt-2">{formatPrice(selectedTour.price)}</p>
                  </div>
                </div>
              </Card>
            )}
            {selectedPackage && (
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">Package</h3>
                    <p className="text-muted-foreground">{selectedPackage.title}</p>
                    <p className="text-sm text-muted-foreground mt-1">{selectedPackage.duration}</p>
                    <p className="text-xl font-bold text-primary mt-2">{formatPrice(selectedPackage.price)}</p>
                  </div>
                </div>
              </Card>
            )}
            <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6 flex items-center gap-4">
              <CheckCircle className="h-10 w-10 text-primary flex-shrink-0" />
              <div>
                <h3 className="font-bold">Proceed to payment</h3>
                <p className="text-sm text-muted-foreground">This is a frontend demo. No payment will be processed.</p>
              </div>
              <Button className="ml-auto rounded-xl">Continue (Demo)</Button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
