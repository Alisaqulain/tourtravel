'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Star, Wifi, Coffee, Waves } from 'lucide-react';
import { SectionHeader } from '@/components/ui/section-header';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';
import { useDataStore } from '@/store';

const amenityIcons = { Pool: Waves, WiFi: Wifi, Restaurant: Coffee };

export function HotelListings() {
  const hotels = useDataStore((s) => s.hotels);
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="Top Hotels"
          subtitle="Stay at the world's most luxurious properties. Best price guarantee."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotels.map((hotel, i) => (
            <motion.div
              key={hotel.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <Link href="/hotels">
                <div className="group rounded-2xl border border-border bg-card overflow-hidden shadow-premium hover:shadow-card-hover transition-all duration-300">
                  <div className="relative h-52 overflow-hidden">
                    <Image
                      src={hotel.image}
                      alt={hotel.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, k) => (
                        <Star key={k} className="h-4 w-4 fill-primary text-primary" />
                      ))}
                      <span className="text-sm text-muted-foreground ml-1">({hotel.reviewCount.toLocaleString()})</span>
                    </div>
                    <h3 className="text-lg font-bold mb-1">{hotel.name}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mb-3">
                      <MapPin className="h-4 w-4" /> {hotel.location}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {hotel.amenities.slice(0, 4).map((a) => {
                        const Icon = amenityIcons[a] || Coffee;
                        return (
                          <span key={a} className="inline-flex items-center gap-1 rounded-lg bg-muted px-2 py-1 text-xs">
                            <Icon className="h-3 w-3" /> {a}
                          </span>
                        );
                      })}
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xl font-bold text-primary">{formatPrice(hotel.pricePerNight)}</span>
                        <span className="text-sm text-muted-foreground"> / night</span>
                      </div>
                      <Button size="sm" className="rounded-xl">Book Now</Button>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link href="/hotels">
            <Button variant="outline" size="lg" className="rounded-xl">
              View All Hotels
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
