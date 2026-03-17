'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2, ArrowLeft, Mountain, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { formatPrice } from '@/lib/utils';
import { toast } from '@/lib/toast';

export default function AdminCharDhamPackagesPage() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const fetchPackages = async () => {
    try {
      const res = await fetch('/api/admin/chardham/packages', { credentials: 'include' });
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) setPackages(json.data);
      else toast.error(json.message || 'Failed to load');
    } catch (e) {
      toast.error('Failed to load packages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const seedDefaults = async () => {
    setSeeding(true);
    try {
      const res = await fetch('/api/admin/chardham/seed', { method: 'POST', credentials: 'include' });
      const json = await res.json();
      if (json?.success) {
        const created = json?.data?.created ?? 0;
        toast.success(created > 0 ? `Added ${created} packages` : (json?.data?.message || 'Already seeded'));
        setLoading(true);
        await fetchPackages();
      } else {
        toast.error(json?.message || 'Failed to add packages');
      }
    } catch (e) {
      toast.error('Failed to add packages');
    } finally {
      setSeeding(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/chardham/packages/${deleteId}`, { method: 'DELETE', credentials: 'include' });
      const json = await res.json();
      if (json.success) {
        setPackages((prev) => prev.filter((p) => (p._id || p.id) !== deleteId));
        setDeleteId(null);
        toast.success('Package deleted');
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
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Mountain className="h-6 w-6" /> CharDham Packages
        </h1>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="rounded-xl gap-2" onClick={seedDefaults} disabled={seeding}>
            <Wand2 className="h-4 w-4" /> {seeding ? 'Adding…' : 'Add 3 default packages'}
          </Button>
          <Link href="/admin/chardham-packages/new">
            <Button className="rounded-xl gap-2"><Plus className="h-4 w-4" /> Create Package</Button>
          </Link>
        </div>
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
                  <th className="text-left p-4 font-medium">Category</th>
                  <th className="text-left p-4 font-medium">Duration</th>
                  <th className="text-left p-4 font-medium">Price</th>
                  <th className="text-left p-4 font-medium">Seats</th>
                  <th className="text-right p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {packages.map((p) => {
                  const id = p._id || p.id;
                  return (
                    <tr key={id} className="border-b border-border last:border-0 hover:bg-muted/30">
                      <td className="p-4 font-medium">{p.name || '—'}</td>
                      <td className="p-4 capitalize">{p.category || '—'}</td>
                      <td className="p-4">{p.duration || '—'}</td>
                      <td className="p-4">{formatPrice(p.price)}</td>
                      <td className="p-4">{p.seatsAvailable ?? '—'}</td>
                      <td className="p-4 text-right">
                        <Link href={`/admin/chardham-packages/${id}/edit`}>
                          <Button variant="ghost" size="icon" className="rounded-lg"><Pencil className="h-4 w-4" /></Button>
                        </Link>
                        <Button variant="ghost" size="icon" className="rounded-lg text-destructive hover:text-destructive" onClick={() => setDeleteId(id)}><Trash2 className="h-4 w-4" /></Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {packages.length === 0 && (
            <div className="p-12 text-center text-muted-foreground">No CharDham packages. Create one to get started.</div>
          )}
        </Card>
      )}
      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Delete package?</DialogTitle></DialogHeader>
          <p className="text-muted-foreground text-sm">This cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>{deleting ? 'Deleting…' : 'Delete'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
