'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Car, Star, MapPin, Users, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ImageSlider } from '@/components/ui/image-slider';
import { formatPrice } from '@/lib/utils';
import { useBookingStore, useDataStore } from '@/store';
import { carReviews } from '@/data/reviews';

export default function CarDetailPage() {
  const params = useParams();
  const router = useRouter();
  const cars = useDataStore((s) => s.cars);
  const setSelectedCar = useBookingStore((s) => s.setSelectedCar);
  const car = cars.find((c) => c.id === params.id);

  if (!car) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p>Car not found.</p>
        <Link href="/cars" className="text-primary mt-4 inline-block">← Back to Premium Cars</Link>
      </div>
    );
  }

  const handleBook = () => {
    setSelectedCar(car);
    router.push('/booking-summary');
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Link href="/cars" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
        <ArrowLeft className="h-4 w-4" /> Back to Premium Cars
      </Link>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="overflow-hidden mb-8 border border-border/60 bg-card/80">
          <div className="relative w-full min-h-[280px] md:min-h-[360px]">
            <ImageSlider images={car.images || (car.image ? [car.image] : [])} alt={car.name} priority />
            <span className="absolute top-4 left-4 z-10 rounded-full bg-amber-500/90 text-white text-sm font-bold px-4 py-2">
              Premium
            </span>
          </div>
          <div className="p-6 md:p-8">
            <div className="flex items-center gap-2 mb-2">
              <Star className="h-5 w-5 fill-primary text-primary" />
              <span className="font-medium">{car.rating}</span>
              <span className="text-muted-foreground">({car.reviewCount} reviews)</span>
            </div>
            <h1 className="text-2xl font-bold mb-2">{car.name}</h1>
            <p className="text-muted-foreground flex items-center gap-1 mb-4">
              <MapPin className="h-5 w-5" /> {car.location}
            </p>
            <p className="text-muted-foreground mb-4">{car.category} · {car.transmission}</p>

            <div className="flex gap-6 mb-6 text-sm">
              <span className="flex items-center gap-2 text-muted-foreground">
                <Users className="h-5 w-5" /> {car.seats} seats
              </span>
              <span className="flex items-center gap-2 text-muted-foreground">
                <Briefcase className="h-5 w-5" /> {car.bags} bags
              </span>
            </div>

            <h3 className="font-semibold mb-2">Features</h3>
            <div className="flex flex-wrap gap-2 mb-6">
              {car.features.map((f) => (
                <span key={f} className="rounded-xl bg-muted px-3 py-2 text-sm">{f}</span>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border">
              <div>
                <span className="text-2xl font-bold text-primary">{formatPrice(car.pricePerDay)}</span>
                <span className="text-muted-foreground"> / day</span>
                {car.originalPrice && (
                  <span className="text-muted-foreground line-through ml-2">{formatPrice(car.originalPrice)}</span>
                )}
              </div>
              <Button onClick={handleBook} className="rounded-xl">Book Now</Button>
            </div>
          </div>
        </Card>

        <h2 className="text-xl font-bold mb-4">Reviews</h2>
        <div className="space-y-4">
          {carReviews.map((r) => (
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
