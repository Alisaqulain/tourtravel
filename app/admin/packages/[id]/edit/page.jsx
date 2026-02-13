'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useDataStore } from '@/store';

export default function EditPackagePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;
  const packagesList = useDataStore((s) => s.packages);
  const updatePackage = useDataStore((s) => s.updatePackage);
  const pkg = packagesList.find((p) => p.id === id);
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    if (pkg) reset({ ...pkg, highlights: (pkg.highlights || []).join(', ') });
  }, [pkg, reset]);

  if (!pkg) return <div><Link href="/admin/packages" className="inline-flex items-center gap-2 text-muted-foreground mb-6">← Back</Link><p>Package not found.</p></div>;

  const onSubmit = (data) => {
    updatePackage(id, {
      ...data,
      highlights: data.highlights ? data.highlights.split(',').map((s) => s.trim()).filter(Boolean) : [],
      price: Number(data.price),
      originalPrice: Number(data.originalPrice),
      discount: Number(data.discount),
      rating: Number(data.rating),
    });
    router.push('/admin/packages');
  };

  return (
    <div>
      <Link href="/admin/packages" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"><ArrowLeft className="h-4 w-4" /> Back to Packages</Link>
      <h1 className="text-2xl font-bold mb-6">Edit Package</h1>
      <Card className="p-6 max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div><Label>Title</Label><Input {...register('title', { required: true })} className="mt-1 rounded-xl" /></div>
          <div><Label>Image URL</Label><Input {...register('image')} className="mt-1 rounded-xl" /></div>
          <div><Label>Duration</Label><Input {...register('duration', { required: true })} className="mt-1 rounded-xl" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Price</Label><Input {...register('price', { required: true, valueAsNumber: true })} type="number" className="mt-1 rounded-xl" /></div>
            <div><Label>Original price</Label><Input {...register('originalPrice', { valueAsNumber: true })} type="number" className="mt-1 rounded-xl" /></div>
          </div>
          <div><Label>Discount %</Label><Input {...register('discount', { valueAsNumber: true })} type="number" className="mt-1 rounded-xl" /></div>
          <div><Label>Highlights (comma-separated)</Label><Input {...register('highlights')} className="mt-1 rounded-xl" /></div>
          <div><Label>Rating</Label><Input {...register('rating', { valueAsNumber: true })} type="number" step="0.01" className="mt-1 rounded-xl" /></div>
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="rounded-xl">Update Package</Button>
            <Link href="/admin/packages"><Button type="button" variant="outline" className="rounded-xl">Cancel</Button></Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
