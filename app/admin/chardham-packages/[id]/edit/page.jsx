'use client';

import { useRef, useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/lib/toast';

function parseLines(text) {
  return (text || '').split(/[\n,]/).map((s) => s.trim()).filter(Boolean);
}

function parseItinerary(text) {
  const lines = (text || '').split('\n').map((s) => s.trim()).filter(Boolean);
  return lines.map((line, i) => {
    const match = line.match(/^Day\s*(\d+)[\s–\-:]+(.+)$/i);
    if (match) return { day: parseInt(match[1], 10), title: match[2].trim(), description: '' };
    return { day: i + 1, title: line, description: '' };
  });
}

function parseDiscountRules(text) {
  const lines = (text || '').split('\n').map((s) => s.trim()).filter(Boolean);
  const rules = [];
  for (const line of lines) {
    const m = line.match(/^(\d+)\s*(?:=|:|-|,)\s*(\d+(?:\.\d+)?)\s*%?$/);
    if (!m) continue;
    const minSeats = Math.max(1, parseInt(m[1], 10));
    const percentOff = Math.max(0, Math.min(100, Number(m[2])));
    rules.push({ minSeats, percentOff });
  }
  rules.sort((a, b) => a.minSeats - b.minSeats);
  return rules;
}

export default function EditCharDhamPackagePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);
  const [form, setForm] = useState({
    name: '',
    category: 'standard',
    price: '',
    offerText: '',
    duration: '',
    seatsAvailable: '10',
    shortDescription: '',
    fullDescription: '',
    highlights: '',
    itinerary: '',
    included: '',
    excluded: '',
    specialFeatures: '',
    images: '',
    discountRules: '',
    isRecommended: false,
  });

  const uploadImages = async (files) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const urls = [];
      for (const f of files) {
        const fd = new FormData();
        fd.append('file', f);
        const res = await fetch('/api/admin/chardham/upload', { method: 'POST', credentials: 'include', body: fd });
        const json = await res.json();
        if (!json?.success || !json?.data?.url) throw new Error(json?.message || 'Upload failed');
        urls.push(json.data.url);
      }
      setForm((prev) => ({ ...prev, images: [prev.images, ...urls].filter(Boolean).join('\n') }));
      toast.success('Images uploaded');
      if (fileRef.current) fileRef.current.value = '';
    } catch (e) {
      toast.error(e.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    fetch(`/api/admin/chardham/packages/${id}`, { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => {
        const p = d?.data;
        if (!p) return;
        setForm({
          name: p.name || '',
          category: p.category || 'standard',
          price: String(p.price ?? ''),
          offerText: p.offerText || '',
          duration: p.duration || '',
          seatsAvailable: String(p.seatsAvailable ?? 10),
          shortDescription: p.shortDescription || '',
          fullDescription: p.fullDescription || '',
          highlights: Array.isArray(p.highlights) ? p.highlights.join('\n') : '',
          itinerary: Array.isArray(p.itinerary) ? p.itinerary.map((i) => `Day ${i.day} – ${i.title}`).join('\n') : '',
          included: Array.isArray(p.included) ? p.included.join('\n') : '',
          excluded: Array.isArray(p.excluded) ? p.excluded.join('\n') : '',
          specialFeatures: Array.isArray(p.specialFeatures) ? p.specialFeatures.join('\n') : '',
          images: Array.isArray(p.images) ? p.images.join('\n') : '',
          discountRules: Array.isArray(p.discountRules) ? p.discountRules.map((r) => `${r.minSeats}=${r.percentOff}`).join('\n') : '',
          isRecommended: Boolean(p.isRecommended),
        });
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!id) return;
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        category: form.category,
        price: Number(form.price) || 0,
        offerText: form.offerText.trim(),
        duration: form.duration.trim(),
        seatsAvailable: Number(form.seatsAvailable) || 0,
        shortDescription: form.shortDescription.trim(),
        fullDescription: form.fullDescription.trim(),
        highlights: parseLines(form.highlights),
        itinerary: parseItinerary(form.itinerary),
        included: parseLines(form.included),
        excluded: parseLines(form.excluded),
        specialFeatures: parseLines(form.specialFeatures),
        images: parseLines(form.images),
        discountRules: parseDiscountRules(form.discountRules),
        isRecommended: form.isRecommended,
      };
      const res = await fetch(`/api/admin/chardham/packages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data?.success) {
        toast.success('Package updated');
        router.push('/admin/chardham-packages');
      } else toast.error(data?.message || 'Failed to update');
    } catch (err) {
      toast.error('Failed to update');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <Link href="/admin/chardham-packages" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to CharDham Packages
      </Link>
      <h1 className="text-2xl font-bold mb-6">Edit CharDham Package</h1>
      <Card className="p-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Package Name</Label>
            <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required placeholder="e.g. Luxury Char Dham Package" className="mt-1" />
          </div>
          <div>
            <Label>Category</Label>
            <select
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              className="w-full h-10 rounded-lg border border-input bg-background px-3 mt-1"
            >
              <option value="standard">Standard</option>
              <option value="premium">Premium</option>
              <option value="luxury">Luxury</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Price (₹)</Label>
              <Input type="number" min={0} value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} required className="mt-1" />
            </div>
            <div>
              <Label>Duration</Label>
              <Input value={form.duration} onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))} required placeholder="e.g. 10 Days" className="mt-1" />
            </div>
          </div>
          <div>
            <Label>Offer or discount (optional)</Label>
            <Input
              value={form.offerText}
              onChange={(e) => setForm((f) => ({ ...f, offerText: e.target.value }))}
              placeholder="e.g. 10% off · Early bird ₹2,000 off"
              className="mt-1"
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground mt-1">Shown on listing, package page, and home popup when set.</p>
          </div>
          <div>
            <Label>Seats Available</Label>
            <Input type="number" min={0} value={form.seatsAvailable} onChange={(e) => setForm((f) => ({ ...f, seatsAvailable: e.target.value }))} className="mt-1" />
          </div>
          <div>
            <Label>Short Description</Label>
            <textarea value={form.shortDescription} onChange={(e) => setForm((f) => ({ ...f, shortDescription: e.target.value }))} rows={2} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm mt-1" />
          </div>
          <div>
            <Label>Full Description</Label>
            <textarea value={form.fullDescription} onChange={(e) => setForm((f) => ({ ...f, fullDescription: e.target.value }))} rows={4} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm mt-1" />
          </div>
          <div>
            <Label>Highlights (one per line or comma-separated)</Label>
            <textarea value={form.highlights} onChange={(e) => setForm((f) => ({ ...f, highlights: e.target.value }))} rows={3} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm mt-1" />
          </div>
          <div>
            <Label>Day-wise Itinerary (e.g. Day 1 – Haridwar Arrival)</Label>
            <textarea value={form.itinerary} onChange={(e) => setForm((f) => ({ ...f, itinerary: e.target.value }))} rows={6} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm mt-1" />
          </div>
          <div>
            <Label>Included (one per line)</Label>
            <textarea value={form.included} onChange={(e) => setForm((f) => ({ ...f, included: e.target.value }))} rows={3} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm mt-1" />
          </div>
          <div>
            <Label>Excluded (one per line)</Label>
            <textarea value={form.excluded} onChange={(e) => setForm((f) => ({ ...f, excluded: e.target.value }))} rows={2} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm mt-1" />
          </div>
          <div>
            <Label>Special Features (one per line)</Label>
            <textarea value={form.specialFeatures} onChange={(e) => setForm((f) => ({ ...f, specialFeatures: e.target.value }))} rows={2} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm mt-1" />
          </div>
          <div>
            <Label>Upload Images (no URL)</Label>
            <div className="mt-1 flex flex-col gap-2">
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => uploadImages(Array.from(e.target.files || []))}
                className="block w-full text-sm"
                disabled={uploading}
              />
              <p className="text-xs text-muted-foreground">
                Uploaded images will be saved on your server storage path and used on website automatically.
              </p>
              <textarea
                value={form.images}
                onChange={(e) => setForm((f) => ({ ...f, images: e.target.value }))}
                rows={2}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div>
            <Label>Seat Discount Rules (one per line)</Label>
            <textarea
              value={form.discountRules}
              onChange={(e) => setForm((f) => ({ ...f, discountRules: e.target.value }))}
              rows={2}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm mt-1"
              placeholder="3=5   (seats ≥ 3 then 5% OFF)"
            />
            <p className="text-xs text-muted-foreground mt-1">Format: <b>minSeats=percent</b> (example: 3=5, 5=10)</p>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="rec" checked={form.isRecommended} onChange={(e) => setForm((f) => ({ ...f, isRecommended: e.target.checked }))} className="rounded" />
            <Label htmlFor="rec">Show as recommended</Label>
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={saving || uploading}>{saving ? 'Saving…' : uploading ? 'Uploading…' : 'Update Package'}</Button>
            <Link href="/admin/chardham-packages"><Button type="button" variant="outline">Cancel</Button></Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
