'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const GradientButton = React.forwardRef(
  ({ className, children, variant = 'primary', size = 'default', ...props }, ref) => {
    const variants = {
      primary:
        'bg-gradient-to-r from-primary via-primary to-primary/90 text-white shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:opacity-95',
      secondary:
        'bg-gradient-to-r from-primary/80 to-primary/60 text-white hover:from-primary hover:to-primary/80',
      success:
        'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40',
      premium:
        'bg-gradient-to-r from-amber-500 via-orange-500 to-primary text-white shadow-lg shadow-orange-500/25',
    };
    const sizes = {
      sm: 'h-9 px-4 text-sm rounded-lg',
      default: 'h-11 px-6 text-sm rounded-xl',
      lg: 'h-12 px-8 text-base rounded-xl',
    };
    return (
      <motion.button
        ref={ref}
        type="button"
        className={cn(
          'inline-flex items-center justify-center gap-2 font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
          variants[variant],
          sizes[size],
          className
        )}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);
GradientButton.displayName = 'GradientButton';

export { GradientButton };
