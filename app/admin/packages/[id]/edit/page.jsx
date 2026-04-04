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

export default function EditPackagePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, reset, watch, setValue } = useForm();

  useEffect(() => {
    if (!id) return;
    fetch(`/api/admin/packages/${id}`, { credentials: 'include' })
      .then((r) => r.json())
      .then((json) => {
        const p = json?.data;
        if (!p) {
          toast.error('Package not found');
          return;
        }
        const highlights = p.highlights || p.inclusions;
        reset({
          title: p.title || p.name || '',
          image: p.image || p.images?.[0] || '',
          duration: p.duration || '',
          price: p.price ?? 0,
          originalPrice: p.originalPrice ?? p.price ?? 0,
          discount: p.discount ?? 0,
          highlights: Array.isArray(highlights) ? highlights.join(', ') : '',
          rating: p.rating ?? 4.9,
        });
      })
      .finally(() => setLoading(false));
  }, [id, reset]);

  const onSubmit = async (data) => {
    if (!id) return;
    setSaving(true);
    try {
      const payload = {
        title: data.title.trim(),
        image: (data.image || '').trim(),
        duration: data.duration.trim(),
        price: Number(data.price),
        originalPrice: Number(data.originalPrice) || Number(data.price),
        discount: Number(data.discount) || 0,
        highlights: data.highlights ? data.highlights.split(',').map((s) => s.trim()).filter(Boolean) : [],
        rating: Number(data.rating) || 0,
      };
      const res = await fetch(`/api/admin/packages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json?.success) {
        toast.success('Package updated');
        router.push('/admin/packages');
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
      <Link href="/admin/packages" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"><ArrowLeft className="h-4 w-4" /> Back to Packages</Link>
      <h1 className="text-2xl font-bold mb-6">Edit Package</h1>
      <Card className="p-6 max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div><Label>Title</Label><Input {...register('title', { required: true })} className="mt-1 rounded-xl" /></div>
          <ListingImageField
            id="pkg-image-edit"
            label="Package image"
            value={watch('image') || ''}
            onChange={(v) => setValue('image', v)}
            disabled={saving}
          />
          <div><Label>Duration</Label><Input {...register('duration', { required: true })} className="mt-1 rounded-xl" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Price (₹)</Label><Input {...register('price', { required: true, valueAsNumber: true })} type="number" className="mt-1 rounded-xl" /></div>
            <div><Label>Original price</Label><Input {...register('originalPrice', { valueAsNumber: true })} type="number" className="mt-1 rounded-xl" /></div>
          </div>
          <div><Label>Discount %</Label><Input {...register('discount', { valueAsNumber: true })} type="number" className="mt-1 rounded-xl" /></div>
          <div><Label>Highlights (comma-separated)</Label><Input {...register('highlights')} className="mt-1 rounded-xl" /></div>
          <div><Label>Rating</Label><Input {...register('rating', { valueAsNumber: true })} type="number" step="0.01" className="mt-1 rounded-xl" /></div>
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="rounded-xl" disabled={saving}>{saving ? 'Saving…' : 'Update Package'}</Button>
            <Link href="/admin/packages"><Button type="button" variant="outline" className="rounded-xl">Cancel</Button></Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
