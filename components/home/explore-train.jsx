'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Train, ArrowRight, Eye } from 'lucide-react';
import { SectionHeader } from '@/components/ui/section-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatPrice } from '@/lib/utils';
import { useDataStore } from '@/store';

export function ExploreTrain() {
  const trains = useDataStore((s) => s.trains);
  const featured = trains.slice(0, 3);

  return (
    <section className="py-10 md:py-14 bg-card/30 border-y border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <SectionHeader
            title="Train Booking"
            subtitle="Book IRCTC and other trains. Check availability and redirect to official booking."
          />
          <Link href="/train">
            <Button variant="outline" size="sm" className="rounded-xl gap-1">
              View all <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featured.map((train, i) => (
            <motion.div
              key={train.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="overflow-hidden p-0 h-full flex flex-col border border-border rounded-2xl hover:shadow-lg transition-all">
                {train.image && (
                  <div className="relative h-36 w-full">
                    <Image src={train.image} alt={train.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute top-2 left-2 flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-white/90 flex items-center justify-center">
                        <Train className="h-4 w-4 text-primary" />
                      </div>
                      <span className="font-semibold text-white text-sm drop-shadow">{train.name}</span>
                    </div>
                    {train.savePercent > 0 && (
                      <span className="absolute top-2 right-2 rounded-full bg-primary text-white text-xs font-bold px-2 py-0.5">
                        Save {train.savePercent}%
                      </span>
                    )}
                  </div>
                )}
                <div className="p-5 flex-1 flex flex-col">
                  {!train.image && (
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <div className="h-9 w-9 rounded-lg bg-primary/20 flex items-center justify-center">
                          <Train className="h-4 w-4 text-primary" />
                        </div>
                        <span className="font-semibold text-sm">{train.name}</span>
                      </div>
                      {train.savePercent > 0 && (
                        <span className="rounded-full bg-primary/20 text-primary text-xs font-bold px-2 py-0.5">Save {train.savePercent}%</span>
                      )}
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground mb-1">{train.from} → {train.to}</p>
                  <p className="text-xs text-muted-foreground mb-4">{train.departure} · {train.duration} · {train.class}</p>
                  <div className="mt-auto flex items-center justify-between pt-3 border-t border-border">
                    <span className="text-xl font-bold text-primary">{formatPrice(train.price)}</span>
                    <Link href={`/train/${train.id}`}>
                      <Button variant="ghost" size="sm" className="rounded-lg gap-1 text-primary">
                        <Eye className="h-3.5 w-3.5" /> View More
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
