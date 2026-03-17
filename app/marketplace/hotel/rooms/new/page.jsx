'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function NewRoomPage() {
  const router = useRouter();
  const [hotelId, setHotelId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    pricePerNight: '',
    capacity: '',
    totalRooms: '',
  });

  useEffect(() => {
    fetch('/api/marketplace/hotel/register', { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => {
        const h = d?.data?.hotel;
        if (h?.id) setHotelId(h.id);
        else if (h?._id) setHotelId(h._id);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!hotelId) return;
    setLoading(true);
    try {
      const res = await fetch('/api/marketplace/rooms/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          hotelId,
          title: form.title,
          description: form.description,
          pricePerNight: Number(form.pricePerNight),
          capacity: Number(form.capacity),
          totalRooms: Number(form.totalRooms),
        }),
      });
      const data = await res.json();
      if (data?.success) router.push('/marketplace/hotel/rooms');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Add Room</h1>
      <Card className="p-6 max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required placeholder="e.g. Deluxe Double" className="mt-1" />
          </div>
          <div>
            <Label>Description</Label>
            <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="w-full border rounded-lg px-3 py-2 mt-1 min-h-[60px]" />
          </div>
          <div>
            <Label>Price per night (₹)</Label>
            <Input type="number" min={1} value={form.pricePerNight} onChange={(e) => setForm((f) => ({ ...f, pricePerNight: e.target.value }))} required className="mt-1" />
          </div>
          <div>
            <Label>Capacity (guests)</Label>
            <Input type="number" min={1} value={form.capacity} onChange={(e) => setForm((f) => ({ ...f, capacity: e.target.value }))} required className="mt-1" />
          </div>
          <div>
            <Label>Total rooms</Label>
            <Input type="number" min={1} value={form.totalRooms} onChange={(e) => setForm((f) => ({ ...f, totalRooms: e.target.value }))} required className="mt-1" />
          </div>
          <Button type="submit" disabled={loading || !hotelId}>{loading ? 'Creating...' : 'Create Room'}</Button>
        </form>
      </Card>
    </div>
  );
}
