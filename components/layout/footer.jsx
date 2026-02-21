'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Twitter, Instagram, Linkedin, Smartphone } from 'lucide-react';

const companyLinks = [
  { label: 'About Us', href: '/about' },
  { label: 'Contact Us', href: '/contact' },
  { label: 'Careers', href: '/contact?subject=Careers' },
  { label: 'Press', href: '/contact?subject=Press' },
];

const quickLinks = [
  { label: 'Flights', href: '/flights' },
  { label: 'Hotels', href: '/hotels' },
  { label: 'Tours', href: '/tours' },
  { label: 'Packages', href: '/packages' },
  { label: 'Offers', href: '/offers' },
  { label: 'Wishlist', href: '/wishlist' },
  { label: 'My Bookings', href: '/my-bookings' },
];

const supportLinks = [
  { label: 'Help Center', href: '/contact' },
  { label: 'Contact Us', href: '/contact' },
  { label: 'Payment & Refunds', href: '/cancellation' },
  { label: 'Cancellation Policy', href: '/cancellation' },
  { label: 'Safety', href: '/contact?subject=Safety' },
];

const legalLinks = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
];

const socials = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
];

export function Footer() {
  return (
    <footer className="bg-dark-600 text-white">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12">
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-4 rounded-xl p-3">
              <Image
                src="/images/Trip%20Logo.png"
                alt="Trip to Travel World"
                width={440}
                height={120}
                className="h-28 md:h-32 w-auto object-contain"
              />
            </Link>
            <p className="text-white/80 text-sm max-w-sm mb-6">
              Your trusted travel partner for flights, hotels, and tours. Best prices, 24/7 support, and unforgettable experiences.
            </p>
            <div className="flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"
                >
                  <s.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              {companyLinks.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-white/80 hover:text-white text-sm transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-white/80 hover:text-white text-sm transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              {supportLinks.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-white/80 hover:text-white text-sm transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              {legalLinks.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-white/80 hover:text-white text-sm transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/20 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white/80 text-sm">
            <Smartphone className="h-4 w-4" />
            <span>Download our app: iOS & Android</span>
          </div>
          <p className="text-white/60 text-sm">
            © {new Date().getFullYear()} Trips To Travels. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
