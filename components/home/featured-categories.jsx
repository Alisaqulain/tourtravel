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
    <section className="py-10 md:py-14 border-b border-[#EDE5DC]" style={{ backgroundColor: '#FFF8F0' }} aria-labelledby="featured-categories-heading">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        <h2 id="featured-categories-heading" className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-center text-foreground">
          Explore by category
        </h2>
        <p className="text-muted-foreground text-center mb-10 max-w-2xl mx-auto text-base">
          Flights, hotels, tours, bus, train, and packages — find everything in one place.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
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
                  <Card className="p-6 sm:p-8 h-full flex flex-col items-center text-center rounded-2xl border border-border shadow-sm hover:shadow-xl hover:border-primary/40 hover:-translate-y-1 transition-all duration-200 group">
                    <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl flex items-center justify-center mb-4 transition-colors bg-primary/20">
                      <Icon className="h-7 w-7 sm:h-8 sm:w-8 text-primary" aria-hidden />
                    </div>
                    <span className="font-bold text-base">{cat.label}</span>
                    <span className="text-sm text-muted-foreground mt-1">{cat.desc}</span>
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
