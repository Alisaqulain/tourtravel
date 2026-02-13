'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { SectionHeader } from '@/components/ui/section-header';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';
import { packages } from '@/data/packages';

export default function PackagesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
        <ArrowLeft className="h-4 w-4" /> Back to Home
      </Link>
      <SectionHeader
        title="Travel Packages"
        subtitle="All-inclusive packages with flights, hotels, and activities. One price, zero hassle."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {packages.map((pkg, i) => (
          <motion.div
            key={pkg.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link href="/booking-summary">
              <div className="group rounded-2xl border border-border bg-card overflow-hidden shadow-premium hover:shadow-card-hover transition-all">
                <div className="relative h-64">
                  <Image
                    src={pkg.image}
                    alt={pkg.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <span className="absolute top-4 left-4 rounded-full bg-primary px-3 py-1 text-sm font-bold text-white">
                    Save {pkg.discount}%
                  </span>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="text-xl font-bold">{pkg.title}</h3>
                    <p className="text-white/90">{pkg.duration}</p>
                  </div>
                </div>
                <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-primary">{formatPrice(pkg.price)}</span>
                      <span className="text-muted-foreground line-through">{formatPrice(pkg.originalPrice)}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{pkg.highlights.join(' · ')}</p>
                  </div>
                  <Button className="gap-2 rounded-xl group/btn">
                    Book Now <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
