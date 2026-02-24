'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, CalendarCheck, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useBookingStore } from '@/store';

export default function BookingConfirmationPage() {
  const { selectedFlight, selectedHotel, selectedTour, selectedPackage, selectedBus, selectedTrain, selectedCruise, selectedCar } = useBookingStore();
  const hasBooking = selectedFlight || selectedHotel || selectedTour || selectedPackage || selectedBus || selectedTrain || selectedCruise || selectedCar;
  const bookingId = 'TT' + Date.now().toString(36).toUpperCase();

  if (!hasBooking) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="p-8 text-center max-w-md mx-auto">
          <p className="text-muted-foreground mb-6">No booking found. Start a new booking.</p>
          <Link href="/"><Button className="rounded-xl">Go to Home</Button></Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Booking confirmed</h1>
        <p className="text-muted-foreground mb-2">Thank you for your payment.</p>
        <p className="text-sm text-muted-foreground mb-8">Booking ID: <strong className="text-foreground">{bookingId}</strong></p>

        <Card className="p-6 text-left mb-8">
          <h3 className="font-semibold mb-4">What happens next?</h3>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <Mail className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <span>A confirmation email with your e-ticket/voucher has been sent to your registered email.</span>
            </li>
            <li className="flex items-start gap-2">
              <CalendarCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <span>View and manage this booking anytime under <Link href="/my-bookings" className="text-primary hover:underline">My Bookings</Link>.</span>
            </li>
            <li>Need help? Contact us on our <Link href="/contact" className="text-primary hover:underline">Contact</Link> page.</li>
          </ul>
        </Card>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/my-bookings">
            <Button variant="outline" className="rounded-xl w-full sm:w-auto gap-2">
              <CalendarCheck className="h-4 w-4" /> My Bookings
            </Button>
          </Link>
          <Link href="/">
            <Button className="rounded-xl w-full sm:w-auto gap-2">
              Back to Home <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
