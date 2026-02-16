'use client';

import { HeroSection } from '@/components/home/hero-section';
import { StatsStrip } from '@/components/home/stats-strip';
import { HotDeals } from '@/components/home/hot-deals';
import { PopularDestinations } from '@/components/home/popular-destinations';
import { TrendingPackages } from '@/components/home/trending-packages';
import { FlightDeals } from '@/components/home/flight-deals';
import { HotelListings } from '@/components/home/hotel-listings';
import { ExploreBus } from '@/components/home/explore-bus';
import { ExploreCruise } from '@/components/home/explore-cruise';
import { ExploreCars } from '@/components/home/explore-cars';
import { BestOffers } from '@/components/home/best-offers';
import { WhyChooseUs } from '@/components/home/why-choose-us';
import { Testimonials } from '@/components/home/testimonials';
import { Newsletter } from '@/components/home/newsletter';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsStrip />
      <HotDeals />
      <PopularDestinations />
      <TrendingPackages />
      <FlightDeals />
      <HotelListings />
      <ExploreBus />
      <ExploreCruise />
      <ExploreCars />
      <BestOffers />
      <WhyChooseUs />
      <Testimonials />
      <Newsletter />
    </>
  );
}
