'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
        <ArrowLeft className="h-4 w-4" /> Back to Home
      </Link>
      <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
      <p className="text-muted-foreground mb-8">Last updated: February 2025</p>

      <Card className="p-8 prose prose-invert max-w-none">
        <h2 className="text-xl font-semibold mt-6 mb-2">1. Acceptance of Terms</h2>
        <p className="text-muted-foreground">
          By using Trips To Travels, you agree to these Terms of Service. If you do not agree, please do not use our platform.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">2. Use of Service</h2>
        <p className="text-muted-foreground">
          You may use our website to search and book flights, hotels, tours, and packages. You must provide accurate information and be at least 18 years old to make bookings.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">3. Bookings and Payments</h2>
        <p className="text-muted-foreground">
          All bookings are subject to availability. Prices are displayed in the currency shown and may change until payment is confirmed. Refunds and cancellations are governed by our <Link href="/cancellation" className="text-primary hover:underline">Cancellation Policy</Link>.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">4. User Responsibilities</h2>
        <p className="text-muted-foreground">
          You are responsible for maintaining the confidentiality of your account and for all activity under your account. You must not use the service for any unlawful purpose.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">5. Limitation of Liability</h2>
        <p className="text-muted-foreground">
          Trips To Travels acts as an intermediary between you and travel providers. We are not liable for the acts or omissions of airlines, hotels, or other third parties.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">6. Changes</h2>
        <p className="text-muted-foreground">
          We may update these terms from time to time. Continued use of the service after changes constitutes acceptance of the new terms.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">7. Contact</h2>
        <p className="text-muted-foreground">
          For questions, visit our <Link href="/contact" className="text-primary hover:underline">Contact</Link> page.
        </p>
      </Card>
    </div>
  );
}
