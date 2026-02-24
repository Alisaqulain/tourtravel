'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Flame, ArrowRight, Plane, Building2, MapPin, Percent } from 'lucide-react';
import { SectionHeader } from '@/components/ui/section-header';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';
import { useDataStore } from '@/store';

export function HotDeals() {
  const flights = useDataStore((s) => s.flights);
  const packages = useDataStore((s) => s.packages);
  const hotFlights = flights.filter((f) => f.savePercent >= 20).slice(0, 4);
  const hotPackages = packages.slice(0, 4);

  return (
    <section className="py-10 md:py-14 bg-muted/30 border-y border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Flame className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">Hot Deals</h2>
              <p className="text-muted-foreground text-sm">Limited time. Book now and save big.</p>
            </div>
          </div>
          <Link href="/offers">
            <Button variant="outline" size="sm" className="rounded-xl gap-1">
              View all offers <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {hotFlights.map((f, i) => (
            <motion.div
              key={f.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
            >
              <Link href={`/flights/${f.id}`}>
                <div className="group h-full rounded-2xl border-2 border-primary/30 bg-card p-5 hover:shadow-card-hover hover:border-primary/50 transition-all">
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary text-white text-xs font-bold px-2.5 py-1 mb-3">
                    <Percent className="h-3 w-3" /> Save {f.savePercent}%
                  </span>
                  <div className="flex items-center gap-2 mb-2">
                    <Plane className="h-5 w-5 text-primary" />
                    <span className="font-semibold">{f.airline}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{f.from} → {f.to}</p>
                  <p className="text-2xl font-bold text-primary">{formatPrice(f.price)}</p>
                  <span className="text-xs text-muted-foreground mt-1 inline-block group-hover:underline">View deal →</span>
                </div>
              </Link>
            </motion.div>
          ))}
          {hotPackages.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i + 2) * 0.06 }}
            >
              <Link href="/packages">
                <div className="group relative h-full rounded-2xl overflow-hidden border-2 border-primary/30 bg-card hover:shadow-card-hover hover:border-primary/50 transition-all">
                  <div className="relative h-36">
                    <Image src={p.image} alt={p.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="25vw" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <span className="absolute top-3 left-3 rounded-full bg-primary text-white text-xs font-bold px-2.5 py-1">Save {p.discount}%</span>
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h3 className="font-bold text-sm">{p.title}</h3>
                      <p className="text-xs text-white/90">{p.duration}</p>
                      <p className="text-lg font-bold mt-1">{formatPrice(p.price)} <span className="text-sm font-normal line-through text-white/70">{formatPrice(p.originalPrice)}</span></p>
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
