'use client';

import { useState } from 'react';
import { apiFetch } from '../../lib/api';

export default function InvoicePage() {
  const [quotationId, setQuotationId] = useState('');
  const [invoiceId, setInvoiceId] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('TXN-DEMO-001');
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [result, setResult] = useState('');

  const createInvoice = async () => {
    try {
      const data = await apiFetch<{ id: string; invoiceNumber: string }>('/invoices', {
        method: 'POST',
        body: JSON.stringify({ quotationId })
      });
      setInvoiceId(data.id);
      setResult(`Invoice created: ${data.invoiceNumber}`);
    } catch (error) {
      setResult((error as Error).message);
    }
  };

  const uploadReceipt = async () => {
    if (!receiptFile) {
      setResult('Please choose a receipt file first');
      return;
    }
    try {
      const form = new FormData();
      form.append('referenceNumber', referenceNumber);
      form.append('file', receiptFile);
      const data = await apiFetch<{ status: string; fileUrl: string }>(`/invoices/${invoiceId}/receipt`, {
        method: 'POST',
        body: form
      });
      setResult(`Receipt uploaded (${data.status})`);
    } catch (error) {
      setResult((error as Error).message);
    }
  };

  return (
    <main className="rounded-xl border bg-white p-6 shadow-sm space-y-3">
      <h2 className="text-xl font-bold">Invoice & Receipt</h2>
      <input value={quotationId} onChange={(e) => setQuotationId(e.target.value)} placeholder="Quotation ID" />
      <button className="bg-indigo-600 text-white" onClick={createInvoice}>Generate Invoice</button>
      <input value={invoiceId} onChange={(e) => setInvoiceId(e.target.value)} placeholder="Invoice ID" />
      <input value={referenceNumber} onChange={(e) => setReferenceNumber(e.target.value)} placeholder="Transaction Reference" />
      <input type="file" accept="image/*,.pdf" onChange={(e) => setReceiptFile(e.target.files?.[0] || null)} />
      <button className="bg-emerald-600 text-white" onClick={uploadReceipt}>Upload Receipt</button>
      {invoiceId ? (
        <a className="text-indigo-600 underline text-sm block" href={`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000'}/invoices/${invoiceId}/pdf`} target="_blank">
          Download Invoice PDF
        </a>
      ) : null}
      {result ? <p className="text-sm text-slate-600">{result}</p> : null}
    </main>
  );
}
