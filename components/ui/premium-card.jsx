'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const PremiumCard = React.forwardRef(
  (
    {
      className,
      hoverScale = true,
      hoverLift = true,
      gradientBorder = false,
      padding = 'default',
      children,
      ...props
    },
    ref
  ) => {
    const Comp = hoverScale || hoverLift ? motion.div : 'div';
    const motionProps =
      hoverScale || hoverLift
        ? {
            initial: { opacity: 0, y: 12 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true, margin: '-40px' },
            whileHover: hoverLift ? { y: -4, transition: { duration: 0.2 } } : undefined,
            transition: { type: 'spring', stiffness: 300, damping: 24 },
          }
        : {};
    return (
      <Comp
        ref={ref}
        className={cn(
          'rounded-2xl border border-border/60 bg-card text-card-foreground overflow-hidden',
          'shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08),0_8px_32px_-8px_rgba(0,0,0,0.04)]',
          'dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.3)]',
          'hover:shadow-[0_12px_40px_-8px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_12px_40px_-8px_rgba(0,0,0,0.4)]',
          gradientBorder && 'ring-1 ring-primary/20',
          padding === 'none' && 'p-0',
          padding === 'sm' && 'p-4',
          padding === 'default' && 'p-6',
          padding === 'lg' && 'p-8',
          className
        )}
        {...motionProps}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);
PremiumCard.displayName = 'PremiumCard';

export { PremiumCard };
