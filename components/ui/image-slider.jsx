'use client';

import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export function ImageSlider({ images, alt = 'Image', className = '', imageClassName = 'object-cover', priority }) {
  const list = Array.isArray(images) && images.length > 0 ? images : [];

  if (list.length === 0) return null;
  if (list.length === 1) {
    return (
      <div className={`relative w-full h-full min-h-[280px] ${className}`}>
        <Image src={list[0]} alt={alt} fill className={imageClassName} priority={priority} sizes="(max-width: 768px) 100vw, 896px" />
      </div>
    );
  }

  return (
    <div className={`relative w-full ${className}`}>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        loop
        className="rounded-xl overflow-hidden"
      >
        {list.map((src, i) => (
          <SwiperSlide key={i}>
            <div className="relative w-full aspect-[16/10] min-h-[280px] md:min-h-[360px]">
              <Image src={src} alt={`${alt} ${i + 1}`} fill className={imageClassName} priority={priority && i === 0} sizes="(max-width: 768px) 100vw, 896px" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
