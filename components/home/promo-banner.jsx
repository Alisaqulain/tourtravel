'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Tag, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

const promos = [
  { text: 'FLAT 15% OFF on Flights', code: 'FLY15', href: '/flights' },
  { text: 'Up to 25% OFF on Hotels', code: 'STAY25', href: '/hotels' },
  { text: 'Train tickets from ₹399', code: 'TRAIN', href: '/train' },
  { text: 'Bus & Cab deals', code: 'BUS20', href: '/bus' },
];

export function PromoBanner() {
  const [dismissed, setDismissed] = useState(false);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (dismissed) return;
    const t = setInterval(() => setCurrent((i) => (i + 1) % promos.length), 4000);
    return () => clearInterval(t);
  }, [dismissed]);

  if (dismissed) return null;

  const promo = promos[current];

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="container mx-auto px-4 -mt-2 relative z-10"
      aria-label="Offers"
    >
      <div className="rounded-2xl bg-primary text-primary-foreground shadow-lg overflow-hidden border border-primary/20">
        <div className="flex items-center justify-between gap-4 px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="hidden sm:flex h-10 w-10 rounded-xl bg-white/15 items-center justify-center shrink-0">
              <Tag className="h-5 w-5" aria-hidden />
            </div>
            <Link
              href={promo.href}
              className="text-sm sm:text-base font-medium truncate hover:underline flex-1 py-1"
            >
              <span>{promo.text}</span>
              <span className="ml-2 opacity-90">· Use code {promo.code}</span>
            </Link>
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => setCurrent((i) => (i - 1 + promos.length) % promos.length)}
                className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
                aria-label="Previous offer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="flex gap-1">
                {promos.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setCurrent(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? 'w-4 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/60'}`}
                    aria-label={`Offer ${i + 1}`}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => setCurrent((i) => (i + 1) % promos.length)}
                className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
                aria-label="Next offer"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="p-2 rounded-lg hover:bg-white/20 transition-colors shrink-0"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.section>
  );
}
