'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Plane, Building2, MapPin, Bus, Train, Ship, Car, Calendar, Users, Search } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920',
  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920',
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1920',
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1920',
  'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=1920',
];

export function HeroSection() {
  const router = useRouter();
  const [bgIndex, setBgIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setBgIndex((i) => (i + 1) % HERO_IMAGES.length);
    }, 3000);
    return () => clearInterval(t);
  }, []);
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
  const [busFrom, setBusFrom] = useState('');
  const [busTo, setBusTo] = useState('');
  const [busDate, setBusDate] = useState('');
  const [trainFrom, setTrainFrom] = useState('');
  const [trainTo, setTrainTo] = useState('');
  const [trainDate, setTrainDate] = useState('');
  const [trainClass, setTrainClass] = useState('');
  const [cruiseDestination, setCruiseDestination] = useState('');
  const [cruiseDate, setCruiseDate] = useState('');
  const [carLocation, setCarLocation] = useState('');
  const [carPickup, setCarPickup] = useState('');
  const [carDropoff, setCarDropoff] = useState('');

  const handleSearchFlights = () => router.push('/flights');
  const handleSearchHotels = () => router.push('/hotels');
  const handleSearchTours = () => router.push('/tours');
  const handleSearchBus = () => router.push('/bus');
  const handleSearchTrain = () => router.push('/train');
  const handleSearchCruise = () => router.push('/cruise');
  const handleSearchCars = () => router.push('/cars');

  return (
    <section className="relative min-h-[640px] md:min-h-[720px] flex items-center overflow-hidden">
      {HERO_IMAGES.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-700"
          style={{
            backgroundImage: `url('${src}')`,
            opacity: i === bgIndex ? 1 : 0,
          }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/70" />
      <div className="absolute inset-0 bg-dark/30" />

      <div className="container relative z-10 mx-auto px-4 py-14 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 md:mb-10"
        >
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-3 drop-shadow-lg tracking-tight">
            Where to next?
          </h1>
          <p className="text-base md:text-lg text-white/90 max-w-xl mx-auto">
            Flights, hotels, tours, bus, train, cruise & premium cars — all in one place. Best price guarantee.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="max-w-5xl mx-auto"
        >
          <div className="rounded-2xl border border-white/10 bg-background/95 backdrop-blur-xl shadow-2xl p-4 md:p-6 text-foreground">
            <Tabs defaultValue="flights" className="w-full">
              <TabsList className="flex flex-wrap h-auto gap-1 p-1 rounded-xl bg-muted/50 w-full justify-start overflow-x-auto text-foreground">
                <TabsTrigger value="flights" className="gap-1.5 rounded-lg px-3 py-2 text-sm shrink-0 text-foreground data-[state=active]:text-white">
                  <Plane className="h-4 w-4" /> Flights
                </TabsTrigger>
                <TabsTrigger value="hotels" className="gap-1.5 rounded-lg px-3 py-2 text-sm shrink-0 text-foreground data-[state=active]:text-white">
                  <Building2 className="h-4 w-4" /> Hotels
                </TabsTrigger>
                <TabsTrigger value="tours" className="gap-1.5 rounded-lg px-3 py-2 text-sm shrink-0 text-foreground data-[state=active]:text-white">
                  <MapPin className="h-4 w-4" /> Tours
                </TabsTrigger>
                <TabsTrigger value="bus" className="gap-1.5 rounded-lg px-3 py-2 text-sm shrink-0 text-foreground data-[state=active]:text-white">
                  <Bus className="h-4 w-4" /> Bus
                </TabsTrigger>
                <TabsTrigger value="train" className="gap-1.5 rounded-lg px-3 py-2 text-sm shrink-0 text-foreground data-[state=active]:text-white">
                  <Train className="h-4 w-4" /> Train
                </TabsTrigger>
                <TabsTrigger value="cruise" className="gap-1.5 rounded-lg px-3 py-2 text-sm shrink-0 text-foreground data-[state=active]:text-white">
                  <Ship className="h-4 w-4" /> Cruise
                </TabsTrigger>
                <TabsTrigger value="cars" className="gap-1.5 rounded-lg px-3 py-2 text-sm shrink-0 text-foreground data-[state=active]:text-white">
                  <Car className="h-4 w-4" /> Cars
                </TabsTrigger>
              </TabsList>

              <TabsContent value="flights" className="mt-5 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div>
                    <Label className="text-foreground text-xs font-medium">From</Label>
                    <Input placeholder="City or airport" value={flightFrom} onChange={(e) => setFlightFrom(e.target.value)} className="mt-1 rounded-xl h-11" />
                  </div>
                  <div>
                    <Label className="text-foreground text-xs font-medium">To</Label>
                    <Input placeholder="City or airport" value={flightTo} onChange={(e) => setFlightTo(e.target.value)} className="mt-1 rounded-xl h-11" />
                  </div>
                  <div>
                    <Label className="text-foreground text-xs font-medium">Departure</Label>
                    <Input type="date" value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} className="mt-1 rounded-xl h-11" />
                  </div>
                  <div>
                    <Label className="text-foreground text-xs font-medium">Return</Label>
                    <Input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} className="mt-1 rounded-xl h-11" />
                  </div>
                  <div>
                    <Label className="text-foreground text-xs font-medium">Travelers</Label>
                    <Input type="number" min={1} value={travelers} onChange={(e) => setTravelers(Number(e.target.value))} className="mt-1 rounded-xl h-11" />
                  </div>
                </div>
                <Button size="lg" className="rounded-xl gap-2 bg-primary hover:bg-primary/90" onClick={handleSearchFlights}>
                  <Search className="h-5 w-5" /> Search Flights
                </Button>
              </TabsContent>

              <TabsContent value="hotels" className="mt-5 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <Label className="text-foreground text-xs font-medium">Where</Label>
                    <Input placeholder="City or destination" value={hotelCity} onChange={(e) => setHotelCity(e.target.value)} className="mt-1 rounded-xl h-11" />
                  </div>
                  <div>
                    <Label className="text-foreground text-xs font-medium">Check-in</Label>
                    <Input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="mt-1 rounded-xl h-11" />
                  </div>
                  <div>
                    <Label className="text-foreground text-xs font-medium">Check-out</Label>
                    <Input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="mt-1 rounded-xl h-11" />
                  </div>
                  <div>
                    <Label className="text-foreground text-xs font-medium">Guests</Label>
                    <Input type="number" min={1} value={guests} onChange={(e) => setGuests(Number(e.target.value))} className="mt-1 rounded-xl h-11" />
                  </div>
                </div>
                <Button size="lg" className="rounded-xl gap-2 bg-primary hover:bg-primary/90" onClick={handleSearchHotels}>
                  <Search className="h-5 w-5" /> Search Hotels
                </Button>
              </TabsContent>

              <TabsContent value="tours" className="mt-5 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-foreground text-xs font-medium">Destination</Label>
                    <Input placeholder="Where do you want to go?" value={tourDestination} onChange={(e) => setTourDestination(e.target.value)} className="mt-1 rounded-xl h-11" />
                  </div>
                  <div>
                    <Label className="text-foreground text-xs font-medium">Duration</Label>
                    <Input placeholder="e.g. 7 days" value={duration} onChange={(e) => setDuration(e.target.value)} className="mt-1 rounded-xl h-11" />
                  </div>
                  <div>
                    <Label className="text-foreground text-xs font-medium">Budget (USD)</Label>
                    <Input placeholder="Max budget" value={budget} onChange={(e) => setBudget(e.target.value)} className="mt-1 rounded-xl h-11" />
                  </div>
                </div>
                <Button size="lg" className="rounded-xl gap-2 bg-primary hover:bg-primary/90" onClick={handleSearchTours}>
                  <Search className="h-5 w-5" /> Search Tours
                </Button>
              </TabsContent>

              <TabsContent value="bus" className="mt-5 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-foreground text-xs font-medium">From</Label>
                    <Input placeholder="City or station" value={busFrom} onChange={(e) => setBusFrom(e.target.value)} className="mt-1 rounded-xl h-11" />
                  </div>
                  <div>
                    <Label className="text-foreground text-xs font-medium">To</Label>
                    <Input placeholder="City or station" value={busTo} onChange={(e) => setBusTo(e.target.value)} className="mt-1 rounded-xl h-11" />
                  </div>
                  <div>
                    <Label className="text-foreground text-xs font-medium">Date</Label>
                    <Input type="date" value={busDate} onChange={(e) => setBusDate(e.target.value)} className="mt-1 rounded-xl h-11" />
                  </div>
                </div>
                <Button size="lg" className="rounded-xl gap-2 bg-primary hover:bg-primary/90" onClick={handleSearchBus}>
                  <Search className="h-5 w-5" /> Search Bus
                </Button>
              </TabsContent>

              <TabsContent value="train" className="mt-5 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <Label className="text-foreground text-xs font-medium">From</Label>
                    <Input placeholder="Station or city" value={trainFrom} onChange={(e) => setTrainFrom(e.target.value)} className="mt-1 rounded-xl h-11" />
                  </div>
                  <div>
                    <Label className="text-foreground text-xs font-medium">To</Label>
                    <Input placeholder="Station or city" value={trainTo} onChange={(e) => setTrainTo(e.target.value)} className="mt-1 rounded-xl h-11" />
                  </div>
                  <div>
                    <Label className="text-foreground text-xs font-medium">Date</Label>
                    <Input type="date" value={trainDate} onChange={(e) => setTrainDate(e.target.value)} className="mt-1 rounded-xl h-11" />
                  </div>
                  <div>
                    <Label className="text-foreground text-xs font-medium">Class</Label>
                    <select value={trainClass} onChange={(e) => setTrainClass(e.target.value)} className="mt-1 w-full rounded-xl border border-input bg-background h-11 px-3 text-sm">
                      <option value="">Any</option>
                      <option value="AC 1 Tier">AC 1 Tier</option>
                      <option value="AC 2 Tier">AC 2 Tier</option>
                      <option value="AC 3 Tier">AC 3 Tier</option>
                      <option value="AC Chair Car">AC Chair Car</option>
                      <option value="Sleeper">Sleeper</option>
                    </select>
                  </div>
                </div>
                <Button size="lg" className="rounded-xl gap-2 bg-primary hover:bg-primary/90" onClick={handleSearchTrain}>
                  <Search className="h-5 w-5" /> Search Trains
                </Button>
              </TabsContent>

              <TabsContent value="cruise" className="mt-5 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-foreground text-xs font-medium">Destination / Route</Label>
                    <Input placeholder="e.g. Caribbean, Mediterranean" value={cruiseDestination} onChange={(e) => setCruiseDestination(e.target.value)} className="mt-1 rounded-xl h-11" />
                  </div>
                  <div>
                    <Label className="text-foreground text-xs font-medium">Departure date</Label>
                    <Input type="date" value={cruiseDate} onChange={(e) => setCruiseDate(e.target.value)} className="mt-1 rounded-xl h-11" />
                  </div>
                </div>
                <Button size="lg" className="rounded-xl gap-2 bg-primary hover:bg-primary/90" onClick={handleSearchCruise}>
                  <Search className="h-5 w-5" /> Search Cruises
                </Button>
              </TabsContent>

              <TabsContent value="cars" className="mt-5 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-foreground text-xs font-medium">Pick-up location</Label>
                    <Input placeholder="City or airport" value={carLocation} onChange={(e) => setCarLocation(e.target.value)} className="mt-1 rounded-xl h-11" />
                  </div>
                  <div>
                    <Label className="text-foreground text-xs font-medium">Pick-up date</Label>
                    <Input type="date" value={carPickup} onChange={(e) => setCarPickup(e.target.value)} className="mt-1 rounded-xl h-11" />
                  </div>
                  <div>
                    <Label className="text-foreground text-xs font-medium">Drop-off date</Label>
                    <Input type="date" value={carDropoff} onChange={(e) => setCarDropoff(e.target.value)} className="mt-1 rounded-xl h-11" />
                  </div>
                </div>
                <Button size="lg" className="rounded-xl gap-2 bg-primary hover:bg-primary/90" onClick={handleSearchCars}>
                  <Search className="h-5 w-5" /> Search Premium Cars
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
