'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { formatPrice } from '@/lib/utils';
import { toast } from '@/lib/toast';

export default function AdminToursPage() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchTours = async () => {
    try {
      const res = await fetch('/api/admin/tours', { credentials: 'include' });
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) setTours(json.data);
      else toast.error(json.message || 'Failed to load');
    } catch (e) {
      toast.error('Failed to load tours');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTours();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/tours/${deleteId}`, { method: 'DELETE', credentials: 'include' });
      const json = await res.json();
      if (json.success) {
        setTours((prev) => prev.filter((t) => (t._id || t.id) !== deleteId));
        setDeleteId(null);
        toast.success('Tour deleted');
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
        <h1 className="text-2xl font-bold">Tours</h1>
        <Link href="/admin/tours/new">
          <Button className="rounded-xl gap-2"><Plus className="h-4 w-4" /> Add Tour</Button>
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
                  <th className="text-left p-4 font-medium">Title</th>
                  <th className="text-left p-4 font-medium">Destination</th>
                  <th className="text-left p-4 font-medium">Duration</th>
                  <th className="text-left p-4 font-medium">Price</th>
                  <th className="text-right p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tours.map((t) => {
                  const id = t._id || t.id;
                  return (
                    <tr key={id} className="border-b border-border last:border-0 hover:bg-muted/30">
                      <td className="p-4">{t.title || t.name || '—'}</td>
                      <td className="p-4">{t.destination || '—'}</td>
                      <td className="p-4">{t.duration || '—'}</td>
                      <td className="p-4">{formatPrice(t.price)}</td>
                      <td className="p-4 text-right">
                        <Link href={`/admin/tours/${id}/edit`}><Button variant="ghost" size="icon" className="rounded-lg"><Pencil className="h-4 w-4" /></Button></Link>
                        <Button variant="ghost" size="icon" className="rounded-lg text-destructive hover:text-destructive" onClick={() => setDeleteId(id)}><Trash2 className="h-4 w-4" /></Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {tours.length === 0 && <div className="p-12 text-center text-muted-foreground">No tours in database. Add one to get started.</div>}
        </Card>
      )}
      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Delete tour?</DialogTitle><DialogDescription>This cannot be undone.</DialogDescription></DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)} className="rounded-xl">Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} className="rounded-xl" disabled={deleting}>{deleting ? 'Deleting...' : 'Delete'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
