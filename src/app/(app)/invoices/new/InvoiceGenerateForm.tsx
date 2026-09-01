"use client";

import { useActionState, useMemo, useState } from "react";
import { generateInvoice, type InvoiceFormState } from "../actions";
import { formatCurrency, formatDate } from "@/lib/format";

type TimeRow = { id: string; date: string; lawyerName: string; hours: number; rate: number; description: string };
type DisbRow = { id: string; date: string; amount: number; description: string };

export default function InvoiceGenerateForm({
  matterId,
  matterLabel,
  timeRecords,
  disbursements,
  defaultDueDate,
}: {
  matterId: string;
  matterLabel: string;
  timeRecords: TimeRow[];
  disbursements: DisbRow[];
  defaultDueDate: string;
}) {
  const [state, formAction, pending] = useActionState<InvoiceFormState, FormData>(generateInvoice, {});
  const [selectedTime, setSelectedTime] = useState<Set<string>>(new Set(timeRecords.map((t) => t.id)));
  const [selectedDisb, setSelectedDisb] = useState<Set<string>>(new Set(disbursements.map((d) => d.id)));

  const total = useMemo(() => {
    const timeTotal = timeRecords.filter((t) => selectedTime.has(t.id)).reduce((s, t) => s + t.hours * t.rate, 0);
    const disbTotal = disbursements.filter((d) => selectedDisb.has(d.id)).reduce((s, d) => s + d.amount, 0);
    return timeTotal + disbTotal;
  }, [selectedTime, selectedDisb, timeRecords, disbursements]);

  function toggle(set: Set<string>, id: string, setter: (s: Set<string>) => void) {
    const next = new Set(set);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setter(next);
  }

  const nothingToBill = timeRecords.length === 0 && disbursements.length === 0;

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="matterId" value={matterId} />
      <div className="card">
        <p className="text-sm text-slate-500">Matter</p>
        <p className="font-medium text-slate-800">{matterLabel}</p>
      </div>

      {nothingToBill ? (
        <div className="card text-center text-slate-400">Is matter ke liye koi unbilled time record ya disbursement nahi hai.</div>
      ) : (
        <>
          {timeRecords.length > 0 && (
            <div className="card overflow-x-auto p-0">
              <h2 className="px-4 pt-4 text-sm font-semibold uppercase tracking-wide text-slate-500">Unbilled Time Records</h2>
              <table className="table-base mt-2">
                <thead>
                  <tr><th></th><th>Date</th><th>Lawyer</th><th>Hours</th><th>Rate</th><th>Amount</th><th>Description</th></tr>
                </thead>
                <tbody>
                  {timeRecords.map((t) => (
                    <tr key={t.id}>
                      <td>
                        <input
                          type="checkbox"
                          name="timeRecordIds"
                          value={t.id}
                          checked={selectedTime.has(t.id)}
                          onChange={() => toggle(selectedTime, t.id, setSelectedTime)}
                          className="h-4 w-4 rounded border-slate-300"
                        />
                      </td>
                      <td className="whitespace-nowrap">{formatDate(t.date)}</td>
                      <td>{t.lawyerName}</td>
                      <td>{t.hours}</td>
                      <td>{formatCurrency(t.rate)}</td>
                      <td>{formatCurrency(t.hours * t.rate)}</td>
                      <td>{t.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {disbursements.length > 0 && (
            <div className="card overflow-x-auto p-0">
              <h2 className="px-4 pt-4 text-sm font-semibold uppercase tracking-wide text-slate-500">Unbilled Disbursements</h2>
              <table className="table-base mt-2">
                <thead>
                  <tr><th></th><th>Date</th><th>Description</th><th>Amount</th></tr>
                </thead>
                <tbody>
                  {disbursements.map((d) => (
                    <tr key={d.id}>
                      <td>
                        <input
                          type="checkbox"
                          name="disbursementIds"
                          value={d.id}
                          checked={selectedDisb.has(d.id)}
                          onChange={() => toggle(selectedDisb, d.id, setSelectedDisb)}
                          className="h-4 w-4 rounded border-slate-300"
                        />
                      </td>
                      <td className="whitespace-nowrap">{formatDate(d.date)}</td>
                      <td>{d.description}</td>
                      <td>{formatCurrency(d.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="card max-w-xl space-y-4">
            <div className="flex justify-between border-b border-slate-100 pb-3 text-lg font-semibold text-slate-800">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
            <div>
              <label className="label" htmlFor="dueDate">Due Date *</label>
              <input id="dueDate" name="dueDate" type="date" required defaultValue={defaultDueDate} className="input" />
            </div>
            <div>
              <label className="label" htmlFor="notes">Notes</label>
              <textarea id="notes" name="notes" rows={2} className="input" placeholder="Payment terms, bank details, etc." />
            </div>

            {state?.error && (
              <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
            )}

            <button type="submit" disabled={pending} className="btn-primary">
              {pending ? "Generating..." : "Generate Invoice"}
            </button>
          </div>
        </>
      )}
    </form>
  );
}
