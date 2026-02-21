'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, BarChart3, TrendingUp, MousePointer, DollarSign } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const CHART_COLORS = ['#E50914', '#0ea5e9', '#22c55e', '#f59e0b', '#8b5cf6'];

export default function AdminAnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/analytics', { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => {
        if (d?.success && d?.data) setData(d.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div>
        <Link href="/admin" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 text-sm">
          <ArrowLeft className="h-4 w-4" /> Dashboard
        </Link>
        <h1 className="text-2xl font-bold mb-6">Analytics</h1>
        <div className="grid gap-4 sm:grid-cols-3 mb-8">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-80 rounded-xl" />
      </div>
    );
  }

  if (!data) {
    return (
      <div>
        <Link href="/admin" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 text-sm">
          <ArrowLeft className="h-4 w-4" /> Dashboard
        </Link>
        <p className="text-muted-foreground">Failed to load analytics.</p>
      </div>
    );
  }

  const { monthly, bookingTypes, affiliateClicks, summary } = data;
  const chartData = monthly.labels.map((label, i) => ({
    name: label,
    revenue: monthly.revenue[i],
    users: monthly.users[i],
    bookings: monthly.bookings[i],
  }));

  return (
    <div>
      <Link href="/admin" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 text-sm">
        <ArrowLeft className="h-4 w-4" /> Dashboard
      </Link>
      <h1 className="text-2xl font-bold mb-2">Analytics</h1>
      <p className="text-muted-foreground mb-8">Revenue, bookings, and affiliate performance.</p>

      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">₹{Number(summary.totalRevenue).toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Paid Bookings</p>
                <p className="text-2xl font-bold">{summary.totalBookings}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Affiliate Clicks</p>
                <p className="text-2xl font-bold">{summary.totalClicks}</p>
              </div>
              <MousePointer className="h-8 w-8 text-primary" />
            </div>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2 mb-8">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5" /> Monthly Revenue & Bookings
          </h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: '1px solid var(--border)' }}
                  formatter={(value) => [value?.toLocaleString(), '']}
                />
                <Bar dataKey="revenue" name="Revenue (₹)" fill={CHART_COLORS[0]} radius={[4, 4, 0, 0]} />
                <Bar dataKey="bookings" name="Bookings" fill={CHART_COLORS[1]} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Booking types</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={bookingTypes}
                  dataKey="count"
                  nameKey="type"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={(e) => `${e.type}: ${e.count}`}
                >
                  {bookingTypes.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {affiliateClicks.length > 0 && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Affiliate clicks by provider</h2>
          <div className="flex flex-wrap gap-4">
            {affiliateClicks.map((a, i) => (
              <div key={a.provider} className="flex items-center gap-2 rounded-xl bg-muted/50 px-4 py-2">
                <span className="font-medium capitalize">{a.provider}</span>
                <span className="text-primary font-bold">{a.count}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
