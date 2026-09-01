"use client";

import { useActionState } from "react";
import { createDisbursement, type DisbursementFormState } from "../actions";

type Matter = { id: string; caseNumber: string; title: string };

export default function DisbursementForm({
  matters,
  defaultMatterId,
  today,
}: {
  matters: Matter[];
  defaultMatterId?: string;
  today: string;
}) {
  const [state, formAction, pending] = useActionState<DisbursementFormState, FormData>(createDisbursement, {});

  return (
    <form action={formAction} className="card max-w-xl space-y-4">
      <div>
        <label className="label" htmlFor="matterId">Matter *</label>
        <select id="matterId" name="matterId" required defaultValue={defaultMatterId ?? ""} className="input">
          <option value="" disabled>Select matter</option>
          {matters.map((m) => (
            <option key={m.id} value={m.id}>{m.caseNumber} — {m.title}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label" htmlFor="date">Date *</label>
          <input id="date" name="date" type="date" required defaultValue={today} className="input" />
        </div>
        <div>
          <label className="label" htmlFor="amount">Amount (₹) *</label>
          <input id="amount" name="amount" type="number" min={0} step="0.01" required className="input" />
        </div>
      </div>
      <div>
        <label className="label" htmlFor="description">Description *</label>
        <textarea id="description" name="description" rows={3} required className="input" placeholder="e.g. Court filing fees, courier charges" />
      </div>

      {state?.error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
      )}

      <button type="submit" disabled={pending} className="btn-primary">
        {pending ? "Saving..." : "Add Disbursement"}
      </button>
    </form>
  );
}
