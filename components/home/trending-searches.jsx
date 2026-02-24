'use client';

import Link from 'next/link';
import { TrendingUp } from 'lucide-react';

const trending = [
  { label: 'Delhi → Mumbai', href: '/flights' },
  { label: 'Mumbai → Goa', href: '/flights' },
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
    <section className="py-4 border-b border-border bg-card/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5 shrink-0">
            <TrendingUp className="h-4 w-4 text-primary" />
            Trending searches
          </span>
          <div className="flex flex-wrap gap-2">
            {trending.map((t) => (
              <Link
                key={t.label}
                href={t.href}
                className="px-3 py-1.5 rounded-full text-sm bg-muted/80 hover:bg-muted border border-border hover:border-primary/40 text-foreground transition-colors"
              >
                {t.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
