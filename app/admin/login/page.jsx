'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Shield, Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAdminStore } from '@/store';

export default function AdminLoginPage() {
  const router = useRouter();
  const loginAdmin = useAdminStore((s) => s.loginAdmin);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    setError('');
    setLoading(true);
    try {
      const ok = await loginAdmin(data.email, data.password);
      if (ok) router.replace('/admin');
      else setError('Invalid email or password, or not an admin account.');
    } catch {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark-600 to-dark-800 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="rounded-2xl border border-border bg-card p-8 shadow-premium">
          <div className="flex justify-center mb-6">
            <div className="h-14 w-14 rounded-2xl bg-primary/20 flex items-center justify-center">
              <Shield className="h-7 w-7 text-primary" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-center mb-2">Admin Login</h1>
          <p className="text-muted-foreground text-center text-sm mb-6">
            Trips To Travels · Admin Panel
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  className="pl-10"
                  {...register('email', { required: true })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Your password"
                  className="pl-10"
                  {...register('password', { required: true })}
                />
              </div>
            </div>
            {error && <p className="text-sm text-primary">{error}</p>}
            <Button type="submit" className="w-full rounded-xl" size="lg" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign In'}
            </Button>
          </form>
          <p className="text-center text-sm text-muted-foreground mt-6">
            <Link href="/" className="text-primary hover:underline">Back to website</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
