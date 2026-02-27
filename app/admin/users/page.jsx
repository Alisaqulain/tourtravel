'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Ban, Trash2, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/lib/toast';

function formatDate(d) {
  if (!d) return '—';
  const date = typeof d === 'string' ? new Date(d) : d;
  return isNaN(date.getTime()) ? d : date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users', { credentials: 'include' });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.message || 'Failed to load users');
        return;
      }
      if (json.success && Array.isArray(json.data?.users)) {
        setUsers(json.data.users);
      } else if (json.success && Array.isArray(json.data)) {
        setUsers(json.data);
      }
    } catch (e) {
      console.error('Admin users fetch:', e);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateRole = async (userId, role) => {
    if (!userId) return;
    setUpdatingId(userId);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ userId, role }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Role updated');
        fetchUsers();
      } else toast.error(data.message || 'Failed to update role');
    } catch (e) {
      toast.error('Failed to update role');
    } finally {
      setUpdatingId(null);
    }
  };

  const toggleBlock = async (u) => {
    const userId = u._id?.toString() || u.id;
    if (!userId) return;
    if (u.role === 'superadmin') {
      toast.error('Cannot block superadmin');
      return;
    }
    setUpdatingId(userId);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ userId, isBlocked: !u.isBlocked }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(u.isBlocked ? 'User unblocked' : 'User blocked');
        fetchUsers();
      } else toast.error(data.message || 'Failed');
    } catch (e) {
      toast.error('Failed');
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteUser = async (u) => {
    const userId = u._id?.toString() || u.id;
    if (!userId) return;
    if (u.role === 'superadmin') {
      toast.error('Cannot delete superadmin');
      return;
    }
    if (!confirm('Delete this user? This cannot be undone.')) return;
    setUpdatingId(userId);
    try {
      const res = await fetch(`/api/admin/users?userId=${encodeURIComponent(userId)}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        toast.success('User deleted');
        setUsers((prev) => prev.filter((x) => (x._id?.toString() || x.id) !== userId));
      } else toast.error(data.message || 'Failed to delete');
    } catch (e) {
      toast.error('Failed to delete');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      {loading ? (
        <Card className="p-12 text-center text-muted-foreground">Loading users...</Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left p-4 font-semibold">Name</th>
                  <th className="text-left p-4 font-semibold">Email</th>
                  <th className="text-left p-4 font-semibold">Role</th>
                  <th className="text-left p-4 font-semibold">City</th>
                  <th className="text-left p-4 font-semibold">State</th>
                  <th className="text-left p-4 font-semibold">Country</th>
                  <th className="text-left p-4 font-semibold">Bookings</th>
                  <th className="text-left p-4 font-semibold">Total Spend</th>
                  <th className="text-left p-4 font-semibold">Status</th>
                  <th className="text-left p-4 font-semibold">Joined</th>
                  <th className="text-left p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => {
                  const id = u._id?.toString() || u.id;
                  const busy = updatingId === id;
                  return (
                    <motion.tr
                      key={id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.02 }}
                      className="border-b border-border hover:bg-muted/30"
                    >
                      <td className="p-4">{u.name || '—'}</td>
                      <td className="p-4">{u.email || '—'}</td>
                      <td className="p-4">
                        <select
                          value={u.role || 'user'}
                          onChange={(e) => updateRole(id, e.target.value)}
                          disabled={busy || u.role === 'superadmin'}
                          className="rounded-lg border border-border bg-background px-2 py-1 text-xs"
                        >
                          <option value="user">user</option>
                          <option value="admin">admin</option>
                          <option value="superadmin">superadmin</option>
                        </select>
                      </td>
                      <td className="p-4">{u.city || u.lastLocationCity || '—'}</td>
                      <td className="p-4">{u.state || '—'}</td>
                      <td className="p-4">
                        {u.country || u.lastLocationCountry ? (
                          <span className="flex items-center gap-1">
                            <span>{u.country || u.lastLocationCountry}</span>
                            {u.lastLocationLat != null && u.lastLocationLng != null && (
                              <a
                                href={`https://www.openstreetmap.org/?mlat=${u.lastLocationLat}&mlon=${u.lastLocationLng}#map=12/${u.lastLocationLat}/${u.lastLocationLng}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-primary hover:underline"
                                title="View on map"
                              >
                                Map
                              </a>
                            )}
                          </span>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="p-4">{u.totalBookings ?? 0}</td>
                      <td className="p-4">₹ {(u.totalSpend ?? 0).toLocaleString('en-IN')}</td>
                      <td className="p-4">
                        {u.isBlocked ? (
                          <span className="rounded-full bg-destructive/20 text-destructive px-2 py-1 text-xs font-medium">Blocked</span>
                        ) : (
                          <span className="rounded-full bg-green-500/20 text-green-700 dark:text-green-400 px-2 py-1 text-xs font-medium">Active</span>
                        )}
                      </td>
                      <td className="p-4 text-muted-foreground">{formatDate(u.createdAt)}</td>
                      <td className="p-4 flex items-center gap-1">
                        {u.role !== 'superadmin' && (
                          <>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2"
                              onClick={() => toggleBlock(u)}
                              disabled={busy}
                              title={u.isBlocked ? 'Unblock' : 'Block'}
                            >
                              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Ban className="h-4 w-4" />}
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2 text-destructive hover:text-destructive"
                              onClick={() => deleteUser(u)}
                              disabled={busy}
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {users.length === 0 && (
            <div className="p-12 text-center text-muted-foreground">No users yet.</div>
          )}
        </Card>
      )}
    </div>
  );
}
