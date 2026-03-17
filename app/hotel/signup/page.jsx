'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { toast } from '@/lib/toast';

const AMENITY_OPTIONS = ['WiFi', 'Parking', 'Pool', 'Gym', 'Spa', 'Restaurant', 'Bar', 'Air Conditioning', 'Room Service', 'Laundry', 'Airport Shuttle', 'Pet Friendly'];

export default function HotelSignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    ownerName: '',
    email: '',
    password: '',
    phone: '',
    hotelName: '',
    hotelDescription: '',
    address: '',
    city: '',
    country: 'India',
    starRating: 3,
    totalRooms: 10,
    amenities: [],
    documentUrl: '',
    imageUrls: '',
  });

  useEffect(() => {
    const name = searchParams.get('name');
    const email = searchParams.get('email');
    const phone = searchParams.get('phone');
    if (name || email || phone) {
      setForm((prev) => ({
        ...prev,
        ...(name && { ownerName: name }),
        ...(email && { email }),
        ...(phone && { phone }),
      }));
    }
  }, [searchParams]);

  const toggleAmenity = (a) => {
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(a) ? prev.amenities.filter((x) => x !== a) : [...prev.amenities, a],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const images = form.imageUrls ? form.imageUrls.split(/[\n,]/).map((s) => s.trim()).filter(Boolean) : [];
      const documents = form.documentUrl ? [form.documentUrl.trim()] : [];
      const res = await fetch('/api/marketplace/hotel/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ownerName: form.ownerName.trim(),
          email: form.email.trim(),
          password: form.password,
          phone: form.phone.trim(),
          hotelName: form.hotelName.trim(),
          hotelDescription: form.hotelDescription.trim(),
          address: form.address.trim(),
          city: form.city.trim(),
          country: form.country.trim(),
          amenities: form.amenities,
          starRating: form.starRating,
          totalRooms: form.totalRooms,
          images,
          documents,
        }),
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || data.error || 'Signup failed');
        return;
      }
      toast.success('Application submitted. Your hotel is under review.');
      router.push('/hotel');
    } catch {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
            <Building2 className="h-8 w-8" /> Hotel Owner Signup
          </h1>
          <p className="text-muted-foreground mt-2">
            Enter your details and hotel information. Your profile will be reviewed by admin before you can accept bookings.
          </p>
        </div>

        <Card className="p-6 md:p-8">
          {searchParams.get('name') || searchParams.get('email') ? (
            <p className="text-sm text-muted-foreground mb-4 rounded-lg bg-muted/50 p-3">
              Your name and email are pre-filled. Enter your password and hotel details below.
            </p>
          ) : null}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Owner details</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Label htmlFor="ownerName">Owner name</Label>
                  <Input
                    id="ownerName"
                    value={form.ownerName}
                    onChange={(e) => setForm((f) => ({ ...f, ownerName: e.target.value }))}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="password">Password (min 6)</Label>
                  <Input
                    id="password"
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                    required
                    minLength={6}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4">Hotel details</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Label htmlFor="hotelName">Hotel name</Label>
                  <Input
                    id="hotelName"
                    value={form.hotelName}
                    onChange={(e) => setForm((f) => ({ ...f, hotelName: e.target.value }))}
                    required
                    className="mt-1"
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="hotelDescription">Hotel description</Label>
                  <textarea
                    id="hotelDescription"
                    value={form.hotelDescription}
                    onChange={(e) => setForm((f) => ({ ...f, hotelDescription: e.target.value }))}
                    rows={3}
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={form.address}
                    onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={form.city}
                    onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={form.country}
                    onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="starRating">Star rating (1–5)</Label>
                  <select
                    id="starRating"
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
                  <Label htmlFor="totalRooms">Total rooms</Label>
                  <Input
                    id="totalRooms"
                    type="number"
                    min={1}
                    value={form.totalRooms}
                    onChange={(e) => setForm((f) => ({ ...f, totalRooms: Number(e.target.value) || 0 }))}
                    className="mt-1"
                  />
                </div>
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

            <div>
              <Label htmlFor="imageUrls">Hotel image URLs (one per line or comma-separated)</Label>
              <textarea
                id="imageUrls"
                value={form.imageUrls}
                onChange={(e) => setForm((f) => ({ ...f, imageUrls: e.target.value }))}
                placeholder="https://..."
                rows={2}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
              <p className="text-xs text-muted-foreground mt-1">You can add more images later in Hotel Profile.</p>
            </div>
            <div>
              <Label htmlFor="documentUrl">License / verification document URL</Label>
              <Input
                id="documentUrl"
                value={form.documentUrl}
                onChange={(e) => setForm((f) => ({ ...f, documentUrl: e.target.value }))}
                placeholder="https://..."
                className="mt-1"
              />
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit application'}
            </Button>
          </form>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-primary underline">Login</Link>
        </p>
      </div>
    </div>
  );
}
