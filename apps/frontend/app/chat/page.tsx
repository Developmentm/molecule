'use client';

import { useState } from 'react';
import { apiFetch } from '../../lib/api';

export default function ChatPage() {
  const [requirementId, setRequirementId] = useState('demo-requirement');
  const [message, setMessage] = useState('Need timeline and milestone split');
  const [responses, setResponses] = useState<string[]>([]);

  const send = async () => {
    try {
      const data = await apiFetch<{ message: string }>(`/requirements/${requirementId}/chat`, {
        method: 'POST',
        body: JSON.stringify({ message })
      });
      setResponses((prev) => [...prev, `You: ${message}`, `AI: ${data.message}`]);
      setMessage('');
    } catch (error) {
      setResponses((prev) => [...prev, `Error: ${(error as Error).message}`]);
    }
  };

  return (
    <main className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
      <h2 className="text-xl font-bold">AI Virtual Scoping Assistant</h2>
      <div className="grid md:grid-cols-4 gap-3">
        <input value={requirementId} onChange={(e) => setRequirementId(e.target.value)} placeholder="Requirement ID" />
        <input className="md:col-span-2" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Ask AI to refine scope" />
        <button className="bg-indigo-600 text-white" onClick={send}>Send</button>
      </div>
      <div className="bg-slate-50 rounded p-3 min-h-32">
        {responses.map((line, idx) => <p className="text-sm mb-1" key={idx}>{line}</p>)}
      </div>
    </main>
  );
}
