'use client';

import { Card } from '@/components/ui/card';

export default function HotelSettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <Card className="p-6 max-w-lg">
        <p className="text-muted-foreground">Account and notification settings can be configured here.</p>
      </Card>
    </div>
  );
}
