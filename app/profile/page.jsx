'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  User,
  Mail,
  Calendar,
  CalendarCheck,
  Star,
  Search,
  Plus,
  CreditCard,
  LogOut,
  Users,
  ChevronRight,
  MessageSquare,
  Settings,
  Phone,
  KeyRound,
  MapPin,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useAuthStore, useUserReviewsStore } from '@/store';
import { cn } from '@/lib/utils';

const SECTIONS = [
  { id: 'overview', label: 'Overview', icon: User },
  { id: 'settings', label: 'Account Settings', icon: Settings },
  { id: 'bookings', label: 'My Bookings', icon: CalendarCheck },
  { id: 'payments', label: 'Payment History', icon: CreditCard },
  { id: 'reviews', label: 'Reviews', icon: Star },
  { id: 'travelers', label: 'Saved Travelers', icon: Users },
];

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoggedIn, logout, login } = useAuthStore();
  const { reviews, addReview } = useUserReviewsStore();
  const [section, setSection] = useState('overview');
  const [searchReview, setSearchReview] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [newType, setNewType] = useState('Hotel');
  const [payments, setPayments] = useState([]);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editCity, setEditCity] = useState('');
  const [editState, setEditState] = useState('');
  const [editCountry, setEditCountry] = useState('');
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) router.replace('/login');
  }, [isLoggedIn, router]);

  // Fetch latest user (including city, state, country) when profile page loads so it always shows current data
  useEffect(() => {
    if (!isLoggedIn) return;
    fetch('/api/auth/me', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        const u = data?.user ?? data?.data?.user;
        if (u) {
          login({
            ...u,
            name: u.name,
            email: u.email,
            phone: u.phone ?? '',
            city: u.city ?? '',
            state: u.state ?? '',
            country: u.country ?? '',
          });
        }
      })
      .catch(() => {});
  }, [isLoggedIn, login]);

  useEffect(() => {
    if (user) {
      setEditName(user.name || '');
      setEditPhone(user.phone || '');
      setEditCity(user.city || '');
      setEditState(user.state || '');
      setEditCountry(user.country || '');
    }
  }, [user?.name, user?.phone, user?.city, user?.state, user?.country]);

  useEffect(() => {
    if (!isLoggedIn) return;
    setPaymentsLoading(true);
    fetch('/api/payments', { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => (d?.success && d?.data?.payments ? setPayments(d.data.payments) : null))
      .catch(() => {})
      .finally(() => setPaymentsLoading(false));
  }, [isLoggedIn]);

  const filteredReviews = useMemo(() => {
    if (!searchReview.trim()) return reviews;
    const q = searchReview.toLowerCase();
    return reviews.filter(
      (r) =>
        (r.comment || '').toLowerCase().includes(q) ||
        (r.type || '').toLowerCase().includes(q)
    );
  }, [reviews, searchReview]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (settingsSaving) return;
    setSettingsSaving(true);
    setSettingsSaved(false);
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
        name: editName.trim(),
        phone: editPhone.trim() || null,
        city: editCity.trim() || null,
        state: editState.trim() || null,
        country: editCountry.trim() || null,
      }),
      });
      const data = await res.json();
      if (data?.success && data?.data?.user) {
        useAuthStore.getState().login(data.data.user);
        setSettingsSaved(true);
        setTimeout(() => setSettingsSaved(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSettingsSaving(false);
    }
  };

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    addReview({
      type: newType,
      rating: newRating,
      comment: newComment.trim(),
      userName: user?.name || 'User',
    });
    setNewComment('');
    setNewRating(5);
  };

  if (!isLoggedIn) return null;

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-6 md:py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-foreground/70 hover:text-foreground text-sm mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col lg:flex-row gap-6 lg:gap-8"
        >
          {/* Sidebar */}
          <aside className="lg:w-72 shrink-0">
            <Card className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
              {/* Profile header in sidebar */}
              <div className="p-6 pb-4 border-b border-border">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-primary/15 flex items-center justify-center shrink-0">
                    <User className="h-7 w-7 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-semibold text-foreground truncate">{user?.name || 'User'}</h2>
                    <p className="text-sm text-foreground/60 truncate">{user?.email || ''}</p>
                  </div>
                </div>
              </div>
              <nav className="p-2">
                {SECTIONS.map((s) => {
                  const Icon = s.icon;
                  const isActive = section === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSection(s.id)}
                      className={cn(
                        'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'text-foreground/80 hover:bg-muted hover:text-foreground'
                      )}
                    >
                      <Icon className="h-5 w-5 shrink-0" />
                      {s.label}
                      <ChevronRight className={cn('h-4 w-4 ml-auto shrink-0', isActive ? 'text-primary-foreground' : 'text-foreground/50')} />
                    </button>
                  );
                })}
              </nav>
              <div className="p-3 border-t border-border">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => {
                    logout();
                    router.push('/');
                  }}
                >
                  <LogOut className="h-4 w-4" /> Logout
                </Button>
              </div>
            </Card>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">
            <Card className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
              {/* Overview */}
              {section === 'overview' && (
                <div className="p-6 md:p-8">
                  <h3 className="text-xl font-semibold text-foreground mb-6">Profile overview</h3>
                  <div className="space-y-5">
                    <div className="flex items-center gap-4 py-4 px-4 rounded-xl bg-muted/50">
                      <User className="h-5 w-5 text-foreground/50 shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-foreground/60 uppercase tracking-wider">Full name</p>
                        <p className="font-medium text-foreground">{user?.name || '—'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 py-4 px-4 rounded-xl bg-muted/50">
                      <Mail className="h-5 w-5 text-foreground/50 shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-foreground/60 uppercase tracking-wider">Email</p>
                        <p className="font-medium text-foreground">{user?.email || '—'}</p>
                      </div>
                    </div>
                    {user?.phone != null && user.phone !== '' && (
                      <div className="flex items-center gap-4 py-4 px-4 rounded-xl bg-muted/50">
                        <Phone className="h-5 w-5 text-foreground/50 shrink-0" />
                        <div>
                          <p className="text-xs font-medium text-foreground/60 uppercase tracking-wider">Phone</p>
                          <p className="font-medium text-foreground">{user.phone}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-4 py-4 px-4 rounded-xl bg-muted/50">
                      <MapPin className="h-5 w-5 text-foreground/50 shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-foreground/60 uppercase tracking-wider">City</p>
                        <p className="font-medium text-foreground">{user?.city || '—'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 py-4 px-4 rounded-xl bg-muted/50">
                      <MapPin className="h-5 w-5 text-foreground/50 shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-foreground/60 uppercase tracking-wider">State</p>
                        <p className="font-medium text-foreground">{user?.state || '—'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 py-4 px-4 rounded-xl bg-muted/50">
                      <MapPin className="h-5 w-5 text-foreground/50 shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-foreground/60 uppercase tracking-wider">Country</p>
                        <p className="font-medium text-foreground">{user?.country || '—'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 py-4 px-4 rounded-xl bg-muted/50">
                      <Calendar className="h-5 w-5 text-foreground/50 shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-foreground/60 uppercase tracking-wider">Member since</p>
                        <p className="font-medium text-foreground">2025</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3 mt-8 pt-6 border-t border-border">
                    <Link href="/my-bookings">
                      <Button className="rounded-xl gap-2">
                        <CalendarCheck className="h-4 w-4" /> My Bookings
                      </Button>
                    </Link>
                    <Link href="/booking-summary">
                      <Button variant="outline" className="rounded-xl">Booking Summary</Button>
                    </Link>
                  </div>
                </div>
              )}

              {/* Account Settings */}
              {section === 'settings' && (
                <div className="p-6 md:p-8">
                  <h3 className="text-xl font-semibold text-foreground mb-2">Account settings</h3>
                  <p className="text-foreground/60 text-sm mb-6">Update your name, phone, and location. Email cannot be changed.</p>
                  <form onSubmit={handleSaveProfile} className="space-y-5 max-w-md">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Full name</label>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                        placeholder="Your name"
                        maxLength={120}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Phone</label>
                      <input
                        type="tel"
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                        placeholder="+91 98765 43210"
                        maxLength={20}
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">City</label>
                        <input
                          type="text"
                          value={editCity}
                          onChange={(e) => setEditCity(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                          placeholder="e.g. Mumbai"
                          maxLength={100}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">State</label>
                        <input
                          type="text"
                          value={editState}
                          onChange={(e) => setEditState(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                          placeholder="e.g. Maharashtra"
                          maxLength={100}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Country</label>
                      <input
                        type="text"
                        value={editCountry}
                        onChange={(e) => setEditCountry(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                        placeholder="e.g. India"
                        maxLength={100}
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <Button type="submit" disabled={settingsSaving} className="rounded-xl gap-2">
                        {settingsSaving ? 'Saving…' : 'Save changes'}
                      </Button>
                      {settingsSaved && (
                        <span className="text-sm text-green-600 dark:text-green-400">Saved.</span>
                      )}
                    </div>
                  </form>
                  <div className="mt-8 pt-6 border-t border-border">
                    <h4 className="font-medium text-foreground mb-2">Change password</h4>
                    <p className="text-sm text-foreground/60 mb-3">Use the forgot-password flow to set a new password. We will send a link to your email.</p>
                    <Link href="/forgot-password">
                      <Button variant="outline" className="rounded-xl gap-2">
                        <KeyRound className="h-4 w-4" /> Change password
                      </Button>
                    </Link>
                  </div>
                </div>
              )}

              {/* Bookings */}
              {section === 'bookings' && (
                <div className="p-6 md:p-8">
                  <h3 className="text-xl font-semibold text-foreground mb-2">My Bookings</h3>
                  <p className="text-foreground/60 text-sm mb-6">View and manage all your trips.</p>
                  <div className="py-12 rounded-xl bg-muted/30 border border-border border-dashed text-center">
                    <CalendarCheck className="h-12 w-12 text-primary/50 mx-auto mb-4" />
                    <p className="text-foreground/70 mb-4">Your bookings appear here</p>
                    <Link href="/my-bookings">
                      <Button className="rounded-xl gap-2">Open My Bookings</Button>
                    </Link>
                  </div>
                </div>
              )}

              {/* Payments */}
              {section === 'payments' && (
                <div className="p-6 md:p-8">
                  <h3 className="text-xl font-semibold text-foreground mb-2">Payment history</h3>
                  <p className="text-foreground/60 text-sm mb-6">All your transactions in one place.</p>
                  {paymentsLoading ? (
                    <div className="flex items-center justify-center py-16">
                      <div className="animate-pulse flex flex-col gap-3 w-full max-w-sm">
                        <div className="h-12 rounded-xl bg-muted" />
                        <div className="h-12 rounded-xl bg-muted" />
                        <div className="h-12 rounded-xl bg-muted" />
                      </div>
                    </div>
                  ) : payments.length === 0 ? (
                    <div className="py-12 rounded-xl bg-muted/30 border border-border border-dashed text-center">
                      <CreditCard className="h-12 w-12 text-foreground/40 mx-auto mb-4" />
                      <p className="text-foreground/70">No payments yet</p>
                      <p className="text-sm text-foreground/50 mt-1">Complete a booking to see payment history.</p>
                    </div>
                  ) : (
                    <ul className="space-y-0 divide-y divide-border">
                      {payments.map((p) => (
                        <li key={p._id} className="flex flex-wrap items-center justify-between gap-4 py-4 first:pt-0">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                              <CreditCard className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{p.bookingId}</p>
                              <span
                                className={cn(
                                  'text-xs font-medium px-2 py-0.5 rounded-full',
                                  p.payment_status === 'captured' && 'bg-green-500/20 text-green-600 dark:text-green-400',
                                  p.payment_status === 'failed' && 'bg-destructive/20 text-destructive',
                                  p.payment_status === 'created' && 'bg-muted text-foreground/70'
                                )}
                              >
                                {p.payment_status}
                              </span>
                            </div>
                          </div>
                          <span className="font-semibold text-primary">₹{p.amount}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {/* Reviews */}
              {section === 'reviews' && (
                <div className="p-6 md:p-8">
                  <h3 className="text-xl font-semibold text-foreground mb-2">Reviews</h3>
                  <p className="text-foreground/60 text-sm mb-6">Share your experience and see your reviews.</p>
                  <Card className="p-6 rounded-xl border border-border bg-muted/20 mb-8">
                    <h4 className="font-medium text-foreground mb-4 flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" /> Add a review
                    </h4>
                    <form onSubmit={handleAddReview} className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-1.5 block">Category</label>
                        <select
                          value={newType}
                          onChange={(e) => setNewType(e.target.value)}
                          className="w-full h-11 rounded-xl border border-border bg-background px-4 text-sm text-foreground"
                        >
                          <option value="Hotel">Hotel</option>
                          <option value="Flight">Flight</option>
                          <option value="Tour">Tour</option>
                          <option value="Package">Package</option>
                          <option value="Bus">Bus</option>
                          <option value="Cruise">Cruise</option>
                          <option value="Car">Car</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-1.5 block">Rating</label>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((n) => (
                            <button
                              key={n}
                              type="button"
                              onClick={() => setNewRating(n)}
                              className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                            >
                              <Star className={cn('h-7 w-7 transition-colors', n <= newRating ? 'fill-primary text-primary' : 'text-foreground/30')} />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-1.5 block">Comment</label>
                        <textarea
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Share your experience..."
                          rows={3}
                          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary"
                          required
                        />
                      </div>
                      <Button type="submit" className="rounded-xl gap-2">
                        <Plus className="h-4 w-4" /> Add review
                      </Button>
                    </form>
                  </Card>
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
                      <h4 className="font-medium text-foreground">My reviews</h4>
                      <div className="relative flex-1 max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/40" />
                        <Input
                          placeholder="Search..."
                          value={searchReview}
                          onChange={(e) => setSearchReview(e.target.value)}
                          className="pl-9 rounded-xl bg-background"
                        />
                      </div>
                    </div>
                    {filteredReviews.length === 0 ? (
                      <div className="py-12 rounded-xl bg-muted/30 border border-border border-dashed text-center">
                        <Star className="h-12 w-12 text-foreground/40 mx-auto mb-4" />
                        <p className="text-foreground/70">No reviews yet</p>
                        <p className="text-sm text-foreground/50 mt-1">Add one using the form above.</p>
                      </div>
                    ) : (
                      <ul className="space-y-3">
                        {filteredReviews.map((r) => (
                          <li key={r.id}>
                            <Card className="p-4 rounded-xl border border-border">
                              <div className="flex items-center justify-between gap-2 mb-2">
                                <span className="text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full">{r.type}</span>
                                <span className="text-xs text-foreground/50">{r.createdAt}</span>
                              </div>
                              <div className="flex gap-0.5 mb-2">
                                {[1, 2, 3, 4, 5].map((n) => (
                                  <Star key={n} className={cn('h-4 w-4', n <= r.rating ? 'fill-primary text-primary' : 'text-foreground/20')} />
                                ))}
                              </div>
                              <p className="text-sm text-foreground/90">{r.comment}</p>
                            </Card>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}

              {/* Travelers */}
              {section === 'travelers' && (
                <div className="p-6 md:p-8">
                  <h3 className="text-xl font-semibold text-foreground mb-2">Saved travelers</h3>
                  <p className="text-foreground/60 text-sm mb-6">Add travelers for faster checkout.</p>
                  <div className="py-12 rounded-xl bg-muted/30 border border-border border-dashed text-center">
                    <Users className="h-12 w-12 text-foreground/40 mx-auto mb-4" />
                    <p className="text-foreground/70">No saved travelers</p>
                    <p className="text-sm text-foreground/50 mt-1">Traveler details can be added at checkout.</p>
                  </div>
                </div>
              )}
            </Card>
          </main>
        </motion.div>
      </div>
    </div>
  );
}
