"use client";

import { useActionState } from "react";
import type { ClientFormState } from "./actions";

type Client = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  address: string | null;
  notes: string | null;
};

export default function ClientForm({
  action,
  client,
}: {
  action: (prevState: ClientFormState, formData: FormData) => Promise<ClientFormState>;
  client?: Client;
}) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="card max-w-2xl space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="name">Client / Company Name *</label>
          <input id="name" name="name" required defaultValue={client?.name} className="input" />
        </div>
        <div>
          <label className="label" htmlFor="company">Company</label>
          <input id="company" name="company" defaultValue={client?.company ?? ""} className="input" />
        </div>
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" name="email" type="email" defaultValue={client?.email ?? ""} className="input" />
        </div>
        <div>
          <label className="label" htmlFor="phone">Phone</label>
          <input id="phone" name="phone" defaultValue={client?.phone ?? ""} className="input" />
        </div>
      </div>
      <div>
        <label className="label" htmlFor="address">Address</label>
        <textarea id="address" name="address" rows={2} defaultValue={client?.address ?? ""} className="input" />
      </div>
      <div>
        <label className="label" htmlFor="notes">Notes</label>
        <textarea id="notes" name="notes" rows={2} defaultValue={client?.notes ?? ""} className="input" />
      </div>

      {state?.error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
      )}

      <div className="flex gap-3">
        <button type="submit" disabled={pending} className="btn-primary">
          {pending ? "Saving..." : client ? "Save Changes" : "Add Client"}
        </button>
      </div>
    </form>
  );
}
