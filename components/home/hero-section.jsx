'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Plane, Building2, MapPin, Calendar, Users, Search } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  const router = useRouter();
  const [flightFrom, setFlightFrom] = useState('');
  const [flightTo, setFlightTo] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [travelers, setTravelers] = useState(1);
  const [hotelCity, setHotelCity] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [tourDestination, setTourDestination] = useState('');
  const [duration, setDuration] = useState('');
  const [budget, setBudget] = useState('');

  const handleSearchFlights = () => router.push('/flights');
  const handleSearchHotels = () => router.push('/hotels');
  const handleSearchTours = () => router.push('/tours');

  return (
    <section className="relative min-h-[600px] md:min-h-[700px] flex items-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920')`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute inset-0 bg-dark/40" />

      <div className="container relative z-10 mx-auto px-4 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            Explore the World with{' '}
            <span className="text-primary-300">Trips To Travels</span>
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            Book flights, hotels, and tours in one place. Best prices guaranteed.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <div className="glass-card rounded-2xl p-4 md:p-6 shadow-premium">
            <Tabs defaultValue="flights" className="w-full">
              <TabsList className="grid w-full grid-cols-3 h-12 md:h-14 rounded-xl bg-muted/50 p-1">
                <TabsTrigger value="flights" className="gap-2 rounded-xl">
                  <Plane className="h-4 w-4" /> Flights
                </TabsTrigger>
                <TabsTrigger value="hotels" className="gap-2 rounded-xl">
                  <Building2 className="h-4 w-4" /> Hotels
                </TabsTrigger>
                <TabsTrigger value="tours" className="gap-2 rounded-xl">
                  <MapPin className="h-4 w-4" /> Tours
                </TabsTrigger>
              </TabsList>

              <TabsContent value="flights" className="mt-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div>
                    <Label className="text-muted-foreground">From</Label>
                    <Input placeholder="City or airport" value={flightFrom} onChange={(e) => setFlightFrom(e.target.value)} className="mt-1" />
                  </div>
                  <div>
                    <Label className="text-muted-foreground">To</Label>
                    <Input placeholder="City or airport" value={flightTo} onChange={(e) => setFlightTo(e.target.value)} className="mt-1" />
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Departure</Label>
                    <Input type="date" value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} className="mt-1" />
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Return</Label>
                    <Input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} className="mt-1" />
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Travelers</Label>
                    <Input type="number" min={1} value={travelers} onChange={(e) => setTravelers(Number(e.target.value))} className="mt-1" />
                  </div>
                </div>
                <Button size="lg" className="w-full md:w-auto gap-2 rounded-xl" onClick={handleSearchFlights}>
                  <Search className="h-5 w-5" /> Search Flights
                </Button>
              </TabsContent>

              <TabsContent value="hotels" className="mt-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <Label className="text-muted-foreground">City</Label>
                    <Input placeholder="Where are you going?" value={hotelCity} onChange={(e) => setHotelCity(e.target.value)} className="mt-1" />
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Check-in</Label>
                    <Input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="mt-1" />
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Check-out</Label>
                    <Input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="mt-1" />
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Guests</Label>
                    <Input type="number" min={1} value={guests} onChange={(e) => setGuests(Number(e.target.value))} className="mt-1" />
                  </div>
                </div>
                <Button size="lg" className="w-full md:w-auto gap-2 rounded-xl" onClick={handleSearchHotels}>
                  <Search className="h-5 w-5" /> Search Hotels
                </Button>
              </TabsContent>

              <TabsContent value="tours" className="mt-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Destination</Label>
                    <Input placeholder="Where do you want to go?" value={tourDestination} onChange={(e) => setTourDestination(e.target.value)} className="mt-1" />
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Duration</Label>
                    <Input placeholder="e.g. 7 days" value={duration} onChange={(e) => setDuration(e.target.value)} className="mt-1" />
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Budget</Label>
                    <Input placeholder="Max budget (USD)" value={budget} onChange={(e) => setBudget(e.target.value)} className="mt-1" />
                  </div>
                </div>
                <Button size="lg" className="w-full md:w-auto gap-2 rounded-xl" onClick={handleSearchTours}>
                  <Search className="h-5 w-5" /> Search Tours
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
