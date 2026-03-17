'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function AdminPayoutsPage() {
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actioning, setActioning] = useState(null);

  useEffect(() => {
    fetch('/api/marketplace/admin/payouts', { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => setPayouts(d?.data?.payouts ?? []))
      .finally(() => setLoading(false));
  }, []);

  const handleApprove = async (id) => {
    setActioning(id);
    try {
      const res = await fetch('/api/marketplace/admin/payout/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ payoutId: id, action: 'approve' }),
      });
      const data = await res.json();
      if (data?.success) setPayouts((prev) => prev.map((p) => (p._id === id ? { ...p, status: 'approved' } : p)));
    } finally {
      setActioning(null);
    }
  };

  const handleReject = async (id) => {
    setActioning(id);
    try {
      const res = await fetch('/api/marketplace/admin/payout/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ payoutId: id, action: 'reject' }),
      });
      const data = await res.json();
      if (data?.success) setPayouts((prev) => prev.filter((p) => p._id !== id));
    } finally {
      setActioning(null);
    }
  };

  const handleMarkPaid = async (id) => {
    setActioning(id);
    try {
      const res = await fetch('/api/marketplace/admin/payout/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ payoutId: id }),
      });
      const data = await res.json();
      if (data?.success) setPayouts((prev) => prev.map((p) => (p._id === id ? { ...p, status: 'paid' } : p)));
    } finally {
      setActioning(null);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Payout Requests</h1>
      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : (
        <Card className="overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="text-left p-4 font-semibold">Hotel</th>
                <th className="text-left p-4 font-semibold">Amount</th>
                <th className="text-left p-4 font-semibold">Request Date</th>
                <th className="text-left p-4 font-semibold">Status</th>
                <th className="text-left p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {payouts.map((p) => (
                <tr key={p._id} className="border-b last:border-0">
                  <td className="p-4">{p.hotelName ?? p.hotelId?.name ?? '—'}</td>
                  <td className="p-4">₹ {Number(p.amount).toLocaleString()}</td>
                  <td className="p-4">{p.requestDate ? new Date(p.requestDate).toLocaleDateString() : '—'}</td>
                  <td className="p-4">
                    <span className={`rounded-full px-2 py-1 text-xs ${
                      p.status === 'paid' ? 'bg-green-100' : p.status === 'rejected' ? 'bg-red-100' : 'bg-amber-100'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="p-4 flex gap-2">
                    {p.status === 'pending' && (
                      <>
                        <Button size="sm" onClick={() => handleApprove(p._id)} disabled={actioning === p._id}>Approve</Button>
                        <Button size="sm" variant="destructive" onClick={() => handleReject(p._id)} disabled={actioning === p._id}>Reject</Button>
                      </>
                    )}
                    {p.status === 'approved' && (
                      <Button size="sm" onClick={() => handleMarkPaid(p._id)} disabled={actioning === p._id}>Mark as Paid</Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {payouts.length === 0 && <div className="p-8 text-center text-muted-foreground">No payout requests.</div>}
        </Card>
      )}
    </div>
  );
}
