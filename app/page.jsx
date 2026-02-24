'use client';

import { HeroSection } from '@/components/home/hero-section';
import { PromoBanner } from '@/components/home/promo-banner';
import { TrendingSearches } from '@/components/home/trending-searches';
import { DealsStrip } from '@/components/home/deals-strip';
import { StatsStrip } from '@/components/home/stats-strip';
import { FeaturedCategories } from '@/components/home/featured-categories';
import { HotDeals } from '@/components/home/hot-deals';
import { PopularDestinations } from '@/components/home/popular-destinations';
import { TrendingPackages } from '@/components/home/trending-packages';
import { FlightDeals } from '@/components/home/flight-deals';
import { HotelListings } from '@/components/home/hotel-listings';
import { ExploreBus } from '@/components/home/explore-bus';
import { ExploreTrain } from '@/components/home/explore-train';
import { ExploreCruise } from '@/components/home/explore-cruise';
import { ExploreCars } from '@/components/home/explore-cars';
import { BestOffers } from '@/components/home/best-offers';
import { WhyChooseUs } from '@/components/home/why-choose-us';
import { Testimonials } from '@/components/home/testimonials';
import { CtaStrip } from '@/components/home/cta-strip';
import { Newsletter } from '@/components/home/newsletter';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <PromoBanner />
      <TrendingSearches />
      <DealsStrip />
      <StatsStrip />
      <FeaturedCategories />
      <HotDeals />
      <PopularDestinations />
      <TrendingPackages />
      <FlightDeals />
      <HotelListings />
      <ExploreBus />
      <ExploreTrain />
      <ExploreCruise />
      <ExploreCars />
      <BestOffers />
      <WhyChooseUs />
      <Testimonials />
      <CtaStrip />
      <Newsletter />
    </>
  );
}
