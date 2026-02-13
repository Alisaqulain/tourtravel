'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function CancellationPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
        <ArrowLeft className="h-4 w-4" /> Back to Home
      </Link>
      <h1 className="text-3xl font-bold mb-2">Cancellation Policy</h1>
      <p className="text-muted-foreground mb-8">Last updated: February 2025</p>

      <Card className="p-8 prose prose-invert max-w-none">
        <h2 className="text-xl font-semibold mt-6 mb-2">Flights</h2>
        <p className="text-muted-foreground">
          Cancellation rules depend on the fare type and airline. Non-refundable fares may only receive tax refunds. Flexible fares may allow free cancellation up to 24–48 hours before departure. Check your booking confirmation for the exact policy.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Hotels</h2>
        <p className="text-muted-foreground">
          Free cancellation is available for most properties when you cancel before the property’s deadline (often 24–72 hours before check-in). Late cancellations or no-shows may incur a charge of one night or the full stay.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Tours & Packages</h2>
        <p className="text-muted-foreground">
          Tour and package cancellation terms vary by operator. Many allow free cancellation up to 7–14 days before the start date. Within that window, partial or no refund may apply.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">How to Cancel</h2>
        <p className="text-muted-foreground">
          Log in to your account, go to <Link href="/my-bookings" className="text-primary hover:underline">My Bookings</Link>, and select the booking you wish to cancel. Refunds, when applicable, will be processed to the original payment method within 7–14 business days.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Contact</h2>
        <p className="text-muted-foreground">
          For cancellation assistance, contact us via our <Link href="/contact" className="text-primary hover:underline">Contact</Link> page.
        </p>
      </Card>
    </div>
  );
}
