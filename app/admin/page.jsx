'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Plane, Building2, MapPin, Package, ArrowRight, Users, CalendarCheck, Bus, Ship, Car, Palette, BarChart3 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { AdminLocationMap } from '@/components/admin/location-map';
import { toast } from '@/lib/toast';

const contentCards = [
  { href: '/admin/flights', label: 'Flights', icon: Plane, key: 'flights' },
  { href: '/admin/hotels', label: 'Hotels', icon: Building2, key: 'hotels' },
  { href: '/admin/tours', label: 'Tours', icon: MapPin, key: 'tours' },
  { href: '/admin/packages', label: 'Packages', icon: Package, key: 'packages' },
];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [counts, setCounts] = useState({ flights: 0, hotels: 0, tours: 0, packages: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, flightsRes, hotelsRes, toursRes, packagesRes] = await Promise.all([
          fetch('/api/admin/stats', { credentials: 'include' }),
          fetch('/api/admin/flights', { credentials: 'include' }),
          fetch('/api/admin/hotels', { credentials: 'include' }),
          fetch('/api/admin/tours', { credentials: 'include' }),
          fetch('/api/admin/packages', { credentials: 'include' }),
        ]);

        const statsJson = await statsRes.json();
        if (statsJson.success && statsJson.data) {
          setStats(statsJson.data);
        }

        const parseList = (res) => {
          return res.json().then((j) => (j.success && Array.isArray(j.data) ? j.data.length : 0));
        };
        const [flights, hotels, tours, packages] = await Promise.all([
          parseList(flightsRes),
          parseList(hotelsRes),
          parseList(toursRes),
          parseList(packagesRes),
        ]);
        setCounts({ flights, hotels, tours, packages });
      } catch (e) {
        console.error('Admin dashboard fetch:', e);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalUsers = stats?.totalUsers ?? 0;
  const totalBookings = stats?.totalBookings ?? 0;
  const paidBookings = stats?.paidBookings ?? 0;
  const pendingPayments = stats?.pendingBookings ?? 0;
  const failedBookings = stats?.failedBookings ?? 0;
  const businessModel = stats?.businessModel ?? 'hybrid';
  const manualListingsCount = stats?.manualListingsCount ?? 0;
  const apiRequestsCount = stats?.apiRequestsCount ?? 0;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-2">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <span
          className="rounded-full px-3 py-1 text-xs font-medium bg-primary/20 text-primary capitalize"
          title="Change in Settings → Business Model"
        >
          {businessModel}
        </span>
      </div>
      <p className="text-muted-foreground mb-8">Overview of users, bookings, revenue, and content. Business model: API / Manual / Hybrid.</p>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="p-6 animate-pulse h-28" />
          ))}
        </div>
      ) : (
        <>
          {/* Key metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Link href="/admin/users">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
                <Card className="p-6 hover:shadow-card-hover transition-shadow h-full">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Users</p>
                      <p className="text-2xl font-bold">{totalUsers}</p>
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <p className="text-sm text-primary font-medium mt-4 flex items-center gap-1">
                    View all <ArrowRight className="h-4 w-4" />
                  </p>
                </Card>
              </motion.div>
            </Link>
            <Link href="/admin/bookings">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
                <Card className="p-6 hover:shadow-card-hover transition-shadow h-full">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Bookings</p>
                      <p className="text-2xl font-bold">{totalBookings}</p>
                      <p className="text-xs text-muted-foreground mt-1">{paidBookings} paid · {pendingPayments} pending · {failedBookings} failed</p>
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center">
                      <CalendarCheck className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <p className="text-sm text-primary font-medium mt-4 flex items-center gap-1">
                    View all <ArrowRight className="h-4 w-4" />
                  </p>
                </Card>
              </motion.div>
            </Link>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="p-6 h-full">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                    <p className="text-2xl font-bold text-primary">₹ {Number(stats?.revenue ?? 0).toLocaleString('en-IN')}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">From paid bookings</p>
              </Card>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <Card className="p-6 h-full">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pending Payments</p>
                    <p className="text-2xl font-bold">{pendingPayments}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Unpaid bookings</p>
              </Card>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="p-6">
                <p className="text-sm text-muted-foreground">Manual Listings Count</p>
                <p className="text-2xl font-bold">{manualListingsCount}</p>
                <p className="text-xs text-muted-foreground mt-1">Flights, hotels, tours, packages in DB</p>
              </Card>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
              <Card className="p-6">
                <p className="text-sm text-muted-foreground">API Requests Count</p>
                <p className="text-2xl font-bold">{apiRequestsCount}</p>
                <p className="text-xs text-muted-foreground mt-1">External API calls (when implemented)</p>
              </Card>
            </motion.div>
          </div>

          <div className="mb-8">
            <AdminLocationMap />
          </div>

          {/* Content counts */}
          <h2 className="text-lg font-semibold mb-4">Content (listings in database)</h2>
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

          {/* Revenue if we have stats */}
          {stats != null && (
            <Card className="p-6 mb-8">
              <h2 className="text-lg font-semibold mb-2">Revenue</h2>
              <p className="text-2xl font-bold text-primary">₹ {Number(stats.revenue ?? 0).toLocaleString('en-IN')}</p>
              <p className="text-sm text-muted-foreground">From paid bookings</p>
            </Card>
          )}
        </>
      )}

      {/* Bus, Cruise, Cars - info only (no DB listing admin yet) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Bus routes</p>
              <p className="text-2xl font-bold">—</p>
              <p className="text-xs text-muted-foreground">From travel API</p>
            </div>
            <Bus className="h-8 w-8 text-muted-foreground" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Cruises</p>
              <p className="text-2xl font-bold">—</p>
              <p className="text-xs text-muted-foreground">From travel API</p>
            </div>
            <Ship className="h-8 w-8 text-muted-foreground" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Premium Cars</p>
              <p className="text-2xl font-bold">—</p>
              <p className="text-xs text-muted-foreground">From travel API</p>
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
