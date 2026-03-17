'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Lock, User, MapPin, Building2, Plane } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/store';
import { toast } from '@/lib/toast';
import { cn } from '@/lib/utils';

const USER_TYPE = { traveller: 'traveller', hotel_owner: 'hotel_owner' };

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const login = useAuthStore((s) => s.login);
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState(USER_TYPE.traveller);

  useEffect(() => {
    const type = searchParams.get('type');
    if (type === 'hotel_owner') setUserType(USER_TYPE.hotel_owner);
  }, [searchParams]);

  useEffect(() => {
    if (isLoggedIn) router.replace('/profile');
  }, [isLoggedIn, router]);

  const isTraveller = userType === USER_TYPE.traveller;
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (isTraveller) {
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: data.name,
            email: data.email,
            password: data.password,
            city: (data.city || '').trim(),
            state: (data.state || '').trim(),
            country: (data.country || '').trim(),
          }),
          credentials: 'include',
        });
        const json = await res.json();
        if (!res.ok) {
          toast.error(json.error || 'Registration failed');
          return;
        }
        login({ name: json.user.name, email: json.user.email, role: 'user' });
        toast.success('Account created! Start booking flights, hotels & tours.');
        const from = searchParams.get('from');
        router.push(from && from.startsWith('/') && !from.startsWith('//') ? from : '/profile');
      } else {
        const params = new URLSearchParams();
        if (data.name) params.set('name', data.name);
        if (data.email) params.set('email', data.email);
        if (data.phone) params.set('phone', data.phone || '');
        router.push(`/hotel/signup?${params.toString()}`);
        return;
      }
    } catch (e) {
      toast.error('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  if (isLoggedIn) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <p className="text-muted-foreground">Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
        <div className="rounded-2xl border border-border bg-card p-8 shadow-premium">
          <h1 className="text-2xl font-bold mb-2">Create account</h1>
          <p className="text-muted-foreground mb-6">Join as a traveller or register your hotel.</p>

          <div className="flex gap-2 p-1 rounded-xl bg-muted/50 mb-6">
            <button
              type="button"
              onClick={() => setUserType(USER_TYPE.traveller)}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-colors',
                isTraveller ? 'bg-background text-foreground shadow' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Plane className="h-4 w-4" /> Traveller
            </button>
            <button
              type="button"
              onClick={() => setUserType(USER_TYPE.hotel_owner)}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-colors',
                !isTraveller ? 'bg-background text-foreground shadow' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Building2 className="h-4 w-4" /> Hotel owner
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="name">Full name</Label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  placeholder="John Doe"
                  className="pl-10"
                  {...register('name', { required: 'Name is required' })}
                />
              </div>
              {errors.name && <p className="text-sm text-primary mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="pl-10"
                  {...register('email', { required: 'Email is required' })}
                />
              </div>
              {errors.email && <p className="text-sm text-primary mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                  {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })}
                />
              </div>
              {errors.password && <p className="text-sm text-primary mt-1">{errors.password.message}</p>}
            </div>

            {isTraveller ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <div className="relative mt-1">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="city"
                        placeholder="e.g. Mumbai"
                        className="pl-10"
                        {...register('city', { required: 'City is required' })}
                      />
                    </div>
                    {errors.city && <p className="text-sm text-primary mt-1">{errors.city.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      placeholder="e.g. Maharashtra"
                      className="mt-1"
                      {...register('state', { required: 'State is required' })}
                    />
                    {errors.state && <p className="text-sm text-primary mt-1">{errors.state.message}</p>}
                  </div>
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    placeholder="e.g. India"
                    className="mt-1"
                    {...register('country', { required: 'Country is required' })}
                  />
                  {errors.country && <p className="text-sm text-primary mt-1">{errors.country.message}</p>}
                </div>
              </>
            ) : (
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  placeholder="e.g. +91 9876543210"
                  className="mt-1"
                  {...register('phone')}
                />
              </div>
            )}

            <Button type="submit" className="w-full rounded-xl" size="lg" disabled={loading}>
              {loading ? '...' : isTraveller ? 'Sign up as Traveller' : 'Continue to hotel signup'}
            </Button>
          </form>
          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-primary font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
