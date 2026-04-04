'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mountain, ArrowRight } from 'lucide-react';
import { SectionHeader } from '@/components/ui/section-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatPrice } from '@/lib/utils';

export function CharDhamOfferSection() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/chardham/packages')
      .then((r) => r.json())
      .then((d) => setPackages(d?.data?.packages ?? []))
      .finally(() => setLoading(false));
  }, []);

  const byCategory = (cat) => packages.filter((p) => p.category === cat);
  const standard = byCategory('standard')[0];
  const premium = byCategory('premium')[0];
  const luxury = byCategory('luxury')[0];
  const featured = [standard, premium, luxury].filter(Boolean);

  if (loading || featured.length === 0) return null;

  return (
    <section className="py-10 md:py-14 bg-muted/30 border-y border-border" aria-labelledby="chardham-heading">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        <SectionHeader
          id="chardham-heading"
          title="Char Dham Yatra – Most Recommended Packages"
          subtitle="Sacred pilgrimage to Yamunotri, Gangotri, Kedarnath & Badrinath. Choose your package."
        />
        <div className="grid gap-6 sm:grid-cols-3">
          {featured.map((pkg, i) => (
            <motion.div
              key={pkg.id ?? pkg._id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Card className="overflow-hidden h-full flex flex-col hover:shadow-lg transition-shadow group">
                <div className="relative h-40 bg-muted">
                  {pkg.images?.[0] ? (
                    <img
                      src={pkg.images[0]}
                      alt={pkg.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <Mountain className="h-12 w-12" />
                    </div>
                  )}
                  <span className="absolute top-3 left-3 rounded-full bg-primary/90 text-primary-foreground px-2.5 py-1 text-xs font-semibold capitalize">
                    {pkg.category}
                  </span>
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-bold text-foreground mb-1">{pkg.name}</h3>
                  <p className={`text-2xl font-bold text-primary ${pkg.offerText?.trim() ? 'mb-1' : 'mb-2'}`}>{formatPrice(pkg.price)}</p>
                  {pkg.offerText?.trim() && (
                    <p className="text-xs font-medium text-amber-700 dark:text-amber-500 mb-2 line-clamp-2">{pkg.offerText.trim()}</p>
                  )}
                  <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
                    {pkg.shortDescription || `${pkg.duration} · Seats available: ${pkg.seatsAvailable}`}
                  </p>
                  <Link href={`/chardham-yatra/${pkg.id ?? pkg._id}`} className="mt-4">
                    <Button variant="outline" size="sm" className="w-full gap-2 rounded-xl group/btn">
                      View More <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-0.5 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link href="/chardham-yatra">
            <Button className="rounded-xl gap-2">View All Char Dham Packages</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
