'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Bus, ArrowRight, Eye } from 'lucide-react';
import { SectionHeader } from '@/components/ui/section-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatPrice } from '@/lib/utils';
import { useDataStore } from '@/store';

export function ExploreBus() {
  const buses = useDataStore((s) => s.buses);
  const featured = buses.slice(0, 3);

  return (
    <section className="py-14 md:py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <SectionHeader
            title="Bus Travel"
            subtitle="Comfortable coach rides with WiFi & power outlets. Premium operators."
          />
          <Link href="/bus">
            <Button variant="outline" size="sm" className="rounded-xl gap-1">
              View all <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featured.map((bus, i) => (
            <motion.div
              key={bus.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="p-5 h-full flex flex-col border border-border/60 hover:shadow-card-hover transition-all">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <div className="h-9 w-9 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Bus className="h-4 w-4 text-primary" />
                    </div>
                    <span className="font-semibold text-sm">{bus.operator}</span>
                  </div>
                  {bus.savePercent > 0 && (
                    <span className="rounded-full bg-primary/20 text-primary text-xs font-bold px-2 py-0.5">Save {bus.savePercent}%</span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-2">{bus.from} → {bus.to}</p>
                <p className="text-xs text-muted-foreground mb-4">{bus.departure} · {bus.duration}</p>
                <div className="mt-auto flex items-center justify-between pt-3 border-t border-border">
                  <span className="text-xl font-bold text-primary">{formatPrice(bus.price)}</span>
                  <Link href={`/bus/${bus.id}`}>
                    <Button variant="ghost" size="sm" className="rounded-lg gap-1 text-primary">
                      <Eye className="h-3.5 w-3.5" /> View More
                    </Button>
                  </Link>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
