'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, CalendarCheck, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId') || '';
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[50vh]">
        <div className="animate-pulse rounded-xl bg-muted h-64 w-full max-w-md" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center"
      >
        <div className="h-20 w-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Payment successful</h1>
        <p className="text-foreground/80 mb-2">Your payment has been verified and your booking is confirmed.</p>
        {bookingId && (
          <p className="text-sm text-foreground/70 mb-8">
            Booking ID: <strong className="text-foreground">{bookingId}</strong>
          </p>
        )}

        <Card className="p-6 text-left mb-8 rounded-xl">
          <h3 className="font-semibold mb-3">What&apos;s next?</h3>
          <ul className="space-y-2 text-sm text-foreground/80">
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              A confirmation email has been sent to your registered email.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              View and manage this booking under <strong>My Bookings</strong>.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              Need help? Visit our <Link href="/contact-us" className="text-primary hover:underline">Contact us</Link> page.
            </li>
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
