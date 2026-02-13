'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useDataStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { formatPrice } from '@/lib/utils';

export default function AdminToursPage() {
  const { tours, deleteTour } = useDataStore();
  const [deleteId, setDeleteId] = useState(null);

  const handleDelete = () => {
    if (deleteId) { deleteTour(deleteId); setDeleteId(null); }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Tours</h1>
        <Link href="/admin/tours/new">
          <Button className="rounded-xl gap-2"><Plus className="h-4 w-4" /> Add Tour</Button>
        </Link>
      </div>
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
              {tours.map((t) => (
                <tr key={t.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="p-4">{t.title}</td>
                  <td className="p-4">{t.destination}</td>
                  <td className="p-4">{t.duration}</td>
                  <td className="p-4">{formatPrice(t.price)}</td>
                  <td className="p-4 text-right">
                    <Link href={`/admin/tours/${t.id}/edit`}><Button variant="ghost" size="icon" className="rounded-lg"><Pencil className="h-4 w-4" /></Button></Link>
                    <Button variant="ghost" size="icon" className="rounded-lg text-destructive hover:text-destructive" onClick={() => setDeleteId(t.id)}><Trash2 className="h-4 w-4" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Delete tour?</DialogTitle><DialogDescription>This cannot be undone.</DialogDescription></DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)} className="rounded-xl">Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} className="rounded-xl">Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
