'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { apiFetch } from '../../lib/api';
import { Card } from '../../components/card';
import { ProgressBar } from '../../components/progress';
import { StatusBadge } from '../../components/status-badge';

type Project = { id: string; name: string; status: string; progress: number };

const sequenceCards = [
  { title: 'Submit Requirement', href: '/chat', help: 'Start AI scoping conversation.' },
  { title: 'Review Quotation', href: '/quotations', help: 'Generate and accept quote.' },
  { title: 'Pay Invoice', href: '/invoices', help: 'Upload receipt and reference number.' },
  { title: 'Track Delivery', href: '/pm', help: 'Monitor milestones and progress.' }
];

export default function ClientDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    apiFetch<{ items: Project[] }>('/projects?page=1&pageSize=5').then((data) => setProjects(data.items)).catch(() => setProjects([]));
  }, []);

  return (
    <div className="space-y-4">
      <section className="rounded-xl border bg-white dark:bg-slate-900 p-5 shadow-sm">
        <h2 className="text-xl font-bold">Client Dashboard</h2>
        <p className="text-sm text-slate-500">Follow the sequence cards left-to-right to keep project flow aligned.</p>
        <div className="grid md:grid-cols-4 gap-3 mt-4">
          {sequenceCards.map((item) => (
            <Link key={item.href} href={item.href} className="border rounded-lg p-3 hover:bg-slate-50 dark:hover:bg-slate-800">
              <p className="font-medium text-indigo-700 dark:text-indigo-300">{item.title}</p>
              <p className="text-xs text-slate-500 mt-1">{item.help}</p>
            </Link>
          ))}
        </div>
      </section>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card title="Active Projects">
          <ul className="space-y-3">
            {projects.slice(0, 3).map((project) => (
              <li key={project.id} className="space-y-1">
                <div className="flex justify-between"><span>{project.name}</span><StatusBadge status={project.status} /></div>
                <ProgressBar value={project.progress} />
              </li>
            ))}
          </ul>
        </Card>
        <Card title="Pending Invoices">
          <p className="text-slate-600 dark:text-slate-300">Track invoices from quotation approval to receipt verification.</p>
        </Card>
        <Card title="Recent Messages">
          <p className="text-slate-600 dark:text-slate-300">AI scoping and project updates appear here.</p>
        </Card>
      </div>
    </div>
  );
}
