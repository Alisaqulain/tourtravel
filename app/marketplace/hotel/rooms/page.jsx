'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DoorOpen } from 'lucide-react';

export default function HotelRoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/marketplace/hotel/register', { credentials: 'include' }).then((r) => r.json()),
      fetch('/api/marketplace/hotel/rooms', { credentials: 'include' }).then((r) => r.json()),
    ]).then(([h, r]) => {
      setHotel(h?.data?.hotel);
      setRooms(r?.data?.rooms ?? []);
    }).finally(() => setLoading(false));
  }, []);

  if (!hotel) return <p className="text-muted-foreground">Register your hotel first.</p>;
  if (hotel.status !== 'approved') return <p className="text-muted-foreground">Your hotel must be approved to add rooms.</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Rooms</h1>
        <Link href="/marketplace/hotel/rooms/new"><Button>Add Room</Button></Link>
      </div>
      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : (
        <div className="grid gap-4">
          {rooms.map((r) => (
            <Card key={r._id} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <DoorOpen className="h-10 w-10 text-muted-foreground" />
                <div>
                  <p className="font-semibold">{r.title}</p>
                  <p className="text-sm text-muted-foreground">₹ {r.pricePerNight}/night · {r.availableRooms}/{r.totalRooms} available</p>
                </div>
              </div>
              <Link href={`/marketplace/hotel/rooms/${r._id}`}><Button variant="outline" size="sm">Edit</Button></Link>
            </Card>
          ))}
          {rooms.length === 0 && <p className="text-muted-foreground">No rooms yet. Add your first room.</p>}
        </div>
      )}
    </div>
  );
}
