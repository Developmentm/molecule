"use client";

import { useActionState, useState } from "react";
import { createTimeRecord, type TimeRecordFormState } from "../actions";

type Matter = { id: string; caseNumber: string; title: string };
type Lawyer = { id: string; name: string; hourlyRate: number };

export default function TimeRecordForm({
  matters,
  lawyers,
  defaultMatterId,
  today,
}: {
  matters: Matter[];
  lawyers: Lawyer[];
  defaultMatterId?: string;
  today: string;
}) {
  const [state, formAction, pending] = useActionState<TimeRecordFormState, FormData>(createTimeRecord, {});
  const [rate, setRate] = useState<number | "">("");

  return (
    <form action={formAction} className="card max-w-2xl space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="matterId">Matter *</label>
          <select id="matterId" name="matterId" required defaultValue={defaultMatterId ?? ""} className="input">
            <option value="" disabled>Select matter</option>
            {matters.map((m) => (
              <option key={m.id} value={m.id}>{m.caseNumber} — {m.title}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="lawyerId">Lawyer *</label>
          <select
            id="lawyerId"
            name="lawyerId"
            required
            defaultValue=""
            className="input"
            onChange={(e) => {
              const l = lawyers.find((x) => x.id === e.target.value);
              setRate(l ? l.hourlyRate : "");
            }}
          >
            <option value="" disabled>Select lawyer</option>
            {lawyers.map((l) => (
              <option key={l.id} value={l.id}>{l.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="date">Date *</label>
          <input id="date" name="date" type="date" required defaultValue={today} className="input" />
        </div>
        <div>
          <label className="label" htmlFor="hours">Hours *</label>
          <input id="hours" name="hours" type="number" min={0.1} step="0.1" required className="input" />
        </div>
        <div>
          <label className="label" htmlFor="rate">Rate (₹/hr) *</label>
          <input
            id="rate"
            name="rate"
            type="number"
            min={0}
            step="0.01"
            required
            value={rate}
            onChange={(e) => setRate(e.target.value === "" ? "" : Number(e.target.value))}
            className="input"
          />
        </div>
        <label className="flex items-center gap-2 self-end pb-2 text-sm text-slate-700">
          <input type="checkbox" name="billable" defaultChecked className="h-4 w-4 rounded border-slate-300" />
          Billable
        </label>
      </div>

      <div>
        <label className="label" htmlFor="description">Work Description *</label>
        <textarea id="description" name="description" rows={3} required className="input" />
      </div>

      {state?.error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
      )}

      <button type="submit" disabled={pending} className="btn-primary">
        {pending ? "Saving..." : "Add Time Record"}
      </button>
    </form>
  );
}
