'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Plane, Building2, MapPin, Package, ArrowRight } from 'lucide-react';
import { useDataStore } from '@/store';
import { Card } from '@/components/ui/card';

const cards = [
  { href: '/admin/flights', label: 'Flights', icon: Plane, key: 'flights' },
  { href: '/admin/hotels', label: 'Hotels', icon: Building2, key: 'hotels' },
  { href: '/admin/tours', label: 'Tours', icon: MapPin, key: 'tours' },
  { href: '/admin/packages', label: 'Packages', icon: Package, key: 'packages' },
];

export default function AdminDashboardPage() {
  const flights = useDataStore((s) => s.flights);
  const hotels = useDataStore((s) => s.hotels);
  const tours = useDataStore((s) => s.tours);
  const packages = useDataStore((s) => s.packages);

  const counts = { flights: flights.length, hotels: hotels.length, tours: tours.length, packages: packages.length };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
      <p className="text-muted-foreground mb-8">Manage your travel content.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((c, i) => (
          <motion.div
            key={c.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link href={c.href}>
              <Card className="p-6 hover:shadow-card-hover transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{c.label}</p>
                    <p className="text-2xl font-bold">{counts[c.key]}</p>
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center">
                    <c.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <p className="text-sm text-primary font-medium mt-4 flex items-center gap-1">
                  Manage <ArrowRight className="h-4 w-4" />
                </p>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Quick actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/flights/new">
            <span className="inline-flex items-center gap-2 rounded-xl bg-primary text-white px-4 py-2 text-sm font-medium hover:bg-primary/90">
              Add Flight
            </span>
          </Link>
          <Link href="/admin/hotels/new">
            <span className="inline-flex items-center gap-2 rounded-xl bg-primary text-white px-4 py-2 text-sm font-medium hover:bg-primary/90">
              Add Hotel
            </span>
          </Link>
          <Link href="/admin/tours/new">
            <span className="inline-flex items-center gap-2 rounded-xl bg-primary text-white px-4 py-2 text-sm font-medium hover:bg-primary/90">
              Add Tour
            </span>
          </Link>
          <Link href="/admin/packages/new">
            <span className="inline-flex items-center gap-2 rounded-xl bg-primary text-white px-4 py-2 text-sm font-medium hover:bg-primary/90">
              Add Package
            </span>
          </Link>
        </div>
      </Card>
    </div>
  );
}
