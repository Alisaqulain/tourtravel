'use client';

import Link from 'next/link';
import { Plane, Facebook, Twitter, Instagram, Linkedin, Smartphone } from 'lucide-react';

const companyLinks = [
  { label: 'About Us', href: '#' },
  { label: 'Careers', href: '#' },
  { label: 'Press', href: '#' },
  { label: 'Blog', href: '#' },
];

const quickLinks = [
  { label: 'Flights', href: '/flights' },
  { label: 'Hotels', href: '/hotels' },
  { label: 'Tours', href: '/tours' },
  { label: 'Packages', href: '/packages' },
  { label: 'Offers', href: '/offers' },
];

const supportLinks = [
  { label: 'Help Center', href: '#' },
  { label: 'Contact Us', href: '#' },
  { label: 'Cancellation', href: '#' },
  { label: 'Safety', href: '#' },
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                <Plane className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">Trips To Travels</span>
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
