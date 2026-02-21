'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PremiumCard } from '@/components/ui/premium-card';
import { Button } from '@/components/ui/button';

function PricingCard({
  title,
  price,
  period = 'night',
  currency = '₹',
  features = [],
  highlighted = false,
  ctaLabel = 'Select',
  onCta,
  className,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className={cn('h-full', className)}
    >
      <PremiumCard
        className={cn(
          'h-full flex flex-col',
          highlighted && 'ring-2 ring-primary shadow-xl shadow-primary/10'
        )}
        hoverLift={true}
      >
        <div className="p-6 pb-4">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-bold text-foreground">
              {currency}
              {typeof price === 'number' ? price.toLocaleString() : price}
            </span>
            {period && (
              <span className="text-sm text-muted-foreground">/ {period}</span>
            )}
          </div>
        </div>
        <ul className="flex-1 px-6 space-y-2">
          {features.map((f, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
              <Check className="h-4 w-4 text-primary shrink-0" />
              {f}
            </li>
          ))}
        </ul>
        <div className="p-6 pt-4">
          <Button
            className="w-full rounded-xl"
            variant={highlighted ? 'default' : 'outline'}
            onClick={onCta}
          >
            {ctaLabel}
          </Button>
        </div>
      </PremiumCard>
    </motion.div>
  );
}

export { PricingCard };
