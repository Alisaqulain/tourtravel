'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useDataStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { formatPrice } from '@/lib/utils';

export default function AdminHotelsPage() {
  const { hotels, deleteHotel } = useDataStore();
  const [deleteId, setDeleteId] = useState(null);

  const handleDelete = () => {
    if (deleteId) { deleteHotel(deleteId); setDeleteId(null); }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Hotels</h1>
        <Link href="/admin/hotels/new">
          <Button className="rounded-xl gap-2"><Plus className="h-4 w-4" /> Add Hotel</Button>
        </Link>
      </div>
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
              {hotels.map((h) => (
                <tr key={h.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="p-4">{h.name}</td>
                  <td className="p-4">{h.location}</td>
                  <td className="p-4">{formatPrice(h.pricePerNight)}</td>
                  <td className="p-4 text-right">
                    <Link href={`/admin/hotels/${h.id}/edit`}><Button variant="ghost" size="icon" className="rounded-lg"><Pencil className="h-4 w-4" /></Button></Link>
                    <Button variant="ghost" size="icon" className="rounded-lg text-destructive hover:text-destructive" onClick={() => setDeleteId(h.id)}><Trash2 className="h-4 w-4" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Delete hotel?</DialogTitle><DialogDescription>This cannot be undone.</DialogDescription></DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)} className="rounded-xl">Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} className="rounded-xl">Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
