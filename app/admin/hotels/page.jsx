'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { formatPrice } from '@/lib/utils';
import { toast } from '@/lib/toast';

export default function AdminHotelsPage() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchHotels = async () => {
    try {
      const res = await fetch('/api/admin/hotels', { credentials: 'include' });
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) setHotels(json.data);
      else toast.error(json.message || 'Failed to load');
    } catch (e) {
      toast.error('Failed to load hotels');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/hotels/${deleteId}`, { method: 'DELETE', credentials: 'include' });
      const json = await res.json();
      if (json.success) {
        setHotels((prev) => prev.filter((h) => (h._id || h.id) !== deleteId));
        setDeleteId(null);
        toast.success('Hotel deleted');
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
        <h1 className="text-2xl font-bold">Hotels</h1>
        <Link href="/admin/hotels/new">
          <Button className="rounded-xl gap-2"><Plus className="h-4 w-4" /> Add Hotel</Button>
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
                  <th className="text-left p-4 font-medium">Name</th>
                  <th className="text-left p-4 font-medium">Location</th>
                  <th className="text-left p-4 font-medium">Price/night</th>
                  <th className="text-right p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {hotels.map((h) => {
                  const id = h._id || h.id;
                  return (
                    <tr key={id} className="border-b border-border last:border-0 hover:bg-muted/30">
                      <td className="p-4">{h.name || '—'}</td>
                      <td className="p-4">{h.location || h.city || '—'}</td>
                      <td className="p-4">{formatPrice(h.pricePerNight ?? h.price)}</td>
                      <td className="p-4 text-right">
                        <Link href={`/admin/hotels/${id}/edit`}><Button variant="ghost" size="icon" className="rounded-lg"><Pencil className="h-4 w-4" /></Button></Link>
                        <Button variant="ghost" size="icon" className="rounded-lg text-destructive hover:text-destructive" onClick={() => setDeleteId(id)}><Trash2 className="h-4 w-4" /></Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {hotels.length === 0 && <div className="p-12 text-center text-muted-foreground">No hotels in database. Add one to get started.</div>}
        </Card>
      )}
      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Delete hotel?</DialogTitle><DialogDescription>This cannot be undone.</DialogDescription></DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)} className="rounded-xl">Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} className="rounded-xl" disabled={deleting}>{deleting ? 'Deleting...' : 'Delete'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
