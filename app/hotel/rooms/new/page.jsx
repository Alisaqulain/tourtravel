'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/lib/toast';

export default function NewRoomPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [hotel, setHotel] = useState(null);
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
      .then((d) => setHotel(d?.data?.hotel));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!hotel?._id) return;
    setLoading(true);
    try {
      const res = await fetch('/api/marketplace/rooms/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          hotelId: hotel._id.toString(),
          title: form.title.trim(),
          description: form.description.trim(),
          pricePerNight: Number(form.pricePerNight),
          capacity: Number(form.capacity) || 1,
          totalRooms: Number(form.totalRooms) || 1,
        }),
      });
      const data = await res.json();
      if (data?.success) {
        toast.success('Room added');
        router.push('/hotel/rooms');
      } else toast.error(data?.message || 'Failed');
    } catch {
      toast.error('Something went wrong');
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
            <Label>Room name</Label>
            <Input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required className="mt-1" />
          </div>
          <div>
            <Label>Description</Label>
            <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={3} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Price per night (₹)</Label>
              <Input type="number" min={0} value={form.pricePerNight} onChange={(e) => setForm((f) => ({ ...f, pricePerNight: e.target.value }))} required className="mt-1" />
            </div>
            <div>
              <Label>Max guests</Label>
              <Input type="number" min={1} value={form.capacity} onChange={(e) => setForm((f) => ({ ...f, capacity: e.target.value }))} required className="mt-1" />
            </div>
          </div>
          <div>
            <Label>Total rooms (this type)</Label>
            <Input type="number" min={1} value={form.totalRooms} onChange={(e) => setForm((f) => ({ ...f, totalRooms: e.target.value }))} required className="mt-1" />
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>{loading ? 'Adding...' : 'Add Room'}</Button>
            <Link href="/hotel/rooms"><Button type="button" variant="outline">Cancel</Button></Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
