'use client';

import { useState } from 'react';
import { apiFetch } from '../../lib/api';

export default function QuotationPage() {
  const [requirementId, setRequirementId] = useState('demo-requirement');
  const [result, setResult] = useState('');

  const create = async () => {
    const lineItems = [
      { name: 'Discovery', amount: 2000 },
      { name: 'Development', amount: 7000 },
      { name: 'UAT', amount: 1000 }
    ];
    try {
      const data = await apiFetch<{ id: string; total: number; status: string }>('/quotations', {
        method: 'POST',
        body: JSON.stringify({ requirementId, lineItems })
      });
      setResult(`Quotation ${data.id} created. Total ${data.total} (${data.status})`);
    } catch (error) {
      setResult((error as Error).message);
    }
  };

  return (
    <main className="rounded-xl border bg-white p-6 shadow-sm space-y-3">
      <h2 className="text-xl font-bold">Quotation Generator</h2>
      <input value={requirementId} onChange={(e) => setRequirementId(e.target.value)} placeholder="Requirement ID" />
      <button className="bg-indigo-600 text-white" onClick={create}>Create Quotation</button>
      {result ? <p className="text-sm text-slate-600">{result}</p> : null}
    </main>
  );
}
