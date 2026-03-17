'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, CalendarDays, Eye, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { formatPrice } from '@/lib/utils';
import { toast } from '@/lib/toast';

function formatDate(d) {
  if (!d) return '—';
  const date = typeof d === 'string' ? new Date(d) : d;
  return isNaN(date.getTime()) ? String(d) : date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function AdminCharDhamBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewId, setViewId] = useState(null);
  const [viewBooking, setViewBooking] = useState(null);
  const [updating, setUpdating] = useState(false);

  const fetchBookings = async () => {
    try {
      const res = await fetch('/api/admin/chardham/bookings', { credentials: 'include' });
      const json = await res.json();
      if (json.success && Array.isArray(json.data?.bookings)) setBookings(json.data.bookings);
      else setBookings([]);
    } catch (e) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    if (!viewId) {
      setViewBooking(null);
      return;
    }
    fetch(`/api/admin/chardham/bookings/${viewId}`, { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => setViewBooking(d?.data ?? null))
      .catch(() => setViewBooking(null));
  }, [viewId]);

  const updateStatus = async (id, bookingStatus) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/chardham/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ bookingStatus }),
      });
      const data = await res.json();
      if (data?.success) {
        toast.success('Status updated');
        setViewId(null);
        fetchBookings();
      } else toast.error(data?.message || 'Failed');
    } catch (e) {
      toast.error('Failed to update');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div>
      <Link href="/admin" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 text-sm">
        <ArrowLeft className="h-4 w-4" /> Dashboard
      </Link>
      <div className="flex items-center gap-2 mb-6">
        <CalendarDays className="h-6 w-6" />
        <h1 className="text-2xl font-bold">CharDham Bookings</h1>
      </div>
      {loading ? (
        <Card className="p-12 text-center text-muted-foreground">Loading...</Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-medium">User</th>
                  <th className="text-left p-4 font-medium">Package</th>
                  <th className="text-left p-4 font-medium">Seats</th>
                  <th className="text-left p-4 font-medium">Total</th>
                  <th className="text-left p-4 font-medium">Payment</th>
                  <th className="text-left p-4 font-medium">Travel Date</th>
                  <th className="text-right p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id ?? b._id} className="border-b border-border last:border-0 hover:bg-muted/30">
                    <td className="p-4">
                      <p className="font-medium">{b.fullName}</p>
                      <p className="text-xs text-muted-foreground">{b.email}</p>
                      <p className="text-xs text-muted-foreground">{b.phone}</p>
                    </td>
                    <td className="p-4">{b.packageName || b.packageId?.name || '—'}</td>
                    <td className="p-4">{b.seats}</td>
                    <td className="p-4">{formatPrice(b.totalAmount)}</td>
                    <td className="p-4">
                      <span className={`capitalize px-2 py-0.5 rounded-full text-xs font-medium ${
                        b.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                        b.paymentStatus === 'pending' ? 'bg-amber-100 text-amber-800' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {b.paymentStatus}
                      </span>
                    </td>
                    <td className="p-4">{formatDate(b.travelDate)}</td>
                    <td className="p-4 text-right">
                      <Button variant="ghost" size="icon" className="rounded-lg" onClick={() => setViewId(b.id ?? b._id)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {bookings.length === 0 && (
            <div className="p-12 text-center text-muted-foreground">No CharDham bookings yet.</div>
          )}
        </Card>
      )}

      <Dialog open={!!viewId} onOpenChange={(open) => !open && setViewId(null)}>
        <DialogContent className="max-w-md" aria-describedby="chardham-booking-view-desc">
          <DialogHeader>
            <DialogTitle>Booking details</DialogTitle>
            <DialogDescription id="chardham-booking-view-desc">View and manage this Char Dham booking.</DialogDescription>
          </DialogHeader>
          {viewBooking && (
            <div className="space-y-3 text-sm">
              <p><span className="text-muted-foreground">Name:</span> {viewBooking.fullName}</p>
              <p><span className="text-muted-foreground">Email:</span> {viewBooking.email}</p>
              <p><span className="text-muted-foreground">Phone:</span> {viewBooking.phone}</p>
              <p><span className="text-muted-foreground">Package:</span> {viewBooking.packageId?.name || '—'}</p>
              <p><span className="text-muted-foreground">Seats:</span> {viewBooking.seats}</p>
              <p><span className="text-muted-foreground">Travel date:</span> {formatDate(viewBooking.travelDate)}</p>
              <p><span className="text-muted-foreground">Total:</span> {formatPrice(viewBooking.totalAmount)}</p>
              <p><span className="text-muted-foreground">Payment:</span> {viewBooking.paymentStatus}</p>
              <p><span className="text-muted-foreground">Status:</span> {viewBooking.bookingStatus}</p>
              {viewBooking.specialRequest && <p><span className="text-muted-foreground">Request:</span> {viewBooking.specialRequest}</p>}
              <div className="flex gap-2 pt-4">
                {viewBooking.bookingStatus !== 'cancelled' && (
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={updating}
                    onClick={() => updateStatus(viewId, 'cancelled')}
                  >
                    {updating ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />} Cancel booking
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
