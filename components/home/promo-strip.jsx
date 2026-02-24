'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Tag, X } from 'lucide-react';
import { useState } from 'react';

const promos = [
  { text: 'FLAT 15% OFF on Flights', code: 'FLY15', href: '/flights' },
  { text: 'Up to 25% OFF on Hotels', code: 'STAY25', href: '/hotels' },
  { text: 'Train tickets from ₹399', code: 'TRAIN', href: '/train' },
  { text: 'Bus & Cab deals', code: 'BUS20', href: '/bus' },
];

export function PromoStrip() {
  const [dismissed, setDismissed] = useState(false);
  const [current, setCurrent] = useState(0);

  if (dismissed) return null;

  const promo = promos[current];

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-primary text-primary-foreground border-b border-primary/80"
    >
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between gap-4 min-h-[40px]">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Tag className="h-4 w-4 shrink-0" aria-hidden />
            <Link
              href={promo.href}
              className="text-sm font-medium truncate hover:underline flex-1"
            >
              <span>{promo.text}</span>
              <span className="ml-2 opacity-90">· Use code {promo.code}</span>
            </Link>
            <div className="flex gap-1 shrink-0">
              {promos.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrent(i)}
                  className={`w-2 h-2 rounded-full transition-colors ${i === current ? 'bg-white' : 'bg-white/40'}`}
                  aria-label={`Promo ${i + 1}`}
                />
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="p-1 rounded hover:bg-white/20 transition-colors"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
