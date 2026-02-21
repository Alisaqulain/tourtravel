'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

function FeatureCard({
  icon: Icon,
  title,
  description,
  className,
  delay = 0,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 24,
        delay: delay * 0.05,
      }}
      className={cn(
        'rounded-2xl border border-border/60 bg-card p-6 text-center',
        'hover:shadow-lg hover:border-primary/20 transition-all',
        className
      )}
    >
      {Icon && (
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-7 w-7" />
        </div>
      )}
      <h3 className="text-base font-semibold text-foreground mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </motion.div>
  );
}

export { FeatureCard };
