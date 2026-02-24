'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Building2, Plane, MapPin, Bus, Train, Package } from 'lucide-react';
import { Card } from '@/components/ui/card';

const categories = [
  { href: '/hotels', label: 'Hotels', icon: Building2, desc: 'Stays & resorts' },
  { href: '/flights', label: 'Flights', icon: Plane, desc: 'Book flights' },
  { href: '/tours', label: 'Tours', icon: MapPin, desc: 'Guided experiences' },
  { href: '/bus', label: 'Bus', icon: Bus, desc: 'Coach & intercity' },
  { href: '/train', label: 'Train', icon: Train, desc: 'IRCTC & trains' },
  { href: '/packages', label: 'Packages', icon: Package, desc: 'Holiday packages' },
];

export function FeaturedCategories() {
  return (
    <section className="py-10 md:py-14 bg-muted/40 border-b border-border" aria-labelledby="featured-categories-heading">
      <div className="container mx-auto px-4">
        <h2 id="featured-categories-heading" className="text-2xl md:text-3xl font-bold mb-2 text-center">
          Explore by category
        </h2>
        <p className="text-muted-foreground text-center mb-8 max-w-xl mx-auto">
          Flights, hotels, tours, bus, train, and packages — find everything in one place.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.href}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
              >
                <Link href={cat.href} className="block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-2xl">
                  <Card className="p-5 h-full flex flex-col items-center text-center rounded-2xl border border-border shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-200 group">
                    <div className="h-12 w-12 rounded-xl bg-primary/15 flex items-center justify-center mb-3 group-hover:bg-primary/25 transition-colors">
                      <Icon className="h-6 w-6 text-primary" aria-hidden />
                    </div>
                    <span className="font-semibold text-sm">{cat.label}</span>
                    <span className="text-xs text-muted-foreground mt-0.5">{cat.desc}</span>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
