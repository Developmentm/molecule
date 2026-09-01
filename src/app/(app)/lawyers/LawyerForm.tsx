"use client";

import { useActionState } from "react";
import type { LawyerFormState } from "./actions";

type Lawyer = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  barNumber: string | null;
  designation: string;
  hourlyRate: number;
  inCharge: boolean;
};

export default function LawyerForm({
  action,
  lawyer,
}: {
  action: (prevState: LawyerFormState, formData: FormData) => Promise<LawyerFormState>;
  lawyer?: Lawyer;
}) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="card max-w-2xl space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="name">Full Name *</label>
          <input id="name" name="name" required defaultValue={lawyer?.name} className="input" />
        </div>
        <div>
          <label className="label" htmlFor="email">Email *</label>
          <input id="email" name="email" type="email" required defaultValue={lawyer?.email} className="input" />
        </div>
        <div>
          <label className="label" htmlFor="phone">Phone</label>
          <input id="phone" name="phone" defaultValue={lawyer?.phone ?? ""} className="input" />
        </div>
        <div>
          <label className="label" htmlFor="barNumber">Bar Number</label>
          <input id="barNumber" name="barNumber" defaultValue={lawyer?.barNumber ?? ""} className="input" />
        </div>
        <div>
          <label className="label" htmlFor="designation">Designation *</label>
          <select id="designation" name="designation" defaultValue={lawyer?.designation ?? "LAWYER"} className="input">
            <option value="LAWYER">Lawyer</option>
            <option value="PARTNER">Partner</option>
            <option value="ASSOCIATE_PARTNER">Associate Partner</option>
          </select>
        </div>
        <div>
          <label className="label" htmlFor="hourlyRate">Hourly Rate (₹)</label>
          <input id="hourlyRate" name="hourlyRate" type="number" min={0} step="0.01" defaultValue={lawyer?.hourlyRate ?? 0} className="input" />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input type="checkbox" name="inCharge" defaultChecked={lawyer?.inCharge} className="h-4 w-4 rounded border-slate-300" />
        Mark as In Charge lawyer
      </label>

      {state?.error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
      )}

      <div className="flex gap-3">
        <button type="submit" disabled={pending} className="btn-primary">
          {pending ? "Saving..." : lawyer ? "Save Changes" : "Add Lawyer"}
        </button>
      </div>
    </form>
  );
}
