'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Star, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ImageSlider } from '@/components/ui/image-slider';
import { formatPrice } from '@/lib/utils';
import { useBookingStore, useDataStore } from '@/store';
import { tourReviews } from '@/data/reviews';

export default function TourDetailPage() {
  const params = useParams();
  const router = useRouter();
  const tours = useDataStore((s) => s.tours);
  const setSelectedTour = useBookingStore((s) => s.setSelectedTour);
  const tour = tours.find((t) => t.id === params.id);

  if (!tour) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p>Tour not found.</p>
        <Link href="/tours" className="text-primary mt-4 inline-block">← Back to Tours</Link>
      </div>
    );
  }

  const handleBook = () => {
    setSelectedTour(tour);
    router.push('/booking-summary');
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Link href="/tours" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
        <ArrowLeft className="h-4 w-4" /> Back to Tours
      </Link>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="overflow-hidden mb-8">
          <div className="relative w-full min-h-[280px] md:min-h-[360px]">
            <ImageSlider images={tour.images || (tour.image ? [tour.image] : [])} alt={tour.title} priority />
          </div>
          <div className="p-6 md:p-8">
            <div className="flex items-center gap-2 mb-2">
              <Star className="h-5 w-5 fill-primary text-primary" />
              <span className="font-medium">{tour.rating}</span>
              <span className="text-muted-foreground">({tour.reviewCount} reviews)</span>
            </div>
            <h1 className="text-2xl font-bold mb-2">{tour.title}</h1>
            <p className="text-muted-foreground flex items-center gap-1 mb-4">
              <MapPin className="h-5 w-5" /> {tour.destination}
            </p>
            <p className="rounded-xl bg-muted/50 px-3 py-2 inline-block mb-4">
              <Calendar className="h-4 w-4 inline mr-2" />
              {tour.duration}
            </p>

            <h3 className="font-semibold mb-2">About this tour</h3>
            <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
              Expert-led guided experience covering the best of {tour.destination}. Small group size for a personalized experience. All entrance fees and transport as per itinerary included. Hotel pickup available in selected areas.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="rounded-xl bg-muted/50 p-4">
                <h4 className="font-medium mb-2 text-sm">What&apos;s included</h4>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Professional guide</li>
                  <li>Entrance fees</li>
                  <li>Transport as per itinerary</li>
                  <li>Small group (max 15)</li>
                </ul>
              </div>
              <div className="rounded-xl bg-muted/50 p-4">
                <h4 className="font-medium mb-2 text-sm">What&apos;s not included</h4>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Meals & drinks</li>
                  <li>Travel insurance</li>
                  <li>Personal expenses</li>
                </ul>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-6">Meeting point: Details sent after booking. Free cancellation up to 24 hours before start for full refund.</p>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border">
              <div>
                <span className="text-2xl font-bold text-primary">{formatPrice(tour.price)}</span>
                {tour.originalPrice && (
                  <span className="text-muted-foreground line-through ml-2">{formatPrice(tour.originalPrice)}</span>
                )}
              </div>
              <Button onClick={handleBook} className="rounded-xl">Book Now</Button>
            </div>
          </div>
        </Card>

        <h2 className="text-xl font-bold mb-4">Guest reviews</h2>
        <div className="space-y-4">
          {tourReviews.map((r) => (
            <Card key={r.id} className="p-4">
              <div className="flex items-center gap-2 mb-2">
                {[...Array(r.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
                <span className="font-medium">{r.name}</span>
                <span className="text-muted-foreground text-sm">{r.date}</span>
              </div>
              <p className="text-muted-foreground">{r.text}</p>
            </Card>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
