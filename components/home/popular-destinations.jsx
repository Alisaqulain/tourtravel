'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Star } from 'lucide-react';
import { SectionHeader } from '@/components/ui/section-header';
import { Card } from '@/components/ui/card';
import { formatPrice } from '@/lib/utils';
import { destinations } from '@/data/destinations';

export function PopularDestinations() {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="Popular Destinations"
          subtitle="Discover the world's most loved places. Book your next adventure with confidence."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((dest, i) => (
            <motion.div
              key={dest.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <Link href="/packages">
                <Card className="group overflow-hidden border-0 shadow-premium hover:shadow-card-hover transition-all duration-300 h-full">
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={dest.image}
                      alt={dest.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-card" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <div className="flex items-center gap-1 mb-1">
                        <Star className="h-4 w-4 fill-primary text-primary" />
                        <span className="text-sm font-medium">{dest.rating}</span>
                        <span className="text-white/80 text-sm">({dest.reviewCount.toLocaleString()} reviews)</span>
                      </div>
                      <h3 className="text-xl font-bold flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        {dest.name}, {dest.country}
                      </h3>
                      <p className="text-primary-200 font-semibold mt-2">
                        From {formatPrice(dest.startingPrice)} per person
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
