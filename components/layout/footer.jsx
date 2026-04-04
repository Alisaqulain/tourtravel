'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const COMPANY_NAME = 'Triptotravels';
const COPYRIGHT_LINE = 'Triptotravels India Event & Holidays Services';

const companyLinks = [
  { label: 'About Us', href: '/about-us' },
  { label: 'Contact Us', href: '/contact-us' },
  { label: 'Careers', href: '/contact?subject=Careers' },
  { label: 'Press', href: '/contact?subject=Press' },
];

const supportLinks = [
  { label: 'Help Center', href: '/contact-us' },
  { label: 'Contact Us', href: '/contact-us' },
  { label: 'Refund Policy', href: '/refund-policy' },
  { label: 'Cancellation Policy', href: '/cancellation-policy' },
  { label: 'Safety', href: '/contact?subject=Safety' },
];

const legalLinks = [
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms & Conditions', href: '/terms-and-conditions' },
  { label: 'Refund Policy', href: '/refund-policy' },
  { label: 'Cancellation Policy', href: '/cancellation-policy' },
  { label: 'Disclaimer', href: '/disclaimer' },
];

const servicesLinks = [
  { label: 'Flights', href: '/flights' },
  { label: 'Hotels', href: '/hotels' },
  { label: 'Trains', href: '/train' },
  { label: 'Packages', href: '/packages' },
  { label: 'Tours', href: '/tours' },
  { label: 'Bus', href: '/bus' },
  { label: 'Offers', href: '/offers' },
  { label: 'My Bookings', href: '/my-bookings' },
];

const socials = [
  {
    icon: Facebook,
    href: 'https://www.facebook.com/share/17A2xow8J5/',
    label: 'Facebook',
  },
  { icon: Twitter, href: '#', label: 'Twitter' },
  {
    icon: Instagram,
    href: 'https://www.instagram.com/triptotravels.in?utm_source=qr&igsh=OTFlbHhzMHE1MXZk',
    label: 'Instagram',
  },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
];

export function Footer() {
  return (
    <footer className="bg-slate-800 dark:bg-dark-600 text-white border-t border-amber-500/20">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-10">
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-4 rounded-xl p-2" aria-label="Home">
              <Image
                src="/images/updatelogo.png"
                alt={COMPANY_NAME}
                width={280}
                height={80}
                className="h-24 md:h-28 w-auto object-contain"
              />
            </Link>
            <p className="text-white/80 text-sm max-w-sm mb-4">
              Your trusted travel partner for flights, hotels, trains, and packages. Best prices, 24/7 support.
            </p>
            <p className="text-white/70 text-xs mb-4">Powered by Affiliate Partners</p>
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
            <h4 className="font-semibold mb-4 text-white">Company</h4>
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
            <h4 className="font-semibold mb-4 text-white">Support</h4>
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
            <h4 className="font-semibold mb-4 text-white">Legal</h4>
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
          <div>
            <h4 className="font-semibold mb-4 text-white">Services</h4>
            <ul className="space-y-2">
              {servicesLinks.map((l) => (
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
          <p className="text-white/60 text-sm text-center md:text-left">
            © {new Date().getFullYear()} {COPYRIGHT_LINE}. All rights reserved.
          </p>
          <p className="text-white/50 text-xs">Powered by Affiliate Partners</p>
        </div>
      </div>
    </footer>
  );
}
