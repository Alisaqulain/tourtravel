'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building2, DoorOpen } from 'lucide-react';

export default function HotelDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingRoom, setBookingRoom] = useState(null);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      fetch(`/api/marketplace/hotels/${id}`).then((r) => r.json()),
      fetch(`/api/marketplace/hotels/${id}/rooms`).then((r) => r.json()),
    ]).then(([h, r]) => {
      setHotel(h?.data?.hotel);
      setRooms(r?.data?.rooms ?? []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  const handleBook = async (room) => {
    setBookingRoom(room);
  };

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    if (!bookingRoom || !checkIn || !checkOut) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/marketplace/bookings/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ roomId: bookingRoom._id, checkIn, checkOut, guests }),
      });
      const data = await res.json();
      if (data?.success) {
        router.push(`/marketplace/booking/${data.data.booking.id}`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="p-8 text-muted-foreground">Loading...</p>;
  if (!hotel) return <p className="p-8 text-muted-foreground">Hotel not found.</p>;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <Card className="p-6 mb-6">
        <div className="flex items-start gap-4">
          <Building2 className="h-14 w-14 text-muted-foreground shrink-0" />
          <div>
            <h1 className="text-2xl font-bold">{hotel.name}</h1>
            <p className="text-muted-foreground">{hotel.city} · {hotel.address}</p>
            {hotel.description && <p className="mt-2 text-sm">{hotel.description}</p>}
          </div>
        </div>
      </Card>

      <h2 className="text-lg font-semibold mb-4">Rooms</h2>
      <div className="space-y-4 mb-8">
        {rooms.map((r) => (
          <Card key={r._id} className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <DoorOpen className="h-10 w-10 text-muted-foreground" />
              <div>
                <p className="font-semibold">{r.title}</p>
                <p className="text-sm text-muted-foreground">{r.description}</p>
                <p className="text-primary font-medium">₹ {r.pricePerNight}/night · {r.availableRooms} available</p>
              </div>
            </div>
            <Button onClick={() => handleBook(r)} disabled={r.availableRooms < 1}>Book</Button>
          </Card>
        ))}
      </div>

      {bookingRoom && (
        <Card className="p-6 max-w-md">
          <h3 className="font-semibold mb-4">Book {bookingRoom.title}</h3>
          <form onSubmit={handleConfirmBooking} className="space-y-4">
            <div>
              <Label>Check-in</Label>
              <Input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} required className="mt-1" />
            </div>
            <div>
              <Label>Check-out</Label>
              <Input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} required className="mt-1" />
            </div>
            <div>
              <Label>Guests</Label>
              <Input type="number" min={1} max={bookingRoom.capacity} value={guests} onChange={(e) => setGuests(Number(e.target.value))} className="mt-1" />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={submitting}>{submitting ? 'Creating...' : 'Confirm & Pay'}</Button>
              <Button type="button" variant="outline" onClick={() => setBookingRoom(null)}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
}
