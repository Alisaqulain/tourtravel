'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { CalendarCheck, User, Mail, IndianRupee, ArrowLeft, Download, Filter } from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatPrice } from '@/lib/utils';
import { toast } from '@/lib/toast';

function formatDate(d) {
  if (!d) return '—';
  const date = typeof d === 'string' ? new Date(d) : d;
  return isNaN(date.getTime()) ? String(d) : date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

const STATUS_OPTIONS = ['', 'pending', 'paid', 'failed', 'cancelled'];
const TYPE_OPTIONS = ['', 'Flight', 'Hotel', 'Tour', 'Package', 'Bus', 'Cruise', 'Car', 'Visa'];

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set('status', statusFilter);
      if (typeFilter) params.set('type', typeFilter);
      if (dateFrom) params.set('dateFrom', dateFrom);
      if (dateTo) params.set('dateTo', dateTo);
      const res = await fetch(`/api/admin/bookings?${params}`, { credentials: 'include' });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.message || 'Failed to load bookings');
        return;
      }
      const list = json.data?.bookings ?? (Array.isArray(json.data) ? json.data : []);
      setBookings(list);
    } catch (e) {
      console.error('Admin bookings fetch:', e);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, typeFilter, dateFrom, dateTo]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const exportCsv = async () => {
    try {
      const params = new URLSearchParams({ export: 'csv' });
      if (statusFilter) params.set('status', statusFilter);
      if (typeFilter) params.set('type', typeFilter);
      if (dateFrom) params.set('dateFrom', dateFrom);
      if (dateTo) params.set('dateTo', dateTo);
      const res = await fetch(`/api/admin/bookings?${params}`, { credentials: 'include' });
      if (!res.ok) throw new Error('Export failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bookings-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('CSV downloaded');
    } catch (e) {
      toast.error('Failed to export CSV');
    }
  };

  const updateStatus = async (bookingId, status) => {
    if (!bookingId) return;
    setUpdatingId(bookingId);
    try {
      const res = await fetch('/api/admin/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ bookingId, status }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Status updated');
        fetchBookings();
      } else toast.error(data.message || 'Failed');
    } catch (e) {
      toast.error('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const description = (b) => {
    if (b.item && typeof b.item === 'object') {
      const parts = [];
      if (b.item.airline) parts.push(b.item.airline);
      if (b.item.name) parts.push(b.item.name);
      if (b.item.from && b.item.to) parts.push(`${b.item.from} → ${b.item.to}`);
      return parts.length ? parts.join(' · ') : b.bookingId || '—';
    }
    return b.bookingId || '—';
  };

  return (
    <div>
      <Link href="/admin" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 text-sm">
        <ArrowLeft className="h-4 w-4" /> Dashboard
      </Link>
      <h1 className="text-2xl font-bold mb-2">Bookings</h1>
      <p className="text-muted-foreground mb-4">Filter by status, type, date. Change status or export CSV.</p>

      <Card className="p-4 mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-1 text-sm font-medium"><Filter className="h-4 w-4" /> Filters</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s || 'all'} value={s}>{s || 'All status'}</option>
            ))}
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm"
          >
            {TYPE_OPTIONS.map((t) => (
              <option key={t || 'all'} value={t}>{t || 'All types'}</option>
            ))}
          </select>
          <Input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="w-40 rounded-lg"
          />
          <Input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="w-40 rounded-lg"
          />
          <Button type="button" variant="outline" size="sm" onClick={exportCsv} className="gap-2 rounded-xl">
            <Download className="h-4 w-4" /> Export CSV
          </Button>
        </div>
      </Card>

      {loading ? (
        <Card className="p-12 text-center text-muted-foreground">Loading bookings...</Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left p-4 font-semibold">Booking ID</th>
                  <th className="text-left p-4 font-semibold">Type</th>
                  <th className="text-left p-4 font-semibold">Source</th>
                  <th className="text-left p-4 font-semibold">Description</th>
                  <th className="text-left p-4 font-semibold">Customer</th>
                  <th className="text-left p-4 font-semibold">Subtotal / Tax / Total</th>
                  <th className="text-left p-4 font-semibold">Payment</th>
                  <th className="text-left p-4 font-semibold">Status</th>
                  <th className="text-left p-4 font-semibold">Date</th>
                  <th className="text-left p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b, i) => (
                  <motion.tr
                    key={b._id || b.bookingId || i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className="border-b border-border hover:bg-muted/30"
                  >
                    <td className="p-4 font-mono text-muted-foreground">{b.bookingId || '—'}</td>
                    <td className="p-4">
                      <span className="rounded-full bg-primary/10 text-primary px-2 py-1 text-xs font-medium">{b.type || '—'}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-xs text-muted-foreground">{b.source || 'manual'}</span>
                    </td>
                    <td className="p-4 max-w-xs truncate">{description(b)}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4 text-muted-foreground" />
                        {b.userName || '—'}
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground text-xs mt-0.5">
                        <Mail className="h-3 w-3" />
                        {b.userEmail || '—'}
                      </div>
                    </td>
                    <td className="p-4 text-sm">
                      <IndianRupee className="h-3 w-3 inline mr-0.5" />
                      {formatPrice(b.subtotal ?? 0)} / {formatPrice(b.tax ?? 0)} / <span className="font-semibold text-primary">{formatPrice(b.total ?? 0)}</span> {b.currency ?? 'INR'}
                    </td>
                    <td className="p-4 text-xs font-mono text-muted-foreground">{b.paymentId || '—'}</td>
                    <td className="p-4">
                      <span className={`rounded-full px-2 py-1 text-xs font-medium ${b.status === 'paid' ? 'bg-green-500/10 text-green-700 dark:text-green-400' : b.status === 'pending' ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400' : b.status === 'cancelled' ? 'bg-muted text-muted-foreground' : 'bg-destructive/10 text-destructive'}`}>
                        {b.status || '—'}
                      </span>
                    </td>
                    <td className="p-4 text-muted-foreground">{formatDate(b.createdAt)}</td>
                    <td className="p-4">
                      <select
                        value={b.status}
                        onChange={(e) => updateStatus(b.bookingId, e.target.value)}
                        disabled={updatingId === b.bookingId}
                        className="rounded-lg border border-border bg-background px-2 py-1 text-xs"
                      >
                        <option value="pending">pending</option>
                        <option value="paid">paid</option>
                        <option value="failed">failed</option>
                        <option value="cancelled">cancelled</option>
                      </select>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          {bookings.length === 0 && (
            <div className="p-12 text-center text-muted-foreground">No bookings yet. Bookings appear here when users make a booking.</div>
          )}
        </Card>
      )}
    </div>
  );
}
