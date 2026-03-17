'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';

export default function HotelBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/marketplace/hotel/bookings', { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => setBookings(d?.data?.bookings ?? []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Bookings</h1>
      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : (
        <Card className="overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="text-left p-4 font-semibold">Guest Name</th>
                <th className="text-left p-4 font-semibold">Room</th>
                <th className="text-left p-4 font-semibold">Check-in</th>
                <th className="text-left p-4 font-semibold">Check-out</th>
                <th className="text-left p-4 font-semibold">Total Price</th>
                <th className="text-left p-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id} className="border-b last:border-0">
                  <td className="p-4">{b.guest?.name ?? b.userId?.name ?? '—'} ({b.guest?.email ?? b.userId?.email ?? '—'})</td>
                  <td className="p-4">{b.room?.title ?? b.roomId?.title ?? '—'}</td>
                  <td className="p-4">{b.checkIn ? new Date(b.checkIn).toLocaleDateString() : '—'}</td>
                  <td className="p-4">{b.checkOut ? new Date(b.checkOut).toLocaleDateString() : '—'}</td>
                  <td className="p-4">₹ {Number(b.totalAmount ?? 0).toLocaleString()}</td>
                  <td className="p-4">
                    <span className={`rounded-full px-2 py-1 text-xs ${b.paymentStatus === 'paid' ? 'bg-green-100' : 'bg-amber-100'}`}>
                      {b.paymentStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {bookings.length === 0 && <div className="p-8 text-center text-muted-foreground">No bookings yet.</div>}
        </Card>
      )}
    </div>
  );
}
