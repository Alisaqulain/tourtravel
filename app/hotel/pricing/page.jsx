'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign } from 'lucide-react';

export default function HotelPricingPage() {
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

  if (!hotel) return <p className="text-muted-foreground">Loading...</p>;
  if (hotel.status !== 'approved') {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Pricing</h1>
        <p className="text-muted-foreground">Pricing is available after your hotel is approved. You can set price per night when adding or editing rooms.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Pricing</h1>
      <Card className="p-6">
        <p className="text-muted-foreground mb-4">Set price per night, seasonal pricing, and special offers by editing each room.</p>
        <div className="space-y-3">
          {rooms.map((r) => (
            <div key={r._id} className="flex items-center justify-between py-2 border-b last:border-0">
              <span className="font-medium">{r.title}</span>
              <div className="flex items-center gap-2">
                <span>₹ {r.pricePerNight}/night</span>
                <Link href={`/hotel/rooms/${r._id}/edit`}><Button variant="outline" size="sm">Edit price</Button></Link>
              </div>
            </div>
          ))}
        </div>
        {rooms.length === 0 && <p className="text-muted-foreground">Add rooms from the Rooms page to set pricing.</p>}
      </Card>
    </div>
  );
}
