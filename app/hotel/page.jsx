'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { CalendarCheck, TrendingUp, Wallet, DoorOpen, Star, Calendar } from 'lucide-react';

export default function HotelDashboardPage() {
  const [hotel, setHotel] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/marketplace/hotel/register', { credentials: 'include' }).then((r) => r.json()),
      fetch('/api/marketplace/hotel/wallet', { credentials: 'include' }).then((r) => r.json()),
      fetch('/api/marketplace/hotel/bookings', { credentials: 'include' }).then((r) => r.json()),
      fetch('/api/marketplace/hotel/rooms', { credentials: 'include' }).then((r) => r.json()),
    ])
      .then(([h, w, b, r]) => {
        const hotelData = h?.data?.hotel;
        setHotel(hotelData);
        const wallet = w?.data?.wallet;
        const bookings = b?.data?.bookings ?? [];
        const rooms = r?.data?.rooms ?? [];
        const now = new Date();
        const thisMonth = now.getMonth();
        const thisYear = now.getFullYear();
        const monthlyBookings = bookings.filter((x) => {
          const d = new Date(x.checkIn || x.createdAt);
          return d.getMonth() === thisMonth && d.getFullYear() === thisYear && x.paymentStatus === 'paid';
        });
        const monthlyRevenue = monthlyBookings.reduce((sum, x) => sum + (x.hotelEarning ?? 0), 0);
        const upcoming = bookings.filter((x) => new Date(x.checkIn) >= now && x.bookingStatus !== 'cancelled').slice(0, 5);
        setStats({
          totalBookings: bookings.length,
          monthlyRevenue,
          totalEarnings: wallet?.totalEarnings ?? 0,
          availableBalance: wallet?.availableBalance ?? 0,
          upcomingBookings: upcoming.length,
          upcomingList: upcoming,
          roomsCount: rooms.length,
          rating: hotelData?.rating ?? hotelData?.starRating ?? 0,
        });
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading || !hotel) {
    return <p className="text-muted-foreground">Loading...</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
      <p className="text-muted-foreground mb-6">{hotel.name}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="p-6">
          <CalendarCheck className="h-8 w-8 text-primary mb-2" />
          <p className="text-sm text-muted-foreground">Total Bookings</p>
          <p className="text-2xl font-bold">{stats?.totalBookings ?? 0}</p>
        </Card>
        <Card className="p-6">
          <TrendingUp className="h-8 w-8 text-primary mb-2" />
          <p className="text-sm text-muted-foreground">Monthly Revenue</p>
          <p className="text-2xl font-bold">₹ {(stats?.monthlyRevenue ?? 0).toLocaleString()}</p>
        </Card>
        <Card className="p-6">
          <Wallet className="h-8 w-8 text-primary mb-2" />
          <p className="text-sm text-muted-foreground">Total Earnings</p>
          <p className="text-2xl font-bold">₹ {(stats?.totalEarnings ?? 0).toLocaleString()}</p>
        </Card>
        <Card className="p-6">
          <Star className="h-8 w-8 text-primary mb-2" />
          <p className="text-sm text-muted-foreground">Hotel Rating</p>
          <p className="text-2xl font-bold">{stats?.rating ? `${Number(stats.rating).toFixed(1)} ★` : '—'}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="p-6">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5" /> Upcoming Bookings
          </h2>
          {stats?.upcomingList?.length > 0 ? (
            <ul className="space-y-2">
              {stats.upcomingList.map((b) => (
                <li key={b._id} className="flex justify-between text-sm">
                  <span>{b.guest?.name ?? b.userId?.name ?? 'Guest'}</span>
                  <span className="text-muted-foreground">
                    {b.checkIn ? new Date(b.checkIn).toLocaleDateString() : ''} – {b.checkOut ? new Date(b.checkOut).toLocaleDateString() : ''}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground text-sm">No upcoming bookings.</p>
          )}
        </Card>
        <Card className="p-6">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <DoorOpen className="h-5 w-5" /> Rooms
          </h2>
          <p className="text-2xl font-bold">{stats?.roomsCount ?? 0}</p>
          <p className="text-sm text-muted-foreground">Total room types listed</p>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="font-semibold mb-4">Monthly booking overview</h2>
        <p className="text-sm text-muted-foreground">
          This month: {stats?.totalBookings ?? 0} total bookings · ₹ {(stats?.monthlyRevenue ?? 0).toLocaleString()} revenue.
        </p>
      </Card>
    </div>
  );
}
