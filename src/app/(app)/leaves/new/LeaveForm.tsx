"use client";

import { useActionState } from "react";
import { applyLeave, type LeaveFormState } from "../actions";

export default function LeaveForm({ lawyers }: { lawyers: { id: string; name: string }[] }) {
  const [state, formAction, pending] = useActionState<LeaveFormState, FormData>(applyLeave, {});

  return (
    <form action={formAction} className="card max-w-xl space-y-4">
      <div>
        <label className="label" htmlFor="lawyerId">Lawyer *</label>
        <select id="lawyerId" name="lawyerId" required defaultValue="" className="input">
          <option value="" disabled>Select lawyer</option>
          {lawyers.map((l) => (
            <option key={l.id} value={l.id}>{l.name}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label" htmlFor="startDate">From *</label>
          <input id="startDate" name="startDate" type="date" required className="input" />
        </div>
        <div>
          <label className="label" htmlFor="endDate">To *</label>
          <input id="endDate" name="endDate" type="date" required className="input" />
        </div>
      </div>
      <div>
        <label className="label" htmlFor="type">Leave Type</label>
        <select id="type" name="type" defaultValue="Casual" className="input">
          <option value="Casual">Casual</option>
          <option value="Sick">Sick</option>
          <option value="Earned">Earned</option>
          <option value="Unpaid">Unpaid</option>
        </select>
      </div>
      <div>
        <label className="label" htmlFor="reason">Reason</label>
        <textarea id="reason" name="reason" rows={3} className="input" />
      </div>

      {state?.error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
      )}

      <button type="submit" disabled={pending} className="btn-primary">
        {pending ? "Submitting..." : "Apply Leave"}
      </button>
    </form>
  );
}
