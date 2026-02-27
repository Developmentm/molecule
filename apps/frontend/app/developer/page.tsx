'use client';

import { useState } from 'react';
import { apiFetch } from '../../lib/api';

export default function DeveloperBoard() {
  const [taskId, setTaskId] = useState('demo-task');
  const [status, setStatus] = useState('In Progress');
  const [timeLogHours, setTimeLogHours] = useState(8);
  const [result, setResult] = useState('');

  const update = async () => {
    try {
      const data = await apiFetch<{ status: string }>(`/tasks/${taskId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status, timeLogHours })
      });
      setResult(`Task updated: ${data.status}`);
    } catch (error) {
      setResult((error as Error).message);
    }
  };

  return (
    <main className="rounded-xl border bg-white p-6 shadow-sm space-y-3">
      <h2 className="text-xl font-bold">Developer Task Board</h2>
      <input value={taskId} onChange={(e) => setTaskId(e.target.value)} placeholder="Task ID" />
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        {['Not Started', 'In Progress', 'Under Review', 'Approved', 'Rework'].map((s) => <option key={s}>{s}</option>)}
      </select>
      <input type="number" value={timeLogHours} onChange={(e) => setTimeLogHours(Number(e.target.value))} />
      <button className="bg-indigo-600 text-white" onClick={update}>Update Task</button>
      {result ? <p className="text-sm text-slate-600">{result}</p> : null}
    </main>
  );
}
