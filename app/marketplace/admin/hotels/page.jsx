'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2 } from 'lucide-react';

export default function AdminHotelsPage() {
  const searchParams = useSearchParams();
  const statusFilter = searchParams.get('status');
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actioning, setActioning] = useState(null);

  useEffect(() => {
    const url = statusFilter ? `/api/marketplace/admin/hotels?status=${statusFilter}` : '/api/marketplace/admin/hotels';
    fetch(url, { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => setHotels(d?.data?.hotels ?? []))
      .finally(() => setLoading(false));
  }, [statusFilter]);

  const handleAction = async (hotelId, action, rejectionReason) => {
    setActioning(hotelId);
    try {
      const res = await fetch('/api/marketplace/admin/hotel/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ hotelId, action, rejectionReason }),
      });
      const data = await res.json();
      if (data?.success) setHotels((prev) => prev.filter((h) => h._id !== hotelId));
    } finally {
      setActioning(null);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Hotels</h1>
      <div className="flex gap-2 mb-4">
        <a href="/marketplace/admin/hotels">
          <Button variant={!statusFilter ? 'default' : 'outline'} size="sm">All</Button>
        </a>
        <a href="/marketplace/admin/hotels?status=pending_verification">
          <Button variant={statusFilter === 'pending_verification' ? 'default' : 'outline'} size="sm">Pending</Button>
        </a>
        <a href="/marketplace/admin/hotels?status=approved">
          <Button variant={statusFilter === 'approved' ? 'default' : 'outline'} size="sm">Approved</Button>
        </a>
      </div>
      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : (
        <div className="space-y-4">
          {hotels.map((h) => (
            <Card key={h._id} className="p-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Building2 className="h-10 w-10 text-muted-foreground" />
                <div>
                  <p className="font-semibold">{h.name}</p>
                  <p className="text-sm text-muted-foreground">{h.city} · {h.address}</p>
                  <p className="text-xs text-muted-foreground">Owner: {h.owner?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                  h.status === 'approved' ? 'bg-green-100 text-green-800' :
                  h.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {h.status}
                </span>
                {h.status === 'pending_verification' && (
                  <>
                    <Button size="sm" onClick={() => handleAction(h._id, 'approve')} disabled={actioning === h._id}>
                      Approve
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleAction(h._id, 'reject')} disabled={actioning === h._id}>
                      Reject
                    </Button>
                  </>
                )}
              </div>
            </Card>
          ))}
          {hotels.length === 0 && <p className="text-muted-foreground">No hotels found.</p>}
        </div>
      )}
    </div>
  );
}
