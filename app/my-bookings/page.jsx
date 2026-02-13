'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Plane, Building2, MapPin, Package, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatPrice } from '@/lib/utils';
import { useAuthStore, useBookingStore } from '@/store';

const mockPastBookings = [
  { id: 'B001', type: 'Flight', from: 'New York', to: 'London', date: '2025-01-15', status: 'Completed', amount: 449 },
  { id: 'B002', type: 'Hotel', name: 'Grand Marina Resort', location: 'Maldives', date: '2025-02-01', nights: 3, status: 'Completed', amount: 960 },
];

export default function MyBookingsPage() {
  const router = useRouter();
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const { selectedFlight, selectedHotel, selectedTour, selectedPackage } = useBookingStore();

  useEffect(() => {
    if (!isLoggedIn) router.replace('/login');
  }, [isLoggedIn, router]);

  if (!isLoggedIn) return null;

  const hasCurrent = selectedFlight || selectedHotel || selectedTour || selectedPackage;

  return (
    <div className="container mx-auto px-4 py-12">
      <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
        <ArrowLeft className="h-4 w-4" /> Back to Home
      </Link>
      <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
      <p className="text-muted-foreground mb-8">View and manage your current and past bookings.</p>

      {hasCurrent && (
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Current Selection</h2>
          <div className="space-y-4">
            {selectedFlight && (
              <Card className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                    <Plane className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Flight: {selectedFlight.from} → {selectedFlight.to}</p>
                    <p className="text-sm text-muted-foreground">{selectedFlight.airline} · {selectedFlight.date}</p>
                    <p className="text-primary font-bold mt-1">{formatPrice(selectedFlight.price)}</p>
                  </div>
                </div>
                <Link href="/booking-summary"><Button className="rounded-xl">Complete Booking</Button></Link>
              </Card>
            )}
            {selectedHotel && (
              <Card className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{selectedHotel.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedHotel.location}</p>
                    <p className="text-primary font-bold mt-1">{formatPrice(selectedHotel.pricePerNight)} / night</p>
                  </div>
                </div>
                <Link href="/booking-summary"><Button className="rounded-xl">Complete Booking</Button></Link>
              </Card>
            )}
            {selectedTour && (
              <Card className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{selectedTour.title}</p>
                    <p className="text-sm text-muted-foreground">{selectedTour.destination} · {selectedTour.duration}</p>
                    <p className="text-primary font-bold mt-1">{formatPrice(selectedTour.price)}</p>
                  </div>
                </div>
                <Link href="/booking-summary"><Button className="rounded-xl">Complete Booking</Button></Link>
              </Card>
            )}
            {selectedPackage && (
              <Card className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                    <Package className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{selectedPackage.title}</p>
                    <p className="text-sm text-muted-foreground">{selectedPackage.duration}</p>
                    <p className="text-primary font-bold mt-1">{formatPrice(selectedPackage.price)}</p>
                  </div>
                </div>
                <Link href="/booking-summary"><Button className="rounded-xl">Complete Booking</Button></Link>
              </Card>
            )}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-xl font-semibold mb-4">Past Bookings</h2>
        <div className="space-y-4">
          {mockPastBookings.map((b) => (
            <motion.div key={b.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold">{b.type}{b.name ? `: ${b.name}` : ''} {b.from && b.to ? `(${b.from} → ${b.to})` : ''}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <Calendar className="h-4 w-4" /> {b.date} {b.nights && `· ${b.nights} nights`}
                    </p>
                    <p className="text-primary font-bold mt-1">{formatPrice(b.amount)}</p>
                  </div>
                  <span className="rounded-full bg-muted px-3 py-1 text-sm font-medium">{b.status}</span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
