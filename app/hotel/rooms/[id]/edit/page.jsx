'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/lib/toast';

export default function EditRoomPage() {
  const router = useRouter();
  const params = useParams();
  const roomId = params?.id;
  const [loading, setLoading] = useState(false);
  const [room, setRoom] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', pricePerNight: '', capacity: '', totalRooms: '' });

  useEffect(() => {
    fetch('/api/marketplace/hotel/rooms', { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => {
        const rooms = d?.data?.rooms ?? [];
        const r = rooms.find((x) => x._id === roomId);
        setRoom(r);
        if (r) {
          setForm({
            title: r.title || '',
            description: r.description || '',
            pricePerNight: String(r.pricePerNight ?? ''),
            capacity: String(r.capacity ?? 1),
            totalRooms: String(r.totalRooms ?? 1),
          });
        }
      });
  }, [roomId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/marketplace/rooms/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          roomId,
          title: form.title.trim(),
          description: form.description.trim(),
          pricePerNight: Number(form.pricePerNight),
          capacity: Number(form.capacity),
          totalRooms: Number(form.totalRooms),
        }),
      });
      const data = await res.json();
      if (data?.success) {
        toast.success('Room updated');
        router.push('/hotel/rooms');
      } else toast.error(data?.message || 'Failed');
    } catch {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (!room && !form.title) return <p className="text-muted-foreground">Loading...</p>;
  if (!room) return <p className="text-muted-foreground">Room not found.</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Room</h1>
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
            <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save'}</Button>
            <Link href="/hotel/rooms"><Button type="button" variant="outline">Cancel</Button></Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
