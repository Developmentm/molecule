"use client";

import { useActionState } from "react";
import { createSubadmin, type SubadminFormState } from "../actions";

export default function SubadminForm() {
  const [state, formAction, pending] = useActionState<SubadminFormState, FormData>(createSubadmin, {});

  return (
    <form action={formAction} className="card max-w-xl space-y-4">
      <div>
        <label className="label" htmlFor="name">Full Name *</label>
        <input id="name" name="name" required className="input" />
      </div>
      <div>
        <label className="label" htmlFor="email">Email *</label>
        <input id="email" name="email" type="email" required className="input" />
      </div>
      <div>
        <label className="label" htmlFor="password">Password *</label>
        <input id="password" name="password" type="password" required minLength={6} className="input" />
      </div>

      {state?.error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>}

      <button type="submit" disabled={pending} className="btn-primary">
        {pending ? "Creating..." : "Add Subadmin"}
      </button>
    </form>
  );
}
