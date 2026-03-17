'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Star, Wifi, Coffee, Waves, Clock, Phone, Car, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ImageSlider } from '@/components/ui/image-slider';
import { formatPrice } from '@/lib/utils';
import { useBookingStore, useDataStore } from '@/store';
import { hotelReviews } from '@/data/reviews';

const amenityIcons = { Pool: Waves, WiFi: Wifi, Restaurant: Coffee, Spa: Waves, Beach: Waves, Gym: Coffee, Bar: Coffee };

export default function HotelDetailPage() {
  const params = useParams();
  const router = useRouter();
  const idOrSlug = params?.id;
  const hotels = useDataStore((s) => s.hotels);
  const setSelectedHotel = useBookingStore((s) => s.setSelectedHotel);

  const [marketplaceHotel, setMarketplaceHotel] = useState(null);
  const [marketplaceRooms, setMarketplaceRooms] = useState([]);
  const [apiLoading, setApiLoading] = useState(true);

  const storeHotel = hotels?.find((h) => h.id === idOrSlug);

  useEffect(() => {
    if (!idOrSlug || storeHotel) {
      setApiLoading(false);
      return;
    }
    Promise.all([
      fetch(`/api/marketplace/hotels/${idOrSlug}`).then((r) => r.json()),
      fetch(`/api/marketplace/hotels/${idOrSlug}/rooms`).then((r) => r.json()),
    ])
      .then(([hRes, rRes]) => {
        setMarketplaceHotel(hRes?.data?.hotel ?? null);
        setMarketplaceRooms(rRes?.data?.rooms ?? []);
      })
      .catch(() => setMarketplaceHotel(null))
      .finally(() => setApiLoading(false));
  }, [idOrSlug, storeHotel]);

  if (storeHotel) {
    const hotel = storeHotel;
    const handleBook = () => {
      setSelectedHotel(hotel);
      router.push('/booking-summary');
    };
    const checkIn = '3:00 PM';
    const checkOut = '11:00 AM';
    const distanceFromAirport = '12 km';
    const contact = '+1 234 567 8900';
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link href="/hotels" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 text-sm">
          <ArrowLeft className="h-4 w-4" /> Back to Hotels
        </Link>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="overflow-hidden mb-6">
            <div className="relative w-full min-h-[280px] md:min-h-[360px]">
              <ImageSlider images={hotel.images || (hotel.image ? [hotel.image] : [])} alt={hotel.name} priority />
            </div>
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-2 mb-2">
                {[...Array(5)].map((_, k) => (
                  <Star key={k} className="h-5 w-5 fill-primary text-primary" />
                ))}
                <span className="text-muted-foreground text-sm">({(hotel.reviewCount || 0).toLocaleString()} reviews)</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{hotel.name}</h1>
              <p className="text-muted-foreground flex items-center gap-1 mb-6">
                <MapPin className="h-5 w-5 shrink-0" /> {hotel.location}
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
                    <p className="font-medium">{contact}</p>
                  </div>
                </div>
              </div>
              <h3 className="font-semibold mb-2 flex items-center gap-2"><Info className="h-4 w-4" /> About</h3>
              <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                {hotel.name} offers a premium stay in {hotel.location} with top-notch service and facilities. Guests enjoy comfortable rooms, on-site dining, and easy access to local attractions.
              </p>
              <h3 className="font-semibold mb-2">Amenities</h3>
              <div className="flex flex-wrap gap-2 mb-6">
                {(hotel.amenities || []).map((a) => {
                  const Icon = amenityIcons[a] || Coffee;
                  return (
                    <span key={a} className="inline-flex items-center gap-2 rounded-xl bg-muted px-3 py-2 text-sm">
                      <Icon className="h-4 w-4" /> {a}
                    </span>
                  );
                })}
              </div>
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border">
                <div>
                  <span className="text-2xl font-bold text-primary">{formatPrice(hotel.pricePerNight)}</span>
                  <span className="text-muted-foreground"> / night</span>
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

  if (apiLoading) return <p className="container py-12 text-center text-muted-foreground">Loading...</p>;
  if (!marketplaceHotel) return (
    <div className="container py-12 text-center">
      <p className="text-muted-foreground">Hotel not found.</p>
      <Link href="/hotels" className="text-primary mt-4 inline-block">← Back to Hotels</Link>
    </div>
  );

  const hotel = marketplaceHotel;
  const rooms = marketplaceRooms;
  const firstImage = hotel.images?.[0];

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="mb-6">
        {firstImage && (
          <div className="relative w-full h-64 rounded-xl overflow-hidden bg-muted mb-4">
            <img src={firstImage} alt={hotel.name} className="w-full h-full object-cover" />
          </div>
        )}
        <h1 className="text-3xl font-bold">{hotel.name}</h1>
        {(hotel.rating > 0 || hotel.starRating) && (
          <p className="flex items-center gap-1 text-amber-600 mt-1">
            <Star className="h-4 w-4 fill-current" />
            {hotel.rating || hotel.starRating} {hotel.starRating && 'stars'}
          </p>
        )}
        {(hotel.address || hotel.city) && (
          <p className="flex items-center gap-2 text-muted-foreground mt-2">
            <MapPin className="h-4 w-4 shrink-0" />
            {[hotel.address, hotel.city, hotel.country].filter(Boolean).join(', ')}
          </p>
        )}
      </div>
      {hotel.description && (
        <Card className="p-6 mb-6">
          <h2 className="font-semibold mb-2">About</h2>
          <p className="text-muted-foreground whitespace-pre-wrap">{hotel.description}</p>
        </Card>
      )}
      {hotel.amenities?.length > 0 && (
        <p className="text-sm text-muted-foreground mb-6">Amenities: {hotel.amenities.join(', ')}</p>
      )}
      <h2 className="text-xl font-semibold mb-4">Rooms</h2>
      <div className="grid gap-4">
        {rooms.map((r) => (
          <Card key={r.id ?? r._id} className="p-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-semibold">{r.title}</p>
              {r.description && <p className="text-sm text-muted-foreground mt-1">{r.description}</p>}
              <p className="text-sm mt-2">Max guests: {r.capacity} · ₹ {r.pricePerNight}/night</p>
            </div>
            <Link href={`/marketplace/hotels/${hotel.id || hotel._id}`}>
              <Button>Book</Button>
            </Link>
          </Card>
        ))}
      </div>
      {rooms.length === 0 && <p className="text-muted-foreground">No rooms available.</p>}
      <p className="mt-8 text-sm text-muted-foreground">
        <Link href="/hotels" className="text-primary underline">← Back to hotels</Link>
      </p>
    </div>
  );
}
