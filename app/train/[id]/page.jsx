'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Train, Clock, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ImageSlider } from '@/components/ui/image-slider';
import { formatPrice } from '@/lib/utils';
import { useBookingStore, useDataStore } from '@/store';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export default function TrainDetailPage() {
  const params = useParams();
  const router = useRouter();
  const trains = useDataStore((s) => s.trains);
  const setSelectedTrain = useBookingStore((s) => s.setSelectedTrain);
  const train = trains.find((t) => t.id === params.id);
  const [pnrInput, setPnrInput] = useState('');

  if (!train) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p>Train not found.</p>
        <Link href="/train" className="text-primary mt-4 inline-block">← Back to Trains</Link>
      </div>
    );
  }

  const handleBook = () => {
    setSelectedTrain(train);
    router.push('/booking-summary');
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Link href="/train" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
        <ArrowLeft className="h-4 w-4" aria-hidden /> Back to Trains
      </Link>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="overflow-hidden mb-8 rounded-2xl border border-border shadow-sm">
          {(train.images?.length > 0 || train.image) && (
            <div className="relative w-full aspect-[16/10] min-h-[280px] md:min-h-[360px]">
              <ImageSlider
                images={train.images || (train.image ? [train.image] : [])}
                alt={`${train.name} ${train.from} to ${train.to}`}
                priority
              />
            </div>
          )}
          <div className="p-6 md:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="h-14 w-14 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Train className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{train.name}</h1>
                  <p className="text-muted-foreground">Train no. {train.trainNo} · {train.from} → {train.to}</p>
                </div>
              </div>
              {train.savePercent > 0 && (
                <span className="rounded-full bg-primary/20 text-primary font-bold px-4 py-2">Save {train.savePercent}%</span>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="rounded-xl bg-muted/50 p-4">
                <p className="text-xs text-muted-foreground">Departure</p>
                <p className="font-semibold">{train.departure}</p>
              </div>
              <div className="rounded-xl bg-muted/50 p-4">
                <p className="text-xs text-muted-foreground">Arrival</p>
                <p className="font-semibold">{train.arrival}</p>
              </div>
              <div className="rounded-xl bg-muted/50 p-4">
                <p className="text-xs text-muted-foreground">Duration</p>
                <p className="font-semibold">{train.duration}</p>
              </div>
              <div className="rounded-xl bg-muted/50 p-4">
                <p className="text-xs text-muted-foreground">Date</p>
                <p className="font-semibold">{train.date}</p>
              </div>
            </div>

            <div className="rounded-xl bg-muted/50 p-4 mb-6">
              <h3 className="font-semibold mb-2">Available classes</h3>
              <p className="text-sm text-muted-foreground">
                {(train.classes || [train.class]).join(' · ')}. Selected: {train.class}. {train.seatsAvailable} seats available.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border">
              <div>
                <span className="text-2xl font-bold text-primary">{formatPrice(train.price)}</span>
                {train.originalPrice && (
                  <span className="text-muted-foreground line-through ml-2">{formatPrice(train.originalPrice)}</span>
                )}
              </div>
              <Button onClick={handleBook} className="rounded-xl">Book Now (redirect to IRCTC)</Button>
            </div>
          </div>
        </Card>

        <Card className="p-6 rounded-2xl border border-border shadow-sm mb-8">
          <h2 className="text-lg font-bold mb-3">PNR Status (optional)</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Enter your 10-digit PNR to check booking status. You will be redirected to the official portal for live status.
          </p>
          <div className="flex flex-wrap gap-2">
            <Input
              placeholder="Enter PNR number"
              value={pnrInput}
              onChange={(e) => setPnrInput(e.target.value.replace(/\D/g, '').slice(0, 10))}
              className="max-w-[200px] rounded-xl"
              maxLength={10}
              aria-label="PNR number"
            />
            <Button variant="outline" className="rounded-xl" onClick={() => window.open('https://www.irctc.co.in/eticketing/login', '_blank')}>
              Check PNR
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
