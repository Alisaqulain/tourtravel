'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Star, Wifi, Coffee, Waves, Clock, Phone, Car, Info, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ImageSlider } from '@/components/ui/image-slider';
import { formatPrice } from '@/lib/utils';
import { useBookingStore } from '@/store';
import { hotelReviews } from '@/data/reviews';

const amenityIcons = { Pool: Waves, WiFi: Wifi, Restaurant: Coffee, Spa: Waves, Beach: Waves, Gym: Coffee, Bar: Coffee };
const HOTEL_FALLBACK = 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800';
const CONTACT_PHONE = '+91 97177 46661';

function mapHotel(h) {
  if (!h) return null;
  const imgs = h.images?.length ? h.images : h.image ? [h.image] : [HOTEL_FALLBACK];
  const rating = Math.min(5, Math.max(1, Math.round(Number(h.starRating ?? h.reviewScore ?? 5))));
  return {
    id: h.id,
    name: h.name,
    location: h.city || h.location || '',
    images: imgs,
    amenities: Array.isArray(h.amenities) ? h.amenities : [],
    rating,
    reviewCount: h.reviewCount ?? 0,
    pricePerNight: h.pricePerNight ?? 0,
  };
}

export default function HotelDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;
  const setSelectedHotel = useBookingStore((s) => s.setSelectedHotel);
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    fetch(`/api/travel/hotels?id=${encodeURIComponent(id)}`)
      .then((r) => r.json())
      .then((json) => {
        if (cancelled) return;
        setHotel(mapHotel(json?.data));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [id]);

  const handleBook = () => {
    if (!hotel) return;
    setSelectedHotel({
      id: hotel.id,
      name: hotel.name,
      location: hotel.location,
      image: hotel.images[0],
      amenities: hotel.amenities,
      rating: hotel.rating,
      reviewCount: hotel.reviewCount,
      pricePerNight: hotel.pricePerNight,
    });
    router.push('/booking-summary');
  };

  const checkIn = '3:00 PM';
  const checkOut = '11:00 AM';
  const distanceFromAirport = '12 km';

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p>Hotel not found.</p>
        <Link href="/hotels" className="text-primary mt-4 inline-block">← Back to Hotels</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link href="/hotels" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 text-sm">
        <ArrowLeft className="h-4 w-4" /> Back to Hotels
      </Link>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="overflow-hidden mb-6">
          <div className="relative w-full min-h-[280px] md:min-h-[360px]">
            <ImageSlider images={hotel.images} alt={hotel.name} priority />
          </div>
          <div className="p-6 md:p-8">
            <div className="flex items-center gap-2 mb-2">
              {[...Array(5)].map((_, k) => (
                <Star key={k} className={`h-5 w-5 ${k < hotel.rating ? 'fill-primary text-primary' : 'text-muted-foreground/30'}`} />
              ))}
              <span className="text-muted-foreground text-sm">({hotel.reviewCount.toLocaleString()} reviews)</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{hotel.name}</h1>
            <p className="text-muted-foreground flex items-center gap-1 mb-6">
              <MapPin className="h-5 w-5 shrink-0" /> {hotel.location || '—'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 p-4 rounded-xl bg-muted/50">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Check-in / Check-out</p>
                  <p className="font-medium">{checkIn} / {checkOut}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Car className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">From nearest airport</p>
                  <p className="font-medium">{distanceFromAirport}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Contact</p>
                  <p className="font-medium">{CONTACT_PHONE}</p>
                </div>
              </div>
            </div>

            <h3 className="font-semibold mb-2 flex items-center gap-2"><Info className="h-4 w-4" /> About</h3>
            <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
              {hotel.name} offers a premium stay in {hotel.location || 'this destination'} with top-notch service and facilities. Guests enjoy comfortable rooms, on-site dining, and easy access to local attractions. Ideal for both business and leisure travelers. Free cancellation up to 24 hours before check-in. No prepayment required — pay at the property.
            </p>

            <h3 className="font-semibold mb-2">Amenities</h3>
            <div className="flex flex-wrap gap-2 mb-6">
              {hotel.amenities.length === 0 && (
                <span className="text-sm text-muted-foreground">No amenities listed.</span>
              )}
              {hotel.amenities.map((a) => {
                const Icon = amenityIcons[a] || Coffee;
                return (
                  <span key={a} className="inline-flex items-center gap-2 rounded-xl bg-muted px-3 py-2 text-sm">
                    <Icon className="h-4 w-4" /> {a}
                  </span>
                );
              })}
            </div>

            <h3 className="font-semibold mb-2">Policies</h3>
            <ul className="text-sm text-muted-foreground space-y-1 mb-6 list-disc list-inside">
              <li>Free cancellation until 24 hours before check-in</li>
              <li>Children of all ages welcome</li>
              <li>Pets not allowed</li>
              <li>No smoking in rooms</li>
            </ul>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border">
              <div>
                <span className="text-2xl font-bold text-primary">{formatPrice(hotel.pricePerNight)}</span>
                <span className="text-muted-foreground"> / night · Taxes & fees included</span>
              </div>
              <Button onClick={handleBook} className="rounded-xl">Book Now</Button>
            </div>
          </div>
        </Card>

        <h2 className="text-xl font-bold mb-4">Guest reviews</h2>
        <div className="space-y-4">
          {hotelReviews.map((r) => (
            <Card key={r.id} className="p-4">
              <div className="flex items-center gap-2 mb-2">
                {[...Array(r.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
                <span className="font-medium">{r.name}</span>
                <span className="text-muted-foreground text-sm">{r.date}</span>
              </div>
              <p className="text-muted-foreground text-sm">{r.text}</p>
            </Card>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
