'use client';

import { useEffect, useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/lib/toast';

const AMENITY_OPTIONS = ['WiFi', 'Parking', 'Pool', 'Gym', 'Spa', 'Restaurant', 'Bar', 'Air Conditioning', 'Room Service', 'Laundry', 'Airport Shuttle', 'Pet Friendly'];

export default function HotelProfilePage() {
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    address: '',
    city: '',
    country: '',
    amenities: [],
    starRating: 3,
    totalRooms: 0,
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetch('/api/marketplace/hotel/register', { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => {
        const h = d?.data?.hotel;
        setHotel(h);
        if (h) {
          setForm({
            name: h.name || '',
            description: h.description || '',
            address: h.address || '',
            city: h.city || '',
            country: h.country || '',
            amenities: Array.isArray(h.amenities) ? h.amenities : [],
            starRating: h.starRating ?? 3,
            totalRooms: h.totalRooms ?? 0,
          });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const toggleAmenity = (a) => {
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(a) ? prev.amenities.filter((x) => x !== a) : [...prev.amenities, a],
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/marketplace/hotel/register', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: form.name.trim(),
          description: form.description.trim(),
          address: form.address.trim(),
          city: form.city.trim(),
          country: form.country.trim(),
          amenities: form.amenities,
          starRating: form.starRating,
          totalRooms: form.totalRooms,
        }),
      });
      const data = await res.json();
      if (data?.success) {
        setHotel((prev) => (prev ? { ...prev, ...form } : null));
        toast.success('Profile updated');
      } else toast.error(data?.message || 'Update failed');
    } catch {
      toast.error('Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('prefix', type);
      const res = await fetch('/api/marketplace/upload', { method: 'POST', body: fd, credentials: 'include' });
      const data = await res.json();
      if (data?.data?.url) {
        if (type === 'hotel') {
          const images = [...(hotel?.images || []), data.data.url];
          await fetch('/api/marketplace/hotel/register', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ images }),
          });
          setHotel((prev) => (prev ? { ...prev, images } : null));
          toast.success('Image added');
        } else {
          const documents = [...(hotel?.documents || []), data.data.url];
          await fetch('/api/marketplace/hotel/register', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ documents }),
          });
          setHotel((prev) => (prev ? { ...prev, documents } : null));
          toast.success('Document added');
        }
      } else toast.error('Upload failed');
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  if (loading) return <p className="text-muted-foreground">Loading...</p>;
  if (!hotel) return <p className="text-muted-foreground">No hotel found.</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Hotel Profile</h1>
      <p className="text-muted-foreground mb-6">Edit your hotel details and upload images.</p>

      <Card className="p-6 max-w-2xl">
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <Label>Hotel name</Label>
            <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required className="mt-1" />
          </div>
          <div>
            <Label>Description</Label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={3}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
          <div>
            <Label>Address</Label>
            <Input value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} required className="mt-1" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>City</Label>
              <Input value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))} required className="mt-1" />
            </div>
            <div>
              <Label>Country</Label>
              <Input value={form.country} onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))} className="mt-1" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Star rating</Label>
              <select
                value={form.starRating}
                onChange={(e) => setForm((f) => ({ ...f, starRating: Number(e.target.value) }))}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>{n} Star{n > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Total rooms</Label>
              <Input type="number" min={0} value={form.totalRooms} onChange={(e) => setForm((f) => ({ ...f, totalRooms: Number(e.target.value) || 0 }))} className="mt-1" />
            </div>
          </div>
          <div>
            <Label className="mb-2 block">Amenities</Label>
            <div className="flex flex-wrap gap-2">
              {AMENITY_OPTIONS.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => toggleAmenity(a)}
                  className={`rounded-full px-3 py-1 text-sm border transition-colors ${
                    form.amenities.includes(a) ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted/50 border-border hover:bg-muted'
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>
          <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save changes'}</Button>
        </form>
      </Card>

      <Card className="p-6 max-w-2xl mt-6">
        <h2 className="font-semibold mb-4">Hotel images</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {(hotel.images || []).map((url, i) => (
            <div key={i} className="w-24 h-24 rounded-lg border bg-muted overflow-hidden">
              <img src={url} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
        <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'hotel')} disabled={uploading} />
        <Button type="button" variant="outline" size="sm" onClick={() => imageInputRef.current?.click()}>
          {uploading ? 'Uploading...' : 'Upload image'}
        </Button>
      </Card>

      <Card className="p-6 max-w-2xl mt-6">
        <h2 className="font-semibold mb-4">Verification documents</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {(hotel.documents || []).map((url, i) => (
            <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary underline">
              Document {i + 1}
            </a>
          ))}
        </div>
        <input ref={docInputRef} type="file" accept="image/*,.pdf" className="hidden" onChange={(e) => handleFileUpload(e, 'doc')} disabled={uploading} />
        <Button type="button" variant="outline" size="sm" onClick={() => docInputRef.current?.click()}>
          {uploading ? 'Uploading...' : 'Upload document'}
        </Button>
      </Card>

      <p className="text-sm text-muted-foreground mt-6">Status: <span className="font-medium">{hotel.status}</span></p>
    </div>
  );
}
