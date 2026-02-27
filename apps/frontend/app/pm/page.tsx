'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '../../lib/api';
import { ProgressBar } from '../../components/progress';

type Milestone = { title: string };
type Project = { id: string; name: string; status: string; progress: number; milestones?: Milestone[] };

export default function PMDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const query = search ? `?search=${encodeURIComponent(search)}&page=1&pageSize=10` : '?page=1&pageSize=10';
    apiFetch<{ items: Project[] }>(`/projects${query}`).then((data) => setProjects(data.items)).catch(() => setProjects([]));
  }, [search]);

  return (
    <main className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold mb-4">Project Manager Dashboard</h2>
      <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by project name or status" className="mb-4" />
      <div className="space-y-4">
        {projects.map((project) => (
          <div className="border rounded p-3" key={project.id}>
            <div className="flex justify-between"><span className="font-semibold">{project.name}</span><span>{project.status}</span></div>
            <ProgressBar value={project.progress} />
            <p className="text-xs text-slate-500 mt-2">Timeline: {project.milestones?.map((m) => m.title).join(' → ')}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
