'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '../../lib/api';

export default function AdminAnalytics() {
  const [stats, setStats] = useState<{ users: number; projects: number; invoices: number; revenue: number } | null>(null);

  useEffect(() => {
    apiFetch<{ users: number; projects: number; invoices: number; revenue: number }>('/admin/analytics')
      .then(setStats)
      .catch(() => setStats(null));
  }, []);

  return (
    <main className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold mb-4">Admin Analytics Dashboard</h2>
      {!stats ? <p className="text-slate-600">Unable to load analytics (ensure admin login token).</p> : (
        <div className="grid md:grid-cols-4 gap-3">
          <div className="border rounded p-3"><p className="text-xs text-slate-500">Users</p><p className="text-2xl font-bold">{stats.users}</p></div>
          <div className="border rounded p-3"><p className="text-xs text-slate-500">Projects</p><p className="text-2xl font-bold">{stats.projects}</p></div>
          <div className="border rounded p-3"><p className="text-xs text-slate-500">Invoices</p><p className="text-2xl font-bold">{stats.invoices}</p></div>
          <div className="border rounded p-3"><p className="text-xs text-slate-500">Revenue</p><p className="text-2xl font-bold">${stats.revenue}</p></div>
        </div>
      )}
    </main>
  );
}
