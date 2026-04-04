'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { toast } from '@/lib/toast';
import { ListingImageField } from '@/components/admin/listing-image-field';

export default function EditHotelPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, reset, watch, setValue } = useForm();

  useEffect(() => {
    if (!id) return;
    fetch(`/api/admin/hotels/${id}`, { credentials: 'include' })
      .then((r) => r.json())
      .then((json) => {
        const h = json?.data;
        if (!h) {
          toast.error('Hotel not found');
          return;
        }
        reset({
          ...h,
          amenities: Array.isArray(h.amenities) ? h.amenities.join(', ') : h.amenities || '',
        });
      })
      .finally(() => setLoading(false));
  }, [id, reset]);

  const onSubmit = async (data) => {
    if (!id) return;
    setSaving(true);
    try {
      const payload = {
        name: data.name.trim(),
        location: data.location.trim(),
        image: (data.image || '').trim(),
        pricePerNight: Number(data.pricePerNight),
        originalPrice: Number(data.originalPrice) || Number(data.pricePerNight),
        amenities: data.amenities ? data.amenities.split(',').map((s) => s.trim()).filter(Boolean) : [],
        rating: Number(data.rating),
        reviewCount: Number(data.reviewCount),
      };
      const res = await fetch(`/api/admin/hotels/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json?.success) {
        toast.success('Hotel updated');
        router.push('/admin/hotels');
      } else toast.error(json?.message || 'Update failed');
    } catch {
      toast.error('Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <Link href="/admin/hotels" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"><ArrowLeft className="h-4 w-4" /> Back to Hotels</Link>
      <h1 className="text-2xl font-bold mb-6">Edit Hotel</h1>
      <Card className="p-6 max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div><Label>Name</Label><Input {...register('name', { required: true })} className="mt-1 rounded-xl" /></div>
          <div><Label>Location</Label><Input {...register('location', { required: true })} className="mt-1 rounded-xl" /></div>
          <ListingImageField
            id="hotel-image-edit"
            label="Hotel image"
            value={watch('image') || ''}
            onChange={(v) => setValue('image', v)}
            disabled={saving}
          />
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Price per night (₹)</Label><Input {...register('pricePerNight', { required: true, valueAsNumber: true })} type="number" className="mt-1 rounded-xl" /></div>
            <div><Label>Original price</Label><Input {...register('originalPrice', { valueAsNumber: true })} type="number" className="mt-1 rounded-xl" /></div>
          </div>
          <div><Label>Amenities (comma-separated)</Label><Input {...register('amenities')} className="mt-1 rounded-xl" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Rating</Label><Input {...register('rating', { valueAsNumber: true })} type="number" min={1} max={5} className="mt-1 rounded-xl" /></div>
            <div><Label>Review count</Label><Input {...register('reviewCount', { valueAsNumber: true })} type="number" className="mt-1 rounded-xl" /></div>
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="rounded-xl" disabled={saving}>{saving ? 'Saving…' : 'Update Hotel'}</Button>
            <Link href="/admin/hotels"><Button type="button" variant="outline" className="rounded-xl">Cancel</Button></Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
