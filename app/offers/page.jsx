'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Percent, Plane, Building2, MapPin } from 'lucide-react';
import { SectionHeader } from '@/components/ui/section-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const offers = [
  { id: 1, title: 'Flash Sale: Up to 40% off Flights', desc: 'Book by weekend. Travel anytime.', icon: Plane, discount: '40%', type: 'Flights' },
  { id: 2, title: 'Hotel Weekend Getaway', desc: '2 nights at 3-star hotels from $99.', icon: Building2, discount: '30%', type: 'Hotels' },
  { id: 3, title: 'Europe Tour Special', desc: '10-day tour with flights included.', icon: MapPin, discount: '25%', type: 'Tours' },
  { id: 4, title: 'Maldives Package Deal', desc: '5 nights overwater villa + flights.', icon: Building2, discount: '20%', type: 'Packages' },
];

export default function OffersPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
        <ArrowLeft className="h-4 w-4" /> Back to Home
      </Link>
      <SectionHeader
        title="Offers & Deals"
        subtitle="Limited-time offers. Grab them before they're gone."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {offers.map((offer, i) => (
          <motion.div
            key={offer.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card className="p-6 flex flex-col sm:flex-row items-start gap-6 hover:shadow-card-hover transition-shadow">
              <div className="h-16 w-16 rounded-2xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                {(() => { const Icon = offer.icon; return <Icon className="h-8 w-8 text-primary" />; })()}
              </div>
              <div className="flex-1">
                <span className="inline-block rounded-full bg-primary/20 text-primary text-xs font-bold px-3 py-1 mb-2">
                  {offer.type}
                </span>
                <h3 className="text-lg font-bold mb-1">{offer.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">{offer.desc}</p>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-2xl font-bold text-primary">
                    <Percent className="h-6 w-6" /> {offer.discount}
                  </span>
                  <Link href="/flights">
                    <Button size="sm" variant="outline" className="rounded-xl">View Offer</Button>
                  </Link>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
