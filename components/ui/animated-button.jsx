'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const AnimatedButton = React.forwardRef(
  (
    {
      className,
      children,
      variant = 'default',
      size = 'default',
      loading = false,
      icon: Icon,
      iconPosition = 'left',
      ...props
    },
    ref
  ) => {
    const base =
      'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
    const variants = {
      default:
        'bg-primary text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:bg-primary/90',
      secondary: 'bg-muted text-foreground hover:bg-muted/80',
      outline: 'border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-white',
      ghost: 'hover:bg-muted',
    };
    const sizes = {
      sm: 'h-9 px-4 text-sm',
      default: 'h-11 px-6 text-sm',
      lg: 'h-12 px-8 text-base',
      icon: 'h-10 w-10',
    };
    return (
      <motion.button
        ref={ref}
        type="button"
        className={cn(base, variants[variant], sizes[size], className)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading ? (
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
            className="h-4 w-4 rounded-full border-2 border-current border-t-transparent"
          />
        ) : (
          <>
            {Icon && iconPosition === 'left' && <Icon className="h-4 w-4 shrink-0" />}
            {children}
            {Icon && iconPosition === 'right' && <Icon className="h-4 w-4 shrink-0" />}
          </>
        )}
      </motion.button>
    );
  }
);
AnimatedButton.displayName = 'AnimatedButton';

export { AnimatedButton };
