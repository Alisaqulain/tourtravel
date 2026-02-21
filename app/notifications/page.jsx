'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Bell, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store';
import { EmptyState } from '@/components/ui/empty-state';
import { SkeletonList } from '@/components/ui/skeleton-loader';

export default function NotificationsPage() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) return;
    fetch('/api/notifications?limit=50', { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => {
        if (d?.success && d?.data?.notifications) setList(d.data.notifications);
      })
      .finally(() => setLoading(false));
  }, [isLoggedIn]);

  const markAllRead = async () => {
    await fetch('/api/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ markAllRead: true }),
    });
    setList((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  if (!isLoggedIn) {
    return (
      <div className="container mx-auto px-4 py-12">
        <EmptyState
          icon={Bell}
          title="Sign in to view notifications"
          actionLabel="Login"
          actionHref="/login"
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 text-sm">
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Notifications</h1>
        {list.some((n) => !n.isRead) && (
          <Button variant="outline" size="sm" className="rounded-xl" onClick={markAllRead}>
            Mark all as read
          </Button>
        )}
      </div>

      {loading ? (
        <SkeletonList count={5} />
      ) : list.length === 0 ? (
        <EmptyState icon={Bell} title="No notifications yet" description="We'll notify you about bookings and offers." />
      ) : (
        <ul className="divide-y divide-border rounded-xl border border-border bg-card overflow-hidden">
          {list.map((n) => (
            <li
              key={n._id}
              className={`p-4 ${!n.isRead ? 'bg-primary/5' : ''}`}
            >
              <Link href={n.link || '#'} className="block">
                <p className="font-medium text-foreground">{n.title}</p>
                {n.message && <p className="text-sm text-muted-foreground mt-1">{n.message}</p>}
                <p className="text-xs text-muted-foreground mt-2">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
