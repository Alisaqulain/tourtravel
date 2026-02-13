'use client';

import Link from 'next/link';
import { ArrowLeft, Shield, Heart, Globe } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
        <ArrowLeft className="h-4 w-4" /> Back to Home
      </Link>
      <h1 className="text-3xl font-bold mb-2">About Trips To Travels</h1>
      <p className="text-muted-foreground mb-8">Creating unforgettable memories.</p>

      <Card className="p-8 prose prose-invert max-w-none">
        <p className="text-muted-foreground">
          Trips To Travels is your trusted travel partner for booking flights, hotels, tours, and packages. We bring together the best prices and a simple booking experience so you can focus on your journey.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 my-8">
          <div className="flex flex-col items-center text-center p-4 rounded-xl bg-muted/50">
            <Shield className="h-10 w-10 text-primary mb-2" />
            <h3 className="font-semibold">Secure Booking</h3>
            <p className="text-sm text-muted-foreground mt-1">Your data and payments are protected.</p>
          </div>
          <div className="flex flex-col items-center text-center p-4 rounded-xl bg-muted/50">
            <Heart className="h-10 w-10 text-primary mb-2" />
            <h3 className="font-semibold">Best Price</h3>
            <p className="text-sm text-muted-foreground mt-1">We guarantee competitive rates.</p>
          </div>
          <div className="flex flex-col items-center text-center p-4 rounded-xl bg-muted/50">
            <Globe className="h-10 w-10 text-primary mb-2" />
            <h3 className="font-semibold">24/7 Support</h3>
            <p className="text-sm text-muted-foreground mt-1">We’re here whenever you need us.</p>
          </div>
        </div>

        <p className="text-muted-foreground">
          For any questions, visit our <Link href="/contact" className="text-primary hover:underline">Contact</Link> page or read our <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link> and <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>.
        </p>
      </Card>
    </div>
  );
}
