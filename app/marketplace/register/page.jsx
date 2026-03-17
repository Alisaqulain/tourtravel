'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

export default function MarketplaceRegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState('customer');
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/marketplace/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, role }),
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Registration failed');
        return;
      }
      if (role === 'hotel_owner') router.push('/marketplace/hotel/register');
      else router.push('/marketplace/hotels');
    } catch {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <Card className="w-full max-w-md p-6">
        <h1 className="text-2xl font-bold mb-2">Marketplace Register</h1>
        <p className="text-muted-foreground text-sm mb-6">Join to book hotels or list your property. For flights & tours use the main site signup.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>I am</Label>
            <div className="flex gap-4 mt-2">
              <label className="flex items-center gap-2">
                <input type="radio" name="role" checked={role === 'customer'} onChange={() => setRole('customer')} />
                Customer
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="role" checked={role === 'hotel_owner'} onChange={() => setRole('hotel_owner')} />
                Hotel Owner
              </label>
            </div>
          </div>
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required className="mt-1" />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} required className="mt-1" />
          </div>
          <div>
            <Label htmlFor="password">Password (min 6)</Label>
            <Input id="password" type="password" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} required minLength={6} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className="mt-1" />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Already have an account? <Link href="/login" className="text-primary underline">Login</Link>
          {' · '}
          <Link href="/signup" className="text-primary underline">Sign up as traveller (main site)</Link>
        </p>
      </Card>
    </div>
  );
}
