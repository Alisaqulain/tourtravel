'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const GlassCard = React.forwardRef(
  (
    {
      className,
      blur = 'xl',
      hover = true,
      border = true,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = hover ? motion.div : 'div';
    const motionProps = hover
      ? {
          whileHover: { scale: 1.01 },
          transition: { type: 'spring', stiffness: 400, damping: 25 },
        }
      : {};
    return (
      <Comp
        ref={ref}
        className={cn(
          'rounded-2xl overflow-hidden',
          'bg-white/70 dark:bg-card/60',
          blur === 'xl' && 'backdrop-blur-xl',
          blur === 'lg' && 'backdrop-blur-lg',
          blur === 'md' && 'backdrop-blur-md',
          border && 'border border-white/20 dark:border-border/50',
          'shadow-lg shadow-black/5 dark:shadow-black/20',
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
GlassCard.displayName = 'GlassCard';

export { GlassCard };
