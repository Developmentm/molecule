'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '../../lib/api';

type Stats = { users: number; projects: number; invoices: number; revenue: number };
type User = { id: string; name: string; email: string; role: string; status: string };

export default function AdminAnalytics() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      apiFetch<Stats>('/admin/analytics'),
      apiFetch<User[]>('/admin/users')
    ])
      .then(([analytics, usersList]) => {
        setStats(analytics);
        setUsers(usersList);
      })
      .catch(() => {
        setError('Unable to load admin data. Login as admin first, then follow sequence from step 1.');
      });
  }, []);

  return (
    <main className="space-y-4">
      <section className="rounded-xl border bg-white dark:bg-slate-900 p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-1">Admin Oversight Dashboard</h2>
        <p className="text-sm text-slate-500">Final checkpoint in the delivery sequence. Validate metrics, users, and project health.</p>
      </section>

      {!stats ? (
        <section className="rounded-xl border bg-amber-50 dark:bg-amber-950/30 p-6">
          <p className="text-amber-700 dark:text-amber-300">{error || 'Loading admin analytics...'}</p>
        </section>
      ) : (
        <>
          <section className="grid md:grid-cols-4 gap-3">
            <div className="border rounded-xl p-4 bg-white dark:bg-slate-900"><p className="text-xs text-slate-500">Users</p><p className="text-2xl font-bold">{stats.users}</p></div>
            <div className="border rounded-xl p-4 bg-white dark:bg-slate-900"><p className="text-xs text-slate-500">Projects</p><p className="text-2xl font-bold">{stats.projects}</p></div>
            <div className="border rounded-xl p-4 bg-white dark:bg-slate-900"><p className="text-xs text-slate-500">Invoices</p><p className="text-2xl font-bold">{stats.invoices}</p></div>
            <div className="border rounded-xl p-4 bg-white dark:bg-slate-900"><p className="text-xs text-slate-500">Revenue</p><p className="text-2xl font-bold">${stats.revenue}</p></div>
          </section>

          <section className="rounded-xl border bg-white dark:bg-slate-900 p-6 shadow-sm">
            <h3 className="font-semibold mb-3">User Management Snapshot</h3>
            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="py-2">Name</th>
                    <th className="py-2">Email</th>
                    <th className="py-2">Role</th>
                    <th className="py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {users.slice(0, 8).map((user) => (
                    <tr className="border-b" key={user.id}>
                      <td className="py-2">{user.name}</td>
                      <td className="py-2">{user.email}</td>
                      <td className="py-2">{user.role}</td>
                      <td className="py-2">{user.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </main>
  );
}
