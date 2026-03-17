'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Users, Check, ArrowRight, Sparkles } from 'lucide-react';
import { SectionHeader } from '@/components/ui/section-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatPrice } from '@/lib/utils';

const CATEGORIES = [
  { id: 'standard', label: 'Standard Package', color: 'bg-slate-100 text-slate-800' },
  { id: 'premium', label: 'Premium Package', color: 'bg-amber-100 text-amber-800' },
  { id: 'luxury', label: 'Luxury Package', color: 'bg-amber-500/20 text-amber-900' },
];

export default function CharDhamYatraPage() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetch('/api/chardham/packages')
      .then((r) => r.json())
      .then((d) => setPackages(d?.data?.packages ?? []))
      .finally(() => setLoading(false));
  }, []);

  const pickOnePerCategory = () => {
    const order = ['standard', 'premium', 'luxury'];
    const out = [];
    for (const cat of order) {
      const first = packages.find((p) => p.category === cat);
      if (first) out.push(first);
    }
    return out;
  };

  // By default show 3 packages (one per category). If user selects a filter, show all in that category.
  const filtered = filter
    ? packages.filter((p) => p.category === filter)
    : pickOnePerCategory();

  return (
    <main className="min-h-screen bg-background">
      <section className="relative py-12 md:py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-50/80 to-background" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full bg-amber-100 text-amber-800 px-4 py-1.5 text-sm font-medium mb-4"
            >
              <Sparkles className="h-4 w-4" /> Pilgrimage Packages
            </motion.div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Char Dham Yatra
            </h1>
            <p className="text-muted-foreground">
              Sacred journey to Yamunotri, Gangotri, Kedarnath & Badrinath. Choose your package and book with best prices guaranteed.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-10">
            <button
              type="button"
              onClick={() => setFilter('')}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${!filter ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}
            >
              All
            </button>
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setFilter(c.id)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${filter === c.id ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-12 text-muted-foreground">Loading packages...</div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((pkg, i) => (
                <motion.div
                  key={pkg.id ?? pkg._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="overflow-hidden h-full flex flex-col hover:shadow-lg transition-shadow">
                    <div className="relative h-48 bg-muted">
                      {pkg.images?.[0] ? (
                        <img
                          src={pkg.images[0]}
                          alt={pkg.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <MapPin className="h-12 w-12" />
                        </div>
                      )}
                      <span className={`absolute top-3 left-3 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${CATEGORIES.find((c) => c.id === pkg.category)?.color || 'bg-muted'}`}>
                        {pkg.category}
                      </span>
                      {pkg.isRecommended && (
                        <span className="absolute top-3 right-3 rounded-full bg-amber-500 text-white px-2.5 py-1 text-xs font-semibold">
                          Recommended
                        </span>
                      )}
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <h2 className="text-xl font-bold text-foreground mb-2">{pkg.name}</h2>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" /> {pkg.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" /> {pkg.seatsAvailable} seats left
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-primary mb-4">{formatPrice(pkg.price)}</p>
                      {pkg.highlights?.length > 0 && (
                        <ul className="space-y-1 text-sm text-muted-foreground mb-4 flex-1">
                          {pkg.highlights.slice(0, 3).map((h, j) => (
                            <li key={j} className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-green-600 shrink-0" /> {h}
                            </li>
                          ))}
                        </ul>
                      )}
                      {pkg.seatsAvailable <= 5 && pkg.seatsAvailable > 0 && (
                        <p className="text-sm text-amber-600 font-medium mb-3">Only {pkg.seatsAvailable} seats left</p>
                      )}
                      {pkg.seatsAvailable === 0 && (
                        <p className="text-sm text-destructive font-medium mb-3">Sold out</p>
                      )}
                      <div className="flex gap-2 mt-auto">
                        <Link href={`/chardham-yatra/${pkg.id ?? pkg._id}`} className="flex-1">
                          <Button variant="outline" className="w-full" size="sm">View Details</Button>
                        </Link>
                        <Link href={pkg.seatsAvailable > 0 ? `/chardham-yatra/${pkg.id ?? pkg._id}` : '#'} className="flex-1">
                          <Button className="w-full gap-1" size="sm" disabled={pkg.seatsAvailable === 0}>
                            Book Now <ArrowRight className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
          {!loading && filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">No packages found.</div>
          )}
        </div>
      </section>
    </main>
  );
}
