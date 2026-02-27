'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import { Percent, Plane, Building2 } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useDataStore } from '@/store';

export function DealsStrip() {
  const scrollRef = useRef(null);
  const flights = useDataStore((s) => s.flights);
  const hotels = useDataStore((s) => s.hotels);
  const packages = useDataStore((s) => s.packages);

  const flightDeals = flights.slice(0, 2).map((f) => ({ type: 'Flight', id: f.id, icon: Plane, href: `/flights/${f.id}`, title: f.airline, sub: `${f.from} → ${f.to}`, price: f.price, original: f.originalPrice }));
  const hotelDeals = hotels.slice(0, 2).map((h) => ({ type: 'Hotel', id: h.id, icon: Building2, href: '/hotels', title: h.name, sub: h.location, price: h.pricePerNight, original: h.originalPrice }));
  const packageDeals = packages.slice(0, 2).map((p) => ({ type: 'Package', id: p.id, icon: Percent, href: '/packages', title: p.title, sub: p.duration, price: p.price, original: p.originalPrice }));
  const deals = [...flightDeals, ...hotelDeals, ...packageDeals];

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || deals.length === 0) return;
    const step = 224;
    const interval = setInterval(() => {
      const max = el.scrollWidth - el.clientWidth;
      if (max <= 0) return;
      el.scrollLeft += step;
      if (el.scrollLeft >= max - 10) el.scrollLeft = 0;
    }, 3000);
    return () => clearInterval(interval);
  }, [deals.length]);

  return (
    <section className="py-8 border-b border-[#EDE5DC]" style={{ backgroundColor: '#FFF8F0' }}>
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        <h3 className="text-lg sm:text-xl font-bold mb-5 flex items-center justify-center gap-2 text-center">
          <Percent className="h-6 w-6 shrink-0" style={{ color: 'var(--primary)' }} aria-hidden />
          <span className="text-foreground">Deals of the day</span>
        </h3>
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin snap-x snap-mandatory scroll-smooth"
          style={{ scrollBehavior: 'smooth' }}
        >
          {deals.map((d) => {
            const Icon = d.icon;
            return (
              <Link
                key={`${d.type}-${d.id}`}
                href={d.href}
                className="shrink-0 w-[200px] md:w-[220px] snap-start rounded-xl border border-[#EDE5DC] bg-white overflow-hidden hover:shadow-xl hover:border-primary/40 transition-all"
              >
                <div className="p-4 flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg flex items-center justify-center shrink-0 bg-primary/20">
                    <Icon className="h-5 w-5" style={{ color: 'var(--primary)' }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-muted-foreground">{d.type}</p>
                    <p className="font-semibold text-sm truncate">{d.title}</p>
                    {d.sub && <p className="text-xs text-muted-foreground truncate">{d.sub}</p>}
                    <p className="font-bold text-sm mt-0.5" style={{ color: 'var(--primary)' }}>
                      {formatPrice(d.price)}
                      {d.original && <span className="text-muted-foreground line-through text-xs ml-1">{formatPrice(d.original)}</span>}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
