'use client';

import Link from 'next/link';
import { Tag } from 'lucide-react';

/**
 * Compact promo banner for listing pages (flights, hotels, etc.). Not a slider – single message per page.
 */
export function PagePromoBanner({ message, code, href = '#' }) {
  if (!message) return null;
  return (
    <div className="rounded-xl bg-primary/10 border border-primary/20 py-2.5 px-4 mb-6">
      <Link
        href={href}
        className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
      >
        <Tag className="h-4 w-4 text-primary shrink-0" />
        <span>{message}</span>
        {code && <span className="text-primary font-semibold">· {code}</span>}
      </Link>
    </div>
  );
}
