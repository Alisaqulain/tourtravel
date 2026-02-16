'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, Plane, Building2, Bus, Ship, Car } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatPrice } from '@/lib/utils';
import { useBookingStore } from '@/store';

export default function BookingSummaryPage() {
  const { selectedFlight, selectedHotel, selectedTour, selectedPackage, selectedBus, selectedCruise, selectedCar } = useBookingStore();

  const hasBooking = selectedFlight || selectedHotel || selectedTour || selectedPackage || selectedBus || selectedCruise || selectedCar;

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
            {selectedBus && (
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Bus className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">Bus</h3>
                    <p className="text-muted-foreground">{selectedBus.operator}</p>
                    <p className="text-sm text-muted-foreground mt-1">{selectedBus.from} → {selectedBus.to} · {selectedBus.duration}</p>
                    <p className="text-xl font-bold text-primary mt-2">{formatPrice(selectedBus.price)}</p>
                  </div>
                </div>
              </Card>
            )}
            {selectedCruise && (
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Ship className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">Cruise</h3>
                    <p className="text-muted-foreground">{selectedCruise.name}</p>
                    <p className="text-sm text-muted-foreground mt-1">{selectedCruise.ship} · {selectedCruise.duration}</p>
                    <p className="text-xl font-bold text-primary mt-2">{formatPrice(selectedCruise.price)}</p>
                  </div>
                </div>
              </Card>
            )}
            {selectedCar && (
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Car className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">Premium Car</h3>
                    <p className="text-muted-foreground">{selectedCar.name}</p>
                    <p className="text-sm text-muted-foreground mt-1">{selectedCar.location} · {selectedCar.category}</p>
                    <p className="text-xl font-bold text-primary mt-2">{formatPrice(selectedCar.pricePerDay)} / day</p>
                  </div>
                </div>
              </Card>
            )}
            <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <CheckCircle className="h-10 w-10 text-primary flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-bold">Proceed to payment</h3>
                <p className="text-sm text-muted-foreground">Pay securely in INR via Card, UPI, or Net Banking.</p>
              </div>
              <Link href="/payment" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto rounded-xl">Proceed to Payment</Button>
              </Link>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
