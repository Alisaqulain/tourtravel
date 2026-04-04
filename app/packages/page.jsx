'use client';

import { useMemo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { SectionHeader } from '@/components/ui/section-header';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';
import { useTravelList } from '@/hooks/useTravelList';
import { toast } from '@/lib/toast';

const PKG_FALLBACK = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800';

export default function PackagesPage() {
  const { data: raw, loading, error, refetch } = useTravelList('packages', {
    limit: 100,
    sortBy: 'price',
    order: 'asc',
  });

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const packages = useMemo(() => {
    return (raw || []).map((p) => {
      const price = Number(p.price) || 0;
      const originalPrice = p.originalPrice != null ? Number(p.originalPrice) : price;
      const discount = p.discount != null ? Number(p.discount) : originalPrice > price
        ? Math.round(((originalPrice - price) / originalPrice) * 100)
        : 0;
      const highlights = Array.isArray(p.inclusions) ? p.inclusions : Array.isArray(p.highlights) ? p.highlights : [];
      return {
        id: p.id,
        title: p.name || p.title || 'Package',
        image: (p.images && p.images[0]) || p.image || PKG_FALLBACK,
        duration: p.duration || '',
        price,
        originalPrice: originalPrice || price,
        discount,
        highlights,
      };
    });
  }, [raw]);

  return (
    <div className="container mx-auto px-4 py-12">
      <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
        <ArrowLeft className="h-4 w-4" /> Back to Home
      </Link>
      <SectionHeader
        title="Travel Packages"
        subtitle="All-inclusive packages with flights, hotels, and activities. One price, zero hassle."
      />

      {error && (
        <div className="mb-4">
          <Button variant="outline" size="sm" onClick={() => refetch()}>Retry</Button>
        </div>
      )}

      {loading && (
        <div className="flex justify-center py-16">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      )}

      {!loading && (
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
                      unoptimized={String(pkg.image).startsWith('http')}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    {pkg.discount > 0 && (
                      <span className="absolute top-4 left-4 rounded-full bg-primary px-3 py-1 text-sm font-bold text-white">
                        Save {pkg.discount}%
                      </span>
                    )}
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="text-xl font-bold">{pkg.title}</h3>
                      <p className="text-white/90">{pkg.duration}</p>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-primary">{formatPrice(pkg.price)}</span>
                        {pkg.originalPrice > pkg.price && (
                          <span className="text-muted-foreground line-through">{formatPrice(pkg.originalPrice)}</span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {pkg.highlights.length ? pkg.highlights.join(' · ') : 'All-inclusive travel package'}
                      </p>
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
      )}

      {!loading && packages.length === 0 && (
        <p className="text-center text-muted-foreground py-12">No packages available yet.</p>
      )}
    </div>
  );
}
