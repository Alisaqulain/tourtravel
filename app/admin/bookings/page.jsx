'use client';

import { motion } from 'framer-motion';
import { CalendarCheck, User, Mail, IndianRupee, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { useBookingStore } from '@/store';
import { formatPrice } from '@/lib/utils';

export default function AdminBookingsPage() {
  const completedBookings = useBookingStore((s) => s.completedBookings) ?? [];

  return (
    <div>
      <Link href="/admin" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 text-sm">
        <ArrowLeft className="h-4 w-4" /> Dashboard
      </Link>
      <h1 className="text-2xl font-bold mb-2">All Bookings</h1>
      <p className="text-muted-foreground mb-6">Completed payments. Total: {completedBookings.length}</p>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left p-4 font-semibold">ID</th>
                <th className="text-left p-4 font-semibold">Type</th>
                <th className="text-left p-4 font-semibold">Description</th>
                <th className="text-left p-4 font-semibold">Customer</th>
                <th className="text-left p-4 font-semibold">Amount</th>
                <th className="text-left p-4 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody>
              {completedBookings.map((b, i) => (
                <motion.tr
                  key={b.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className="border-b border-border hover:bg-muted/30"
                >
                  <td className="p-4 font-mono text-muted-foreground">{b.id}</td>
                  <td className="p-4">
                    <span className="rounded-full bg-primary/10 text-primary px-2 py-1 text-xs font-medium">{b.type}</span>
                  </td>
                  <td className="p-4 max-w-xs truncate">{b.description}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4 text-muted-foreground" />
                      {b.userName}
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground text-xs mt-0.5">
                      <Mail className="h-3 w-3" />
                      {b.userEmail}
                    </div>
                  </td>
                  <td className="p-4 flex items-center gap-1 font-semibold text-primary">
                    <IndianRupee className="h-4 w-4" />
                    {formatPrice(b.amount)}
                  </td>
                  <td className="p-4 flex items-center gap-2 text-muted-foreground">
                    <CalendarCheck className="h-4 w-4" />
                    {b.date}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        {completedBookings.length === 0 && (
          <div className="p-12 text-center text-muted-foreground">No completed bookings yet. Bookings appear here after payment.</div>
        )}
      </Card>
    </div>
  );
}
