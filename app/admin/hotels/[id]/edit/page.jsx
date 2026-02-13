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

export default function EditHotelPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;
  const hotels = useDataStore((s) => s.hotels);
  const updateHotel = useDataStore((s) => s.updateHotel);
  const hotel = hotels.find((h) => h.id === id);
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    if (hotel) reset({ ...hotel, amenities: (hotel.amenities || []).join(', ') });
  }, [hotel, reset]);

  if (!hotel) return <div><Link href="/admin/hotels" className="inline-flex items-center gap-2 text-muted-foreground mb-6">← Back</Link><p>Hotel not found.</p></div>;

  const onSubmit = (data) => {
    updateHotel(id, {
      ...data,
      amenities: data.amenities ? data.amenities.split(',').map((s) => s.trim()).filter(Boolean) : [],
      rating: Number(data.rating),
      reviewCount: Number(data.reviewCount),
      pricePerNight: Number(data.pricePerNight),
      originalPrice: Number(data.originalPrice),
    });
    router.push('/admin/hotels');
  };

  return (
    <div>
      <Link href="/admin/hotels" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"><ArrowLeft className="h-4 w-4" /> Back to Hotels</Link>
      <h1 className="text-2xl font-bold mb-6">Edit Hotel</h1>
      <Card className="p-6 max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div><Label>Name</Label><Input {...register('name', { required: true })} className="mt-1 rounded-xl" /></div>
          <div><Label>Location</Label><Input {...register('location', { required: true })} className="mt-1 rounded-xl" /></div>
          <div><Label>Image URL</Label><Input {...register('image')} className="mt-1 rounded-xl" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Price per night</Label><Input {...register('pricePerNight', { required: true, valueAsNumber: true })} type="number" className="mt-1 rounded-xl" /></div>
            <div><Label>Original price</Label><Input {...register('originalPrice', { valueAsNumber: true })} type="number" className="mt-1 rounded-xl" /></div>
          </div>
          <div><Label>Amenities (comma-separated)</Label><Input {...register('amenities')} className="mt-1 rounded-xl" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Rating</Label><Input {...register('rating', { valueAsNumber: true })} type="number" min={1} max={5} className="mt-1 rounded-xl" /></div>
            <div><Label>Review count</Label><Input {...register('reviewCount', { valueAsNumber: true })} type="number" className="mt-1 rounded-xl" /></div>
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="rounded-xl">Update Hotel</Button>
            <Link href="/admin/hotels"><Button type="button" variant="outline" className="rounded-xl">Cancel</Button></Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
