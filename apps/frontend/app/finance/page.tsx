'use client';

import { useState } from 'react';
import { apiFetch } from '../../lib/api';

export default function FinancePanel() {
  const [invoiceId, setInvoiceId] = useState('');
  const [clientId, setClientId] = useState('');
  const [note, setNote] = useState('Verified against receipt and transfer reference');
  const [result, setResult] = useState('');

  const verify = async (verified: boolean) => {
    try {
      const data = await apiFetch<{ status: string }>(`/invoices/${invoiceId}/verify`, {
        method: 'PUT',
        body: JSON.stringify({ verified, note, clientId })
      });
      setResult(`Invoice updated to ${data.status}`);
    } catch (error) {
      setResult((error as Error).message);
    }
  };

  return (
    <main className="rounded-xl border bg-white p-6 shadow-sm space-y-3">
      <h2 className="text-xl font-bold">Finance Verification Panel</h2>
      <input value={invoiceId} onChange={(e) => setInvoiceId(e.target.value)} placeholder="Invoice ID" />
      <input value={clientId} onChange={(e) => setClientId(e.target.value)} placeholder="Client User ID" />
      <textarea value={note} onChange={(e) => setNote(e.target.value)} />
      <div className="flex gap-2">
        <button className="bg-emerald-600 text-white" onClick={() => verify(true)}>Verify</button>
        <button className="bg-rose-600 text-white" onClick={() => verify(false)}>Reject</button>
      </div>
      {result ? <p className="text-sm text-slate-600">{result}</p> : null}
    </main>
  );
}
