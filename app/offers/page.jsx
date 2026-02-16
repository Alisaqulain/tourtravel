'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Percent, Plane, Building2, MapPin, Ship, Car, ChevronDown, ChevronUp, Calendar, Tag } from 'lucide-react';
import { SectionHeader } from '@/components/ui/section-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const offers = [
  { id: 1, title: 'Flash Sale: Up to 40% off Flights', desc: 'Book by weekend. Travel anytime.', icon: Plane, discount: '40%', type: 'Flights', href: '/flights', validity: 'Valid till 31 Mar 2025', terms: 'Min 2 passengers. Applicable on select routes. T&C apply.', code: 'FLY40', image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800' },
  { id: 2, title: 'Hotel Weekend Getaway', desc: '2 nights at 3-star hotels from ₹7,999.', icon: Building2, discount: '30%', type: 'Hotels', href: '/hotels', validity: 'Fri–Sun bookings only', terms: 'Minimum 2-night stay. Non-refundable rate. Blackout dates may apply.', code: 'STAY30', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800' },
  { id: 3, title: 'Europe Tour Special', desc: '10-day tour with flights included.', icon: MapPin, discount: '25%', type: 'Tours', href: '/tours', validity: 'Departures Apr–Jun 2025', terms: 'Group size 4–15. Flights from select cities. Visa not included.', code: 'EURO25', image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800' },
  { id: 4, title: 'Maldives Package Deal', desc: '5 nights overwater villa + flights.', icon: Building2, discount: '20%', type: 'Packages', href: '/packages', validity: 'Book by 15 Mar 2025', terms: 'All-inclusive. Transfers included. Subject to availability.', code: 'MAL20', image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800' },
  { id: 5, title: 'Bus & Cruise Combos', desc: 'Save on bus + cruise bundles.', icon: Ship, discount: '15%', type: 'Cruise', href: '/cruise', validity: 'Combo bookings only', terms: 'Book bus and cruise together. Limited routes.', code: 'COMBO15', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800' },
  { id: 6, title: 'Premium Car Weekend', desc: 'Luxury rentals at weekend rates.', icon: Car, discount: '20%', type: 'Cars', href: '/cars', validity: 'Fri 12pm – Mon 10am', terms: 'Min 2-day rental. Insurance extra. Select cities.', code: 'CAR20', image: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800' },
];

export default function OffersPage() {
  const [expandedId, setExpandedId] = useState(null);

  return (
    <div className="container mx-auto px-4 py-12">
      <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
        <ArrowLeft className="h-4 w-4" /> Back to Home
      </Link>
      <SectionHeader
        title="Offers & Deals"
        subtitle="Limited-time offers. Grab them before they're gone. Tap View more for details."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {offers.map((offer, i) => (
          <motion.div
            key={offer.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <Card className="overflow-hidden p-0 flex flex-col hover:shadow-card-hover transition-all border border-border">
              <div className="relative h-48 w-full flex-shrink-0">
                <Image
                  src={offer.image}
                  alt={offer.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <span className="rounded-full bg-primary text-primary-foreground text-xs font-bold px-3 py-1">
                    {offer.type}
                  </span>
                  <span className="flex items-center gap-1 rounded-full bg-primary/90 text-primary-foreground text-sm font-bold px-3 py-1">
                    <Percent className="h-4 w-4" /> {offer.discount}
                  </span>
                </div>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-lg font-bold mb-1">{offer.title}</h3>
                <p className="text-muted-foreground text-sm mb-4 flex-1">{offer.desc}</p>
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <Link href={offer.href || '/flights'}>
                    <Button size="sm" className="rounded-xl bg-primary hover:bg-primary/90">
                      View Offer
                    </Button>
                  </Link>
                </div>

                <button
                  type="button"
                  onClick={() => setExpandedId(expandedId === offer.id ? null : offer.id)}
                  className="flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                  {expandedId === offer.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  View more details
                </button>

                <AnimatePresence>
                  {expandedId === offer.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 pt-4 border-t border-border space-y-3 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span><strong className="text-foreground">Validity:</strong> {offer.validity}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Tag className="h-4 w-4" />
                          <span><strong className="text-foreground">Code:</strong> <code className="bg-muted px-2 py-0.5 rounded">{offer.code}</code></span>
                        </div>
                        <p className="text-muted-foreground"><strong className="text-foreground">Terms:</strong> {offer.terms}</p>
                        <Link href={offer.href}>
                          <Button size="sm" className="rounded-xl w-full mt-2 bg-primary hover:bg-primary/90">Book now</Button>
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
