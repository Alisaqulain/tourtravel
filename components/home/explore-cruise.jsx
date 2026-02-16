'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Ship, ArrowRight, Star, Eye } from 'lucide-react';
import { SectionHeader } from '@/components/ui/section-header';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';
import { useDataStore } from '@/store';

export function ExploreCruise() {
  const cruises = useDataStore((s) => s.cruises);
  const featured = cruises.slice(0, 3);

  return (
    <section className="py-14 md:py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <SectionHeader
            title="Cruise Vacations"
            subtitle="Sail in style. World-class ships and unforgettable routes."
          />
          <Link href="/cruise">
            <Button variant="outline" size="sm" className="rounded-xl gap-1">
              View all <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featured.map((cruise, i) => (
            <motion.div
              key={cruise.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={`/cruise/${cruise.id}`}>
                <div className="group rounded-2xl border border-border bg-card overflow-hidden hover:shadow-card-hover transition-all h-full flex flex-col">
                  <div className="relative h-44">
                    <Image
                      src={cruise.image}
                      alt={cruise.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <span className="absolute top-3 left-3 rounded-full bg-primary text-white text-xs font-bold px-2.5 py-1">Save {cruise.savePercent}%</span>
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h3 className="font-bold text-sm">{cruise.name}</h3>
                      <p className="text-xs text-white/90 flex items-center gap-1"><Ship className="h-3 w-3" /> {cruise.duration}</p>
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex items-center gap-1 text-sm mb-2">
                      <Star className="h-4 w-4 fill-primary text-primary" />
                      <span>{cruise.rating}</span>
                      <span className="text-muted-foreground">({cruise.reviewCount})</span>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-3 border-t border-border">
                      <span className="text-lg font-bold text-primary">{formatPrice(cruise.price)}</span>
                      <span className="text-sm text-primary inline-flex items-center gap-1 group-hover:underline">View More <Eye className="h-3.5 w-3.5" /></span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
