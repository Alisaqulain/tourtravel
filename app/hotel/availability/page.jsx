'use client';

import { Card } from '@/components/ui/card';

export default function HotelAvailabilityPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Availability</h1>
      <Card className="p-6">
        <p className="text-muted-foreground mb-4">
          Block dates and set available rooms. Availability is managed per room type. Overbooking is prevented automatically based on total and available room counts.
        </p>
        <p className="text-sm text-muted-foreground">
          Calendar-based availability management can be added here. For now, availability is derived from your room totals and existing bookings.
        </p>
      </Card>
    </div>
  );
}
