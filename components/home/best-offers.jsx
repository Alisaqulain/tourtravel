'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Percent, Plane, Building2, MapPin, Ship, Car, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const offers = [
  { id: 1, title: 'Flash Sale: Up to 40% off Flights', desc: 'Book by weekend. Travel anytime.', icon: Plane, discount: '40%', type: 'Flights', href: '/flights' },
  { id: 2, title: 'Hotel Weekend Getaway', desc: '2 nights at 3-star hotels from $99.', icon: Building2, discount: '30%', type: 'Hotels', href: '/hotels' },
  { id: 3, title: 'Europe Tour Special', desc: '10-day tour with flights included.', icon: MapPin, discount: '25%', type: 'Tours', href: '/tours' },
  { id: 4, title: 'Maldives Package Deal', desc: '5 nights overwater villa + flights.', icon: Building2, discount: '20%', type: 'Packages', href: '/packages' },
  { id: 5, title: 'Bus & Cruise Combos', desc: 'Save on bus + cruise bundles.', icon: Ship, discount: '15%', type: 'Cruise', href: '/cruise' },
  { id: 6, title: 'Premium Car Weekend', desc: 'Luxury rentals at weekend rates.', icon: Car, discount: '20%', type: 'Cars', href: '/cars' },
];

export function BestOffers() {
  return (
    <section className="py-16 md:py-24 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Best Offers</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">Limited-time deals across flights, hotels, tours, packages, cruise & cars. Grab them before they&apos;re gone.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map((offer, i) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={offer.href}>
                <Card className="p-6 h-full flex flex-col sm:flex-row items-start gap-5 hover:shadow-card-hover transition-all border border-border/60 group">
                  <div className="h-14 w-14 rounded-2xl bg-primary/15 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/25 transition-colors">
                    {(() => { const Icon = offer.icon; return <Icon className="h-7 w-7 text-primary" />; })()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="inline-block rounded-full bg-primary/15 text-primary text-xs font-semibold px-2.5 py-1 mb-2">
                      {offer.type}
                    </span>
                    <h3 className="text-lg font-bold mb-1 group-hover:text-primary transition-colors">{offer.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{offer.desc}</p>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-xl font-bold text-primary">
                        <Percent className="h-5 w-5" /> {offer.discount}
                      </span>
                      <span className="text-sm text-muted-foreground inline-flex items-center gap-1 group-hover:underline">
                        View offer <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link href="/offers">
            <Button variant="outline" size="lg" className="rounded-xl gap-2">
              View all offers <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
