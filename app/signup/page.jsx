'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Lock, User, MapPin, Phone } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/store';
import { toast } from '@/lib/toast';
import { COUNTRY_OPTIONS, STATE_OPTIONS, getCitiesForState } from '@/lib/locationOptions';

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const login = useAuthStore((s) => s.login);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn) router.replace('/profile');
  }, [isLoggedIn, router]);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm();
  const selectedState = watch('state');

  // Reset city when state changes so selection stays valid
  useEffect(() => {
    setValue('city', '');
  }, [selectedState, setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const state = data.state === 'Other' ? (data.stateOther || '').trim() || 'Other' : (data.state || '').trim();
      const country = data.country === 'Other' ? (data.countryOther || '').trim() || 'Other' : (data.country || '').trim();
      const city = data.state === 'Other'
        ? (data.cityOther || '').trim() || 'Other'
        : (data.city === 'Other' ? (data.cityOther || '').trim() || 'Other' : (data.city || '').trim());
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          phone: (data.phone || '').trim(),
          city,
          state,
          country,
        }),
        credentials: 'include',
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error || json.message || 'Registration failed');
        return;
      }
      login({ name: json.user.name, email: json.user.email, phone: json.user.phone });
      toast.success('Account created successfully!');
      const from = searchParams.get('from');
      router.push(from && from.startsWith('/') && !from.startsWith('//') ? from : '/profile');
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
          <p className="text-muted-foreground mb-6">Join Trips To Travels and start booking.</p>
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
            <div>
              <Label htmlFor="phone">Phone number</Label>
              <div className="relative mt-1">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="e.g. 9876543210"
                  className="pl-10"
                  {...register('phone', { required: 'Phone is required' })}
                />
              </div>
              {errors.phone && <p className="text-sm text-primary mt-1">{errors.phone.message}</p>}
            </div>
            <div>
              <Label htmlFor="country">Country</Label>
              <select
                id="country"
                className="mt-1 w-full h-10 rounded-lg border border-input bg-background px-3 text-sm"
                {...register('country', { required: 'Country is required' })}
              >
                <option value="">Select country</option>
                {COUNTRY_OPTIONS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {watch('country') === 'Other' && (
                <Input
                  placeholder="Specify country"
                  className="mt-2"
                  {...register('countryOther')}
                />
              )}
              {errors.country && <p className="text-sm text-primary mt-1">{errors.country.message}</p>}
            </div>
            <div>
              <Label htmlFor="state">State</Label>
              <select
                id="state"
                className="mt-1 w-full h-10 rounded-lg border border-input bg-background px-3 text-sm"
                {...register('state', { required: 'State is required' })}
              >
                <option value="">Select state</option>
                {STATE_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              {watch('state') === 'Other' && (
                <Input
                  placeholder="Specify state"
                  className="mt-2"
                  {...register('stateOther')}
                />
              )}
              {errors.state && <p className="text-sm text-primary mt-1">{errors.state.message}</p>}
            </div>
            <div>
              <Label htmlFor="city">City</Label>
              {selectedState && selectedState !== 'Other' ? (
                <>
                  <select
                    id="city"
                    className="mt-1 w-full h-10 rounded-lg border border-input bg-background px-3 text-sm"
                    {...register('city', { required: 'City is required' })}
                  >
                    <option value="">Select city</option>
                    {getCitiesForState(selectedState).map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  {watch('city') === 'Other' && (
                    <Input
                      placeholder="Specify city"
                      className="mt-2"
                      {...register('cityOther')}
                    />
                  )}
                </>
              ) : selectedState === 'Other' ? (
                <Input
                  id="city"
                  placeholder="Specify city"
                  className="mt-1"
                  {...register('cityOther', { required: 'Please specify city' })}
                />
              ) : (
                <p className="text-sm text-muted-foreground mt-1">Select state first</p>
              )}
              {errors.city && <p className="text-sm text-primary mt-1">{errors.city.message}</p>}
              {errors.cityOther && <p className="text-sm text-primary mt-1">{errors.cityOther.message}</p>}
            </div>
            <Button type="submit" className="w-full rounded-xl" size="lg" disabled={loading}>
              {loading ? 'Creating account...' : 'Sign Up'}
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
