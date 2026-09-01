"use client";

import { useActionState } from "react";
import type { MatterFormState } from "./actions";

type Option = { id: string; name: string };
type Matter = {
  id: string;
  caseNumber: string;
  title: string;
  description: string | null;
  clientId: string;
  locationId: string | null;
  status: string;
  billingRate: number | null;
  lawyers: { lawyerId: string }[];
};

export default function MatterForm({
  action,
  matter,
  clients,
  locations,
  lawyers,
  defaultClientId,
}: {
  action: (prevState: MatterFormState, formData: FormData) => Promise<MatterFormState>;
  matter?: Matter;
  clients: Option[];
  locations: Option[];
  lawyers: Option[];
  defaultClientId?: string;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  const selectedLawyerIds = new Set(matter?.lawyers.map((l) => l.lawyerId) ?? []);

  return (
    <form action={formAction} className="card max-w-3xl space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="caseNumber">Case Number *</label>
          <input id="caseNumber" name="caseNumber" required defaultValue={matter?.caseNumber} className="input" />
        </div>
        <div>
          <label className="label" htmlFor="status">Status *</label>
          <select id="status" name="status" defaultValue={matter?.status ?? "OPEN"} className="input">
            <option value="OPEN">Open</option>
            <option value="ON_HOLD">On Hold</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>
      </div>

      <div>
        <label className="label" htmlFor="title">Matter Title *</label>
        <input id="title" name="title" required defaultValue={matter?.title} className="input" />
      </div>

      <div>
        <label className="label" htmlFor="description">Description</label>
        <textarea id="description" name="description" rows={3} defaultValue={matter?.description ?? ""} className="input" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className="label" htmlFor="clientId">Client *</label>
          <select id="clientId" name="clientId" required defaultValue={matter?.clientId ?? defaultClientId ?? ""} className="input">
            <option value="" disabled>Select client</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="locationId">Location</label>
          <select id="locationId" name="locationId" defaultValue={matter?.locationId ?? ""} className="input">
            <option value="">—</option>
            {locations.map((l) => (
              <option key={l.id} value={l.id}>{l.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="billingRate">Billing Rate (₹/hr)</label>
          <input id="billingRate" name="billingRate" type="number" min={0} step="0.01" defaultValue={matter?.billingRate ?? ""} className="input" />
        </div>
      </div>

      <div>
        <label className="label">Assigned Lawyers *</label>
        <div className="grid grid-cols-2 gap-2 rounded-md border border-slate-200 p-3 sm:grid-cols-3">
          {lawyers.map((l) => (
            <label key={l.id} className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                name="lawyerIds"
                value={l.id}
                defaultChecked={selectedLawyerIds.has(l.id)}
                className="h-4 w-4 rounded border-slate-300"
              />
              {l.name}
            </label>
          ))}
        </div>
      </div>

      {state?.error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
      )}

      <div className="flex gap-3">
        <button type="submit" disabled={pending} className="btn-primary">
          {pending ? "Saving..." : matter ? "Save Changes" : "Create Matter"}
        </button>
      </div>
    </form>
  );
}
