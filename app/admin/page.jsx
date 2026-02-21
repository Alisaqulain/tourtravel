'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Plane, Building2, MapPin, Package, ArrowRight, Users, CalendarCheck, Bus, Ship, Car, Palette, BarChart3 } from 'lucide-react';
import { useDataStore, useUsersStore, useBookingStore } from '@/store';
import { Card } from '@/components/ui/card';

const contentCards = [
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
  const buses = useDataStore((s) => s.buses);
  const cruises = useDataStore((s) => s.cruises);
  const cars = useDataStore((s) => s.cars);
  const users = useUsersStore((s) => s.users);
  const completedBookings = useBookingStore((s) => s.completedBookings);

  const counts = {
    flights: flights.length,
    hotels: hotels.length,
    tours: tours.length,
    packages: packages.length,
    buses: buses?.length ?? 0,
    cruises: cruises?.length ?? 0,
    cars: cars?.length ?? 0,
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
      <p className="text-muted-foreground mb-8">Overview of users, bookings, and all content.</p>

      {/* Users & Bookings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <Link href="/admin/users">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
            <Card className="p-6 hover:shadow-card-hover transition-shadow h-full">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Users</p>
                  <p className="text-2xl font-bold">{users.length}</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
              </div>
              <p className="text-sm text-primary font-medium mt-4 flex items-center gap-1">
                View all users <ArrowRight className="h-4 w-4" />
              </p>
            </Card>
          </motion.div>
        </Link>
        <Link href="/admin/bookings">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <Card className="p-6 hover:shadow-card-hover transition-shadow h-full">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Bookings</p>
                  <p className="text-2xl font-bold">{completedBookings?.length ?? 0}</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <CalendarCheck className="h-6 w-6 text-primary" />
                </div>
              </div>
              <p className="text-sm text-primary font-medium mt-4 flex items-center gap-1">
                View all bookings <ArrowRight className="h-4 w-4" />
              </p>
            </Card>
          </motion.div>
        </Link>
      </div>

      {/* Content counts */}
      <h2 className="text-lg font-semibold mb-4">Content</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {contentCards.map((c, i) => (
          <motion.div
            key={c.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
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

      {/* Bus, Cruise, Cars - data only (no admin CRUD pages yet) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Bus routes</p>
              <p className="text-2xl font-bold">{counts.buses}</p>
            </div>
            <Bus className="h-8 w-8 text-muted-foreground" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Cruises</p>
              <p className="text-2xl font-bold">{counts.cruises}</p>
            </div>
            <Ship className="h-8 w-8 text-muted-foreground" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Premium Cars</p>
              <p className="text-2xl font-bold">{counts.cars}</p>
            </div>
            <Car className="h-8 w-8 text-muted-foreground" />
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Quick actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/analytics">
            <span className="inline-flex items-center gap-2 rounded-xl bg-muted text-foreground px-4 py-2 text-sm font-medium hover:bg-muted/80">
              <BarChart3 className="h-4 w-4" /> Analytics
            </span>
          </Link>
          <Link href="/admin/theme">
            <span className="inline-flex items-center gap-2 rounded-xl bg-muted text-foreground px-4 py-2 text-sm font-medium hover:bg-muted/80">
              <Palette className="h-4 w-4" /> Change website theme
            </span>
          </Link>
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
