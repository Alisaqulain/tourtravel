'use client';

import Link from 'next/link';
import { TrendingUp } from 'lucide-react';

const OTA_YELLOW = '#EAB308';
const OTA_CREAM = '#F5EDE4';

const trending = [
  { label: 'Delhi - Mumbai', href: '/flights' },
  { label: 'Mumbai - Goa', href: '/flights' },
  { label: 'Bangalore → Delhi', href: '/flights' },
  { label: 'Goa Hotels', href: '/hotels' },
  { label: 'Dubai Packages', href: '/packages' },
  { label: 'Kerala Tours', href: '/tours' },
  { label: 'Delhi → Jaipur Train', href: '/train' },
  { label: 'Mumbai → Pune Bus', href: '/bus' },
  { label: 'International Flights', href: '/flights' },
  { label: 'Weekend Getaways', href: '/packages' },
];

export function TrendingSearches() {
  return (
    <section className="py-6 border-b border-[#EDE5DC] max-w-6xl mx-auto px-4 sm:px-6">
      <h3 className="text-base sm:text-lg font-bold mb-4 flex items-center gap-2">
        <TrendingUp className="h-5 w-5 shrink-0" style={{ color: OTA_YELLOW }} aria-hidden />
        <span className="text-foreground">Trending searches</span>
      </h3>
      <div className="flex flex-wrap gap-2 sm:gap-3">
        {trending.map((t) => (
          <Link
            key={t.label}
            href={t.href}
            className="px-4 py-2.5 rounded-full text-sm font-semibold transition-all hover:opacity-90"
            style={{ backgroundColor: OTA_CREAM, color: OTA_YELLOW }}
          >
            {t.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
