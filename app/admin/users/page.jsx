'use client';

import { motion } from 'framer-motion';
import { User, Mail, Calendar, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { useUsersStore } from '@/store';

export default function AdminUsersPage() {
  const users = useUsersStore((s) => s.users);

  return (
    <div>
      <Link href="/admin" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 text-sm">
        <ArrowLeft className="h-4 w-4" /> Dashboard
      </Link>
      <h1 className="text-2xl font-bold mb-2">All Users</h1>
      <p className="text-muted-foreground mb-6">Registered user accounts. Total: {users.length}</p>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left p-4 font-semibold">ID</th>
                <th className="text-left p-4 font-semibold">Name</th>
                <th className="text-left p-4 font-semibold">Email</th>
                <th className="text-left p-4 font-semibold">Role</th>
                <th className="text-left p-4 font-semibold">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <motion.tr
                  key={u.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className="border-b border-border hover:bg-muted/30"
                >
                  <td className="p-4 font-mono text-muted-foreground">{u.id}</td>
                  <td className="p-4 flex items-center gap-2">
                    <User className="h-4 w-4 text-primary" />
                    {u.name}
                  </td>
                  <td className="p-4 flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    {u.email}
                  </td>
                  <td className="p-4">
                    <span className="rounded-full bg-primary/10 text-primary px-2 py-1 text-xs font-medium">{u.role || 'user'}</span>
                  </td>
                  <td className="p-4 flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {u.createdAt}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        {users.length === 0 && (
          <div className="p-12 text-center text-muted-foreground">No users yet. Users appear here when they sign up.</div>
        )}
      </Card>
    </div>
  );
}
