'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HotelDetailsPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/marketplace/hotel/register');
  }, [router]);
  return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <Link href="/marketplace/hotel/register"><Button>Go to Hotel Registration</Button></Link>
    </div>
  );
}
