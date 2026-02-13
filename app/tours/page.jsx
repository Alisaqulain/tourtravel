'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, MapPin } from 'lucide-react';
import { SectionHeader } from '@/components/ui/section-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatPrice } from '@/lib/utils';
import { useDataStore } from '@/store';

export default function ToursPage() {
  const tours = useDataStore((s) => s.tours);
  return (
    <div className="container mx-auto px-4 py-12">
      <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
        <ArrowLeft className="h-4 w-4" /> Back to Home
      </Link>
      <SectionHeader
        title="Tours"
        subtitle="Guided tours and experiences around the world. Expert guides and small groups."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tours.map((tour, i) => (
          <motion.div
            key={tour.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link href="/booking-summary">
              <Card className="overflow-hidden h-full hover:shadow-card-hover transition-shadow">
                <div className="relative h-48">
                  <Image
                    src={tour.image}
                    alt={tour.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute top-4 right-4 rounded-full bg-primary text-white text-xs font-bold px-3 py-1">
                    {tour.duration}
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <span className="text-sm font-medium">{tour.rating}</span>
                    <span className="text-muted-foreground text-sm">({tour.reviewCount} reviews)</span>
                  </div>
                  <h3 className="text-lg font-bold mb-1">{tour.title}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mb-4">
                    <MapPin className="h-4 w-4" /> {tour.destination}
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xl font-bold text-primary">{formatPrice(tour.price)}</span>
                      <span className="text-sm line-through text-muted-foreground ml-2">{formatPrice(tour.originalPrice)}</span>
                    </div>
                    <Button size="sm" className="rounded-xl">View Details</Button>
                  </div>
                </div>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
