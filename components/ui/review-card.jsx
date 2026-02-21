'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

function StarRating({ value, max = 5, size = 'sm', className }) {
  const s = size === 'lg' ? 'h-5 w-5' : 'h-4 w-4';
  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            s,
            i < Math.floor(value) ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/40'
          )}
        />
      ))}
    </div>
  );
}

function ReviewCard({
  name,
  rating,
  comment,
  date,
  avatar,
  className,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={cn(
        'rounded-xl border border-border/60 bg-card p-5',
        className
      )}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-sm font-semibold text-foreground overflow-hidden">
          {avatar ? (
            <img src={avatar} alt="" className="h-full w-full object-cover" />
          ) : (
            (name || 'U').charAt(0).toUpperCase()
          )}
        </div>
        <div>
          <p className="font-medium text-foreground text-sm">{name || 'Guest'}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <StarRating value={rating} />
            {date && (
              <span className="text-xs text-muted-foreground">{date}</span>
            )}
          </div>
        </div>
      </div>
      {comment && (
        <p className="text-sm text-muted-foreground leading-relaxed">{comment}</p>
      )}
    </motion.div>
  );
}

export { StarRating, ReviewCard };
