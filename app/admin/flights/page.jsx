'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { formatPrice } from '@/lib/utils';
import { toast } from '@/lib/toast';

export default function AdminFlightsPage() {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchFlights = async () => {
    try {
      const res = await fetch('/api/admin/flights', { credentials: 'include' });
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) setFlights(json.data);
      else toast.error(json.message || 'Failed to load');
    } catch (e) {
      toast.error('Failed to load flights');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlights();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/flights/${deleteId}`, { method: 'DELETE', credentials: 'include' });
      const json = await res.json();
      if (json.success) {
        setFlights((prev) => prev.filter((f) => (f._id || f.id) !== deleteId));
        setDeleteId(null);
        toast.success('Flight deleted');
      } else toast.error(json.message || 'Delete failed');
    } catch {
      toast.error('Delete failed');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <Link href="/admin" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 text-sm">
        <ArrowLeft className="h-4 w-4" /> Dashboard
      </Link>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Flights</h1>
        <Link href="/admin/flights/new">
          <Button className="rounded-xl gap-2">
            <Plus className="h-4 w-4" /> Add Flight
          </Button>
        </Link>
      </div>

      {loading ? (
        <Card className="p-12 text-center text-muted-foreground">Loading...</Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-medium">Airline</th>
                  <th className="text-left p-4 font-medium">Route</th>
                  <th className="text-left p-4 font-medium">Time</th>
                  <th className="text-left p-4 font-medium">Price</th>
                  <th className="text-right p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {flights.map((f) => {
                  const id = f._id || f.id;
                  const from = f.from || f.departureAirport || '—';
                  const to = f.to || f.arrivalAirport || '—';
                  const dep = f.departure || f.departureTime || '—';
                  const arr = f.arrival || f.arrivalTime || '—';
                  return (
                    <tr key={id} className="border-b border-border last:border-0 hover:bg-muted/30">
                      <td className="p-4">{f.airline || '—'}</td>
                      <td className="p-4">{from} → {to}</td>
                      <td className="p-4">{dep} - {arr}</td>
                      <td className="p-4">{formatPrice(f.price)}</td>
                      <td className="p-4 text-right">
                        <Link href={`/admin/flights/${id}/edit`}>
                          <Button variant="ghost" size="icon" className="rounded-lg">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button variant="ghost" size="icon" className="rounded-lg text-destructive hover:text-destructive" onClick={() => setDeleteId(id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {flights.length === 0 && <div className="p-12 text-center text-muted-foreground">No flights in database. Add one to get started.</div>}
        </Card>
      )}

      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete flight?</DialogTitle>
            <DialogDescription>This cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)} className="rounded-xl">Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} className="rounded-xl" disabled={deleting}>{deleting ? 'Deleting...' : 'Delete'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
