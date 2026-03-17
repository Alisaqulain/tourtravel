'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function HotelRegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [hotel, setHotel] = useState(null);
  const [form, setForm] = useState({ hotelName: '', address: '', city: '', description: '' });

  useEffect(() => {
    fetch('/api/marketplace/hotel/register', { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => {
        if (d?.data?.hotel) {
          setHotel(d.data.hotel);
          setForm({
            hotelName: d.data.hotel.name || '',
            address: d.data.hotel.address || '',
            city: d.data.hotel.city || '',
            description: d.data.hotel.description || '',
          });
        }
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/marketplace/hotel/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data?.success) {
        setHotel(data.data.hotel);
        if (!hotel) router.push('/marketplace/hotel');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{hotel ? 'Hotel Details' : 'Register Your Hotel'}</h1>
      <Card className="p-6 max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Hotel Name</Label>
            <Input value={form.hotelName} onChange={(e) => setForm((f) => ({ ...f, hotelName: e.target.value }))} required className="mt-1" />
          </div>
          <div>
            <Label>Address</Label>
            <Input value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} required className="mt-1" />
          </div>
          <div>
            <Label>City</Label>
            <Input value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))} required className="mt-1" />
          </div>
          <div>
            <Label>Description</Label>
            <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="w-full border rounded-lg px-3 py-2 mt-1 min-h-[80px]" />
          </div>
          {hotel && <p className="text-sm text-muted-foreground">Status: {hotel.status}</p>}
          <Button type="submit" disabled={loading}>{loading ? 'Saving...' : hotel ? 'Update' : 'Submit for Verification'}</Button>
        </form>
      </Card>
    </div>
  );
}
