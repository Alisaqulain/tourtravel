'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bell } from 'lucide-react';
import { useAuthStore } from '@/store';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function NotificationBell() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    if (!isLoggedIn) return;
    setLoading(true);
    try {
      const res = await fetch('/api/notifications?limit=5', { credentials: 'include' });
      const data = await res.json();
      if (data?.success && data?.data) {
        setList(data.data.notifications || []);
        setUnreadCount(data.data.unreadCount || 0);
      }
    } catch (_) {}
    setLoading(false);
  };

  useEffect(() => {
    fetchNotifications();
    const t = setInterval(fetchNotifications, 60000);
    return () => clearInterval(t);
  }, [isLoggedIn]);

  if (!isLoggedIn) return null;

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="relative rounded-xl"
        onClick={() => setOpen(!open)}
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>
      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            aria-hidden
            onClick={() => setOpen(false)}
          />
          <div
            className={cn(
              'absolute right-0 top-full mt-2 z-50 w-80 max-h-[360px] overflow-auto',
              'rounded-xl border border-border bg-card shadow-xl'
            )}
          >
            <div className="p-3 border-b border-border flex items-center justify-between">
              <span className="font-semibold text-sm">Notifications</span>
              {list.length > 0 && (
                <Link
                  href="/notifications"
                  className="text-xs text-primary hover:underline"
                  onClick={() => setOpen(false)}
                >
                  View all
                </Link>
              )}
            </div>
            <div className="divide-y divide-border">
              {loading ? (
                <div className="p-6 text-center text-sm text-muted-foreground">
                  Loading...
                </div>
              ) : list.length === 0 ? (
                <div className="p-6 text-center text-sm text-muted-foreground">
                  No notifications yet
                </div>
              ) : (
                list.slice(0, 5).map((n) => (
                  <Link
                    key={n._id}
                    href={n.link || '#'}
                    className={cn(
                      'block p-3 text-left hover:bg-muted/50 transition-colors',
                      !n.isRead && 'bg-primary/5'
                    )}
                    onClick={() => setOpen(false)}
                  >
                    <p className="text-sm font-medium text-foreground">{n.title}</p>
                    {n.message && (
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                        {n.message}
                      </p>
                    )}
                  </Link>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
