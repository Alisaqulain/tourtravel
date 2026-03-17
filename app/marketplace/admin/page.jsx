'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Building2, Calendar, Wallet, Percent } from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/marketplace/admin/hotels', { credentials: 'include' }).then((r) => r.json()),
      fetch('/api/marketplace/admin/bookings', { credentials: 'include' }).then((r) => r.json()),
      fetch('/api/marketplace/admin/payouts', { credentials: 'include' }).then((r) => r.json()),
      fetch('/api/marketplace/admin/commission', { credentials: 'include' }).then((r) => r.json()),
    ]).then(([hotels, bookings, payouts, commission]) => {
      const pendingHotels = hotels?.data?.hotels?.filter((h) => h.status === 'pending_verification')?.length ?? 0;
      const totalBookings = bookings?.data?.bookings?.length ?? 0;
      const pendingPayouts = payouts?.data?.payouts?.filter((p) => p.status === 'pending').length ?? 0;
      setStats({
        pendingHotels,
        totalBookings,
        pendingPayouts,
        commissionPercent: commission?.data?.commissionPercent ?? 15,
      });
    });
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/marketplace/admin/hotels?status=pending_verification">
          <Card className="p-6 hover:shadow-md transition-shadow">
            <Building2 className="h-8 w-8 text-primary mb-2" />
            <p className="text-sm text-muted-foreground">Pending Hotels</p>
            <p className="text-2xl font-bold">{stats?.pendingHotels ?? '—'}</p>
          </Card>
        </Link>
        <Link href="/marketplace/admin/bookings">
          <Card className="p-6 hover:shadow-md transition-shadow">
            <Calendar className="h-8 w-8 text-primary mb-2" />
            <p className="text-sm text-muted-foreground">Total Bookings</p>
            <p className="text-2xl font-bold">{stats?.totalBookings ?? '—'}</p>
          </Card>
        </Link>
        <Link href="/marketplace/admin/payouts">
          <Card className="p-6 hover:shadow-md transition-shadow">
            <Wallet className="h-8 w-8 text-primary mb-2" />
            <p className="text-sm text-muted-foreground">Pending Payouts</p>
            <p className="text-2xl font-bold">{stats?.pendingPayouts ?? '—'}</p>
          </Card>
        </Link>
        <Link href="/marketplace/admin/commission">
          <Card className="p-6 hover:shadow-md transition-shadow">
            <Percent className="h-8 w-8 text-primary mb-2" />
            <p className="text-sm text-muted-foreground">Commission</p>
            <p className="text-2xl font-bold">{stats?.commissionPercent ?? '—'}%</p>
          </Card>
        </Link>
      </div>
    </div>
  );
}
