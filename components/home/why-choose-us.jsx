'use client';

import { motion } from 'framer-motion';
import { Shield, BadgeCheck, Headphones, Zap } from 'lucide-react';
import { SectionHeader } from '@/components/ui/section-header';

const features = [
  {
    icon: Shield,
    title: 'Secure Booking',
    description: 'Your payment and personal data are protected with industry-leading encryption.',
  },
  {
    icon: BadgeCheck,
    title: 'Best Price Guarantee',
    description: 'Found a lower price? We will match it and give you extra credit on your next trip.',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description: 'Our travel experts are available around the clock to assist you anywhere in the world.',
  },
  {
    icon: Zap,
    title: 'Instant Confirmation',
    description: 'Get your booking confirmation and e-tickets within minutes of completing payment.',
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="Why Choose Us"
          subtitle="We are committed to making your travel experience seamless and memorable."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              className="rounded-2xl border border-border bg-card p-6 shadow-premium hover:shadow-card-hover transition-shadow"
            >
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/20 to-dark-600/20 flex items-center justify-center mb-4">
                {(() => {
                  const Icon = feature.icon;
                  return <Icon className="h-7 w-7 text-primary" />;
                })()}
              </div>
              <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
