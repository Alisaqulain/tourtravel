'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MarketplaceHotelRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/hotel');
  }, [router]);
  return <p className="p-6 text-muted-foreground">Redirecting to hotel portal...</p>;
}
