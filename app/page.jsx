'use client';

import { HeroSection } from '@/components/home/hero-section';
import { PopularDestinations } from '@/components/home/popular-destinations';
import { TrendingPackages } from '@/components/home/trending-packages';
import { FlightDeals } from '@/components/home/flight-deals';
import { HotelListings } from '@/components/home/hotel-listings';
import { WhyChooseUs } from '@/components/home/why-choose-us';
import { Testimonials } from '@/components/home/testimonials';
import { Newsletter } from '@/components/home/newsletter';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <PopularDestinations />
      <TrendingPackages />
      <FlightDeals />
      <HotelListings />
      <WhyChooseUs />
      <Testimonials />
      <Newsletter />
    </>
  );
}
