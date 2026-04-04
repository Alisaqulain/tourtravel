'use client';

import { useRouter, useParams } from 'next/navigation';
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

function buildPayload(data) {
  const airlineLogo = (data.airlineLogo || '').trim();
  return {
    airline: data.airline.trim(),
    airlineLogo,
    from: data.from.trim(),
    to: data.to.trim(),
    departure: data.departure.trim(),
    arrival: data.arrival.trim(),
    duration: data.duration.trim(),
    date: data.date,
    price: Number(data.price) || 0,
    savePercent: Number(data.savePercent) || 0,
    stops: Number(data.stops) || 0,
    class: data.class || 'Economy',
    images: airlineLogo ? [airlineLogo] : [],
  };
}

export default function EditFlightPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, reset, watch, setValue } = useForm();

  useEffect(() => {
    if (!id) return;
    fetch(`/api/admin/flights/${id}`, { credentials: 'include' })
      .then((r) => r.json())
      .then((json) => {
        const p = json?.data;
        if (!p) {
          toast.error('Flight not found');
          return;
        }
        reset({
          airline: p.airline || '',
          airlineLogo: p.airlineLogo || p.images?.[0] || '',
          from: p.from || '',
          to: p.to || '',
          departure: p.departure || '',
          arrival: p.arrival || '',
          duration: p.duration || '',
          date: p.date || '',
          price: p.price ?? 0,
          savePercent: p.savePercent ?? 0,
          stops: p.stops ?? 0,
          class: p.class || 'Economy',
        });
      })
      .finally(() => setLoading(false));
  }, [id, reset]);

  const onSubmit = async (data) => {
    if (!id) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/flights/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(buildPayload(data)),
      });
      const json = await res.json();
      if (json?.success) {
        toast.success('Flight updated');
        router.push('/admin/flights');
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
      <Link href="/admin/flights" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to Flights
      </Link>
      <h1 className="text-2xl font-bold mb-6">Edit Flight</h1>

      <Card className="p-6 max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Airline</Label>
              <Input {...register('airline', { required: true })} className="mt-1 rounded-xl" />
            </div>
            <div className="md:col-span-2">
              <ListingImageField
                id="flight-logo-edit"
                label="Airline logo (optional)"
                value={watch('airlineLogo') || ''}
                onChange={(v) => setValue('airlineLogo', v)}
                disabled={saving}
              />
            </div>
            <div>
              <Label>From</Label>
              <Input {...register('from', { required: true })} className="mt-1 rounded-xl" />
            </div>
            <div>
              <Label>To</Label>
              <Input {...register('to', { required: true })} className="mt-1 rounded-xl" />
            </div>
            <div>
              <Label>Departure time</Label>
              <Input {...register('departure', { required: true })} className="mt-1 rounded-xl" />
            </div>
            <div>
              <Label>Arrival time</Label>
              <Input {...register('arrival', { required: true })} className="mt-1 rounded-xl" />
            </div>
            <div>
              <Label>Duration</Label>
              <Input {...register('duration', { required: true })} className="mt-1 rounded-xl" />
            </div>
            <div>
              <Label>Date</Label>
              <Input {...register('date', { required: true })} type="date" className="mt-1 rounded-xl" />
            </div>
            <div>
              <Label>Price (₹)</Label>
              <Input {...register('price', { required: true, valueAsNumber: true })} type="number" className="mt-1 rounded-xl" />
            </div>
            <div>
              <Label>Save %</Label>
              <Input {...register('savePercent', { valueAsNumber: true })} type="number" className="mt-1 rounded-xl" />
            </div>
            <div>
              <Label>Stops</Label>
              <Input {...register('stops', { valueAsNumber: true })} type="number" className="mt-1 rounded-xl" />
            </div>
            <div>
              <Label>Class</Label>
              <Input {...register('class')} className="mt-1 rounded-xl" />
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="rounded-xl" disabled={saving}>{saving ? 'Saving…' : 'Update Flight'}</Button>
            <Link href="/admin/flights"><Button type="button" variant="outline" className="rounded-xl">Cancel</Button></Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
