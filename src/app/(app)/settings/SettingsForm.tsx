"use client";

import { useActionState } from "react";
import { updateSettings, type SettingsFormState } from "./actions";

type Settings = {
  firmName: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  defaultRate: number;
  invoicePrefix: string;
} | null;

export default function SettingsForm({ settings }: { settings: Settings }) {
  const [state, formAction, pending] = useActionState<SettingsFormState, FormData>(updateSettings, {});

  return (
    <form action={formAction} className="card max-w-2xl space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="firmName">Firm Name *</label>
          <input id="firmName" name="firmName" required defaultValue={settings?.firmName} className="input" />
        </div>
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" name="email" type="email" defaultValue={settings?.email ?? ""} className="input" />
        </div>
        <div>
          <label className="label" htmlFor="phone">Phone</label>
          <input id="phone" name="phone" defaultValue={settings?.phone ?? ""} className="input" />
        </div>
        <div>
          <label className="label" htmlFor="invoicePrefix">Invoice Number Prefix</label>
          <input id="invoicePrefix" name="invoicePrefix" defaultValue={settings?.invoicePrefix ?? "INV"} className="input" />
        </div>
        <div>
          <label className="label" htmlFor="defaultRate">Default Hourly Rate (₹)</label>
          <input id="defaultRate" name="defaultRate" type="number" min={0} step="0.01" defaultValue={settings?.defaultRate ?? 0} className="input" />
        </div>
      </div>
      <div>
        <label className="label" htmlFor="address">Address</label>
        <textarea id="address" name="address" rows={2} defaultValue={settings?.address ?? ""} className="input" />
      </div>

      {state?.error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>}
      {state?.success && <p className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">Settings saved.</p>}

      <button type="submit" disabled={pending} className="btn-primary">
        {pending ? "Saving..." : "Save Settings"}
      </button>
    </form>
  );
}
