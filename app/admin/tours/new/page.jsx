'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useDataStore } from '@/store';

export default function NewTourPage() {
  const router = useRouter();
  const addTour = useDataStore((s) => s.addTour);
  const { register, handleSubmit } = useForm({ defaultValues: { rating: 4.9, reviewCount: 0 } });

  const onSubmit = (data) => {
    addTour({
      ...data,
      price: Number(data.price),
      originalPrice: Number(data.originalPrice) || Number(data.price),
      rating: Number(data.rating),
      reviewCount: Number(data.reviewCount),
    });
    router.push('/admin/tours');
  };

  return (
    <div>
      <Link href="/admin/tours" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"><ArrowLeft className="h-4 w-4" /> Back to Tours</Link>
      <h1 className="text-2xl font-bold mb-6">Add Tour</h1>
      <Card className="p-6 max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div><Label>Title</Label><Input {...register('title', { required: true })} className="mt-1 rounded-xl" /></div>
          <div><Label>Destination</Label><Input {...register('destination', { required: true })} className="mt-1 rounded-xl" /></div>
          <div><Label>Image URL</Label><Input {...register('image')} className="mt-1 rounded-xl" /></div>
          <div><Label>Duration</Label><Input {...register('duration', { required: true })} className="mt-1 rounded-xl" placeholder="10 Days" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Price</Label><Input {...register('price', { required: true, valueAsNumber: true })} type="number" className="mt-1 rounded-xl" /></div>
            <div><Label>Original price</Label><Input {...register('originalPrice', { valueAsNumber: true })} type="number" className="mt-1 rounded-xl" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Rating</Label><Input {...register('rating', { valueAsNumber: true })} type="number" step="0.01" className="mt-1 rounded-xl" /></div>
            <div><Label>Review count</Label><Input {...register('reviewCount', { valueAsNumber: true })} type="number" className="mt-1 rounded-xl" /></div>
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="rounded-xl">Save Tour</Button>
            <Link href="/admin/tours"><Button type="button" variant="outline" className="rounded-xl">Cancel</Button></Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
