'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Ship, Star, MapPin, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ImageSlider } from '@/components/ui/image-slider';
import { formatPrice } from '@/lib/utils';
import { useBookingStore, useDataStore } from '@/store';
import { cruiseReviews } from '@/data/reviews';

export default function CruiseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const cruises = useDataStore((s) => s.cruises);
  const setSelectedCruise = useBookingStore((s) => s.setSelectedCruise);
  const cruise = cruises.find((c) => c.id === params.id);

  if (!cruise) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p>Cruise not found.</p>
        <Link href="/cruise" className="text-primary mt-4 inline-block">← Back to Cruise</Link>
      </div>
    );
  }

  const handleBook = () => {
    setSelectedCruise(cruise);
    router.push('/booking-summary');
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Link href="/cruise" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
        <ArrowLeft className="h-4 w-4" /> Back to Cruise
      </Link>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="overflow-hidden mb-8 border border-border/60 bg-card/80">
          <div className="relative w-full min-h-[280px] md:min-h-[360px]">
            <ImageSlider images={cruise.images || (cruise.image ? [cruise.image] : [])} alt={cruise.name} priority />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white pointer-events-none">
              <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold">Save {cruise.savePercent}%</span>
              <h1 className="text-2xl md:text-3xl font-bold mt-2">{cruise.name}</h1>
              <p className="text-white/90 flex items-center gap-1">
                <Ship className="h-5 w-5" /> {cruise.ship} · {cruise.duration}
              </p>
            </div>
          </div>
          <div className="p-6 md:p-8">
            <div className="flex items-center gap-2 mb-4">
              <Star className="h-5 w-5 fill-primary text-primary" />
              <span className="font-medium">{cruise.rating}</span>
              <span className="text-muted-foreground">({cruise.reviewCount} reviews)</span>
            </div>
            <p className="text-muted-foreground flex items-center gap-1 mb-4">
              <MapPin className="h-5 w-5" /> {cruise.route}
            </p>
            <p className="text-muted-foreground flex items-center gap-1 mb-6">
              <Calendar className="h-5 w-5" /> Departs {cruise.departureDate}
            </p>

            <h3 className="font-semibold mb-2">Cabin types</h3>
            <div className="flex flex-wrap gap-2 mb-6">
              {cruise.cabinTypes.map((c) => (
                <span key={c} className="rounded-xl bg-muted px-3 py-2 text-sm">{c}</span>
              ))}
            </div>

            <h3 className="font-semibold mb-2">Amenities</h3>
            <div className="flex flex-wrap gap-2 mb-6">
              {cruise.amenities.map((a) => (
                <span key={a} className="rounded-xl bg-muted px-3 py-2 text-sm">{a}</span>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border">
              <div>
                <span className="text-2xl font-bold text-primary">{formatPrice(cruise.price)}</span>
                <span className="text-muted-foreground line-through ml-2">{formatPrice(cruise.originalPrice)}</span>
              </div>
              <Button onClick={handleBook} className="rounded-xl">Book Now</Button>
            </div>
          </div>
        </Card>

        <h2 className="text-xl font-bold mb-4">Reviews</h2>
        <div className="space-y-4">
          {cruiseReviews.map((r) => (
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
