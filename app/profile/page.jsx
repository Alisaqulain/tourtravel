'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Mail, Calendar, CalendarCheck, Star, MessageSquare, Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuthStore, useUserReviewsStore } from '@/store';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoggedIn } = useAuthStore();
  const { reviews, addReview } = useUserReviewsStore();
  const [searchReview, setSearchReview] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [newType, setNewType] = useState('Hotel');

  useEffect(() => {
    if (!isLoggedIn) router.replace('/login');
  }, [isLoggedIn, router]);

  const filteredReviews = useMemo(() => {
    if (!searchReview.trim()) return reviews;
    const q = searchReview.toLowerCase();
    return reviews.filter(
      (r) =>
        (r.comment || '').toLowerCase().includes(q) ||
        (r.type || '').toLowerCase().includes(q)
    );
  }, [reviews, searchReview]);

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
    <div className="container mx-auto px-4 py-8">
      <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 text-sm">
        <ArrowLeft className="h-4 w-4" /> Back to Home
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl"
      >
        <h1 className="text-3xl font-bold mb-2">My Profile</h1>
        <p className="text-muted-foreground mb-8">Manage your account, reviews, and ratings.</p>

        <Tabs defaultValue="info" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3 rounded-xl bg-muted p-1">
            <TabsTrigger value="info" className="rounded-lg gap-2">
              <User className="h-4 w-4" /> Info
            </TabsTrigger>
            <TabsTrigger value="reviews" className="rounded-lg gap-2">
              <Star className="h-4 w-4" /> Reviews
            </TabsTrigger>
            <TabsTrigger value="bookings" className="rounded-lg gap-2">
              <CalendarCheck className="h-4 w-4" /> Bookings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-6">
            <Card className="rounded-2xl border border-border p-8 shadow-premium">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-16 w-16 rounded-2xl bg-primary/20 flex items-center justify-center">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{user?.name || 'User'}</h2>
                  <p className="text-muted-foreground">{user?.email || 'user@example.com'}</p>
                </div>
              </div>
              <dl className="space-y-4">
                <div className="flex items-center gap-3 py-3 border-b border-border">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <dt className="text-sm text-muted-foreground">Full name</dt>
                    <dd className="font-medium">{user?.name || 'Demo User'}</dd>
                  </div>
                </div>
                <div className="flex items-center gap-3 py-3 border-b border-border">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <dt className="text-sm text-muted-foreground">Email</dt>
                    <dd className="font-medium">{user?.email || 'demo@example.com'}</dd>
                  </div>
                </div>
                <div className="flex items-center gap-3 py-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <dt className="text-sm text-muted-foreground">Member since</dt>
                    <dd className="font-medium">February 2025</dd>
                  </div>
                </div>
              </dl>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/my-bookings">
                  <Button className="rounded-xl gap-2">
                    <CalendarCheck className="h-4 w-4" /> My Bookings
                  </Button>
                </Link>
                <Link href="/booking-summary">
                  <Button variant="outline" className="rounded-xl">Booking Summary</Button>
                </Link>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <MessageSquare className="h-5 w-5" /> Add rating & comment
              </h3>
              <form onSubmit={handleAddReview} className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className="flex h-11 w-full rounded-xl border border-border bg-background px-4 py-2 text-sm"
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
                  <label className="text-sm font-medium mb-2 block">Rating</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setNewRating(n)}
                        className="p-1 rounded hover:bg-muted"
                      >
                        <Star className={`h-8 w-8 ${n <= newRating ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Comment</label>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share your experience..."
                    rows={3}
                    className="flex w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
                    required
                  />
                </div>
                <Button type="submit" className="rounded-xl gap-2">
                  <Plus className="h-4 w-4" /> Add review
                </Button>
              </form>
            </Card>

            <div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                <h3 className="font-semibold">My reviews</h3>
                <div className="relative flex-1 max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search reviews..."
                    value={searchReview}
                    onChange={(e) => setSearchReview(e.target.value)}
                    className="pl-9 rounded-xl"
                  />
                </div>
              </div>
              <div className="space-y-3">
                {filteredReviews.length === 0 ? (
                  <Card className="p-8 text-center text-muted-foreground">
                    No reviews yet. Add one above.
                  </Card>
                ) : (
                  filteredReviews.map((r) => (
                    <Card key={r.id} className="p-4">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="rounded-full bg-primary/10 text-primary text-xs font-medium px-2 py-1">{r.type}</span>
                        <span className="text-sm text-muted-foreground">{r.createdAt}</span>
                      </div>
                      <div className="flex gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <Star key={n} className={`h-4 w-4 ${n <= r.rating ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
                        ))}
                      </div>
                      <p className="text-sm">{r.comment}</p>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-6">
            <Card className="p-8 text-center">
              <CalendarCheck className="h-12 w-12 text-primary mx-auto mb-4 opacity-80" />
              <h3 className="font-semibold mb-2">Your bookings</h3>
              <p className="text-muted-foreground text-sm mb-4">View and manage all your trips in one place.</p>
              <Link href="/my-bookings">
                <Button className="rounded-xl gap-2">Go to My Bookings</Button>
              </Link>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
