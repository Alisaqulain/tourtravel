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
import { CharDhamOfferSection } from '@/components/home/chardham-offer-section';
import { CharDhamOfferPopup } from '@/components/home/chardham-offer-popup';
import { BestOffers } from '@/components/home/best-offers';
import { WhyChooseUs } from '@/components/home/why-choose-us';
import { TrustBadges } from '@/components/home/trust-badges';
import { Testimonials } from '@/components/home/testimonials';
import { CtaStrip } from '@/components/home/cta-strip';
import { Newsletter } from '@/components/home/newsletter';

export default function HomePage() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: '#FFF8F0' }}>
      {/* Hero: full-width OTA style with big search (Goibibo / MakeMyTrip style) */}
      <HeroSection />

      {/* Main content: single column */}
      <div className="w-full">
        <PromoBanner />
        <TrendingSearches />
        <DealsStrip />
        <StatsStrip />
        <section className="py-10 md:py-14 lg:py-16 bg-muted/30">
          <FeaturedCategories />
        </section>
        <HotDeals />
        <PopularDestinations />
        <TrendingPackages />
        <CharDhamOfferSection />
        <FlightDeals />
        <HotelListings />
        <ExploreBus />
        <ExploreTrain />
        <ExploreCruise />
        <ExploreCars />
        <BestOffers />
        <WhyChooseUs />
        <TrustBadges />
        <Testimonials />
        <CtaStrip />
        <Newsletter />
      </div>
      <CharDhamOfferPopup />
    </main>
  );
}
