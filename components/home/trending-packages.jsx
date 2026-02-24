'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { SectionHeader } from '@/components/ui/section-header';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';
import { useDataStore } from '@/store';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export function TrendingPackages() {
  const swiperRef = useRef(null);
  const packages = useDataStore((s) => s.packages);

  return (
    <section className="py-10 md:py-14 bg-muted/40 border-y border-border">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="Best Packages"
          subtitle="Hand-picked getaways with exclusive deals. Limited time offers."
        />
        <div className="relative">
          <Swiper
            ref={swiperRef}
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            pagination={{ clickable: true }}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            loop
            className="pb-12"
          >
            {packages.map((pkg) => (
              <SwiperSlide key={pkg.id}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8 }}
                  className="h-full"
                >
                  <Link href="/packages">
                    <div className="group relative h-full rounded-2xl overflow-hidden border border-border bg-card shadow-premium hover:shadow-card-hover transition-all duration-300">
                      <div className="relative h-56">
                        <Image
                          src={pkg.image}
                          alt={pkg.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        <span className="absolute top-4 left-4 rounded-full bg-primary px-3 py-1 text-xs font-bold text-white">
                          Save {pkg.discount}%
                        </span>
                        <div className="absolute bottom-4 left-4 right-4 text-white">
                          <h3 className="text-lg font-bold">{pkg.title}</h3>
                          <p className="text-sm text-white/90">{pkg.duration}</p>
                          <div className="flex items-baseline gap-2 mt-2">
                            <span className="text-2xl font-bold">{formatPrice(pkg.price)}</span>
                            <span className="text-sm line-through text-white/70">{formatPrice(pkg.originalPrice)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <Button className="w-full gap-2 rounded-xl group/btn" size="lg">
                          Book Now <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
