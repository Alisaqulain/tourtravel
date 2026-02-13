'use client';

import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useDataStore } from '@/store';

export default function EditFlightPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;
  const flights = useDataStore((s) => s.flights);
  const updateFlight = useDataStore((s) => s.updateFlight);
  const flight = flights.find((f) => f.id === id);

  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    if (flight) reset(flight);
  }, [flight, reset]);

  if (!flight) {
    return (
      <div>
        <Link href="/admin/flights" className="inline-flex items-center gap-2 text-muted-foreground mb-6">← Back</Link>
        <p>Flight not found.</p>
      </div>
    );
  }

  const onSubmit = (data) => {
    updateFlight(id, {
      ...data,
      price: Number(data.price),
      savePercent: Number(data.savePercent),
      stops: Number(data.stops),
    });
    router.push('/admin/flights');
  };

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
            <div>
              <Label>Airline Logo URL</Label>
              <Input {...register('airlineLogo')} className="mt-1 rounded-xl" />
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
              <Label>Price (USD)</Label>
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
            <Button type="submit" className="rounded-xl">Update Flight</Button>
            <Link href="/admin/flights"><Button type="button" variant="outline" className="rounded-xl">Cancel</Button></Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
