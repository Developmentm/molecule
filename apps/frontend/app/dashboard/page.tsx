'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '../../lib/api';
import { Card } from '../../components/card';
import { ProgressBar } from '../../components/progress';
import { StatusBadge } from '../../components/status-badge';

type Project = { id: string; name: string; status: string; progress: number };

export default function ClientDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    apiFetch<{ items: Project[] }>('/projects?page=1&pageSize=5').then((data) => setProjects(data.items)).catch(() => setProjects([]));
  }, []);

  return (
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
        <p className="text-slate-600">Track invoices from quotation approval to receipt verification.</p>
      </Card>
      <Card title="Recent Messages">
        <p className="text-slate-600">AI scoping and project updates appear here.</p>
      </Card>
    </div>
  );
}
