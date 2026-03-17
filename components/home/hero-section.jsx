'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Plane, Building2, Train, Bus, Ship, Car, MapPin, Package, Search, Landmark } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FlightSearchWidget } from '@/components/home/flight-search-widget';
import { HotelSearchWidget } from '@/components/home/hotel-search-widget';
import { TrainSearchWidget } from '@/components/home/train-search-widget';
import { BusSearchWidget } from '@/components/home/bus-search-widget';
import { ReligionTourWidget } from '@/components/home/religion-tour-widget';
import { Button } from '@/components/ui/button';

const OTA_YELLOW = '#EAB308';
const OTA_CREAM = '#F5EDE4';

export function HeroSection() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('flights');

  const tabs = [
    { id: 'flights', label: 'Flights', icon: Plane },
    { id: 'hotels', label: 'Hotels', icon: Building2 },
    { id: 'trains', label: 'Trains', icon: Train },
    { id: 'bus', label: 'Bus', icon: Bus },
    { id: 'religion', label: 'Religion Tour', icon: Landmark },
    { id: 'cabs', label: 'Cabs', icon: Car },
  ];

  const HERO_IMAGES = {
    flights: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1920',
    hotels: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1920',
    trains: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=1920',
    bus: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1920',
    religion: 'https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?w=1920',
    cabs: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1920',
  };

  const heroBgImage = HERO_IMAGES[activeTab] || HERO_IMAGES.flights;

  return (
    <section className="relative w-full overflow-hidden min-h-[640px]">
      {/* Background image changes with selected tab: flight / hotel / train / bus / cab */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="absolute inset-0 z-0 hero-bg-image bg-cover bg-center"
        style={{ backgroundImage: `url('${heroBgImage}')` }}
        aria-hidden
      />
      <div
        className="absolute inset-0 z-0"
        style={{
          background: 'linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(234,179,8,0.2) 35%, rgba(255,248,240,0.85) 70%, #FFF8F0 100%)',
        }}
        aria-hidden
      />
      {/* Animated gradient + orbs overlay */}
      <div className="absolute inset-0 z-0 hero-animated-bg opacity-60" aria-hidden />
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden>
        <div
          className="absolute top-[10%] left-[15%] w-64 h-64 rounded-full bg-amber-200/30 blur-3xl"
          style={{ animation: 'hero-float-orb 15s ease-in-out infinite' }}
        />
        <div
          className="absolute top-[30%] right-[10%] w-48 h-48 rounded-full bg-yellow-200/25 blur-3xl"
          style={{ animation: 'hero-float-orb-slow 20s ease-in-out infinite' }}
        />
        <div
          className="absolute bottom-[20%] left-[25%] w-40 h-40 rounded-full bg-amber-100/40 blur-3xl"
          style={{ animation: 'hero-float-orb 18s ease-in-out infinite', animationDelay: '-5s' }}
        />
      </div>

      {/* Full-width yellow top bar - extra bottom padding so subtitle doesn't overlap tab row */}
      <div
        className="relative z-10 w-full pt-4 sm:pt-5 md:pt-6 pb-6 sm:pb-8 md:pb-10"
        style={{ backgroundColor: OTA_YELLOW }}
      >
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary-foreground text-center tracking-tight">
            Domestic and International Flights
          </h1>
          <p className="text-primary-foreground/85 text-center text-sm sm:text-base mt-2 mb-0">
            Book flights, hotels, trains, bus & cab — best prices guaranteed
          </p>
        </div>
      </div>

      {/* Main search card - slight overlap into yellow, but clear of subtitle */}
      <div className="relative z-10 -mt-2 sm:-mt-4 md:-mt-5 px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl">
          {/* Tab pills: Flights | Hotels | Trains | Bus | Cabs - ref style: inactive = beige + orange text, active = orange + white */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-5">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'flex items-center gap-2 rounded-full px-5 sm:px-6 py-3 text-sm font-semibold transition-all shadow-sm',
                    isActive ? 'text-white shadow-md' : 'hover:opacity-90'
                  )}
                  style={{
                    backgroundColor: isActive ? OTA_YELLOW : OTA_CREAM,
                    color: isActive ? '#1c1917' : '#B45309',
                  }}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Big white search card */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="rounded-2xl border border-gray-200 bg-white shadow-2xl shadow-black/10 overflow-hidden"
          >
            {activeTab === 'flights' && (
              <div className="p-6 sm:p-8">
                <p className="text-muted-foreground text-center mb-6">Book domestic & international flights at best prices. Compare and save.</p>
                <FlightSearchWidget hideHeader />
              </div>
            )}

            {activeTab === 'hotels' && (
              <div className="p-6 sm:p-8">
                <p className="text-muted-foreground text-center mb-6">Find the best hotels and stays. Check-in, check-out, and book in one place.</p>
                <HotelSearchWidget />
              </div>
            )}

            {activeTab === 'trains' && (
              <div className="p-6 sm:p-8">
                <p className="text-muted-foreground text-center mb-6">Book train tickets easily. IRCTC and major routes at best fares.</p>
                <TrainSearchWidget />
              </div>
            )}

            {activeTab === 'bus' && (
              <div className="p-6 sm:p-8">
                <p className="text-muted-foreground text-center mb-6">Book bus tickets for intercity travel. Safe, comfortable, best prices.</p>
                <BusSearchWidget />
              </div>
            )}

            {activeTab === 'religion' && (
              <div className="p-6 sm:p-8">
                <p className="text-muted-foreground text-center mb-6">Char Dham Yatra & pilgrimage tours. Search by destination and date.</p>
                <ReligionTourWidget />
              </div>
            )}

            {activeTab === 'cabs' && (
              <div className="p-6 sm:p-8">
                <p className="text-muted-foreground text-center mb-6">Book premium cabs for outstation & local trips. One-way, round-trip, or hourly.</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <div className="flex flex-wrap justify-center gap-3">
                    <span className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">Outstation</span>
                    <span className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">Local</span>
                    <span className="px-4 py-2 rounded-full bg-primary/10 text-sm font-medium text-muted-foreground">Airport transfer</span>
                  </div>
                  <Button
                    size="lg"
                    className="rounded-xl font-bold text-base px-8 h-12 bg-primary hover:bg-primary/90 text-primary-foreground"
                    onClick={() => router.push('/cars')}
                  >
                    <Car className="h-5 w-5 mr-2" /> Explore Premium Cars
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Secondary service nav: Tours | Packages | Cruise | Offers */}
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl mt-8 pb-8">
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
          {[
            { href: '/tours', label: 'Tours', icon: MapPin },
            { href: '/packages', label: 'Packages', icon: Package },
            { href: '/tours?type=pilgrimage', label: 'Pilgrimage & Religion Tours', icon: Landmark },
            { href: '/cruise', label: 'Cruise', icon: Ship },
            { href: '/offers', label: 'Offers', icon: Search },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all hover:opacity-90 shadow-sm"
                style={{ backgroundColor: OTA_CREAM, color: '#B45309' }}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
