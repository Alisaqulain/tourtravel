'use client';

import Link from 'next/link';
import { Gift, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CtaStrip() {
  return (
    <section className="py-6 bg-primary/15 border-y border-primary/20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <Gift className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Get ₹500 off your first booking</h3>
              <p className="text-sm text-muted-foreground">Sign up and use code WELCOME500 at checkout.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link href="/signup">
              <Button className="rounded-xl">Sign Up Free</Button>
            </Link>
            <Link href="/offers">
              <Button variant="outline" className="rounded-xl gap-1">
                <Smartphone className="h-4 w-4" /> View all offers
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
