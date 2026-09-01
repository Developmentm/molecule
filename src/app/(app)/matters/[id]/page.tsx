import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/PageHeader";
import DeleteButton from "@/components/DeleteButton";
import { deleteMatter } from "../actions";
import { formatCurrency, formatDate } from "@/lib/format";

const STATUS_STYLE: Record<string, string> = {
  OPEN: "bg-green-100 text-green-800",
  ON_HOLD: "bg-amber-100 text-amber-800",
  CLOSED: "bg-slate-200 text-slate-600",
};

const INVOICE_STYLE: Record<string, string> = {
  DRAFT: "bg-slate-200 text-slate-700",
  SENT: "bg-blue-100 text-blue-900",
  PAID: "bg-green-100 text-green-800",
  OVERDUE: "bg-red-100 text-red-800",
};

export default async function MatterDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const matter = await prisma.matter.findUnique({
    where: { id },
    include: {
      client: true,
      location: true,
      lawyers: { include: { lawyer: true } },
      timeRecords: { include: { lawyer: true }, orderBy: { date: "desc" } },
      disbursements: { orderBy: { date: "desc" } },
      invoices: true,
    },
  });
  if (!matter) notFound();

  const totalHours = matter.timeRecords.reduce((s, t) => s + t.hours, 0);
  const totalBillable = matter.timeRecords.reduce((s, t) => s + (t.billable ? t.hours * t.rate : 0), 0);
  const totalDisbursed = matter.disbursements.reduce((s, d) => s + d.amount, 0);
  const unbilledTime = matter.timeRecords.filter((t) => t.billable && !t.invoiced).length;
  const unbilledDisb = matter.disbursements.filter((d) => !d.invoiced).length;

  return (
    <div>
      <PageHeader title={matter.title} />

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <span className={`badge ${STATUS_STYLE[matter.status]}`}>{matter.status.replace("_", " ")}</span>
        <span className="text-sm text-slate-500">Case No: <strong className="text-slate-700">{matter.caseNumber}</strong></span>
        <span className="text-sm text-slate-500">Opened: {formatDate(matter.openDate)}</span>
        {matter.location && <span className="text-sm text-slate-500">Location: {matter.location.name}</span>}
        <div className="ml-auto flex gap-4">
          <Link href={`/matters/${matter.id}/edit`} className="text-sm font-medium text-blue-900 hover:underline">Edit</Link>
          <DeleteButton action={deleteMatter.bind(null, matter.id)} confirmText="Matter delete karein?" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="card lg:col-span-1 space-y-4">
          <div>
            <h2 className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Client</h2>
            <Link href={`/clients/${matter.client.id}`} className="font-medium text-blue-900 hover:underline">{matter.client.name}</Link>
          </div>
          <div>
            <h2 className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Lawyers</h2>
            <ul className="space-y-1 text-sm">
              {matter.lawyers.map((ml) => (
                <li key={ml.id}>{ml.lawyer.name} <span className="text-xs text-slate-400">({ml.lawyer.designation.replace("_", " ")})</span></li>
              ))}
            </ul>
          </div>
          {matter.description && (
            <div>
              <h2 className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Description</h2>
              <p className="text-sm text-slate-600">{matter.description}</p>
            </div>
          )}
          <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-3 text-sm">
            <div><p className="text-slate-500">Total Hours</p><p className="font-semibold text-slate-800">{totalHours.toFixed(2)}</p></div>
            <div><p className="text-slate-500">Billable Value</p><p className="font-semibold text-slate-800">{formatCurrency(totalBillable)}</p></div>
            <div><p className="text-slate-500">Disbursements</p><p className="font-semibold text-slate-800">{formatCurrency(totalDisbursed)}</p></div>
            <div><p className="text-slate-500">Unbilled Items</p><p className="font-semibold text-slate-800">{unbilledTime + unbilledDisb}</p></div>
          </div>
          {(unbilledTime + unbilledDisb) > 0 && (
            <Link href={`/invoices/new?matterId=${matter.id}`} className="btn-primary w-full">
              Generate Invoice
            </Link>
          )}
        </div>

        <div className="lg:col-span-2 space-y-5">
          <div className="card">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Time Records</h2>
              <Link href={`/time-records/new?matterId=${matter.id}`} className="text-sm font-medium text-blue-900 hover:underline">+ Add</Link>
            </div>
            <table className="table-base">
              <thead>
                <tr><th>Date</th><th>Lawyer</th><th>Hours</th><th>Description</th><th>Billed</th></tr>
              </thead>
              <tbody>
                {matter.timeRecords.slice(0, 8).map((t) => (
                  <tr key={t.id}>
                    <td>{formatDate(t.date)}</td>
                    <td>{t.lawyer.name}</td>
                    <td>{t.hours}</td>
                    <td>{t.description}</td>
                    <td>{t.invoiced ? "Yes" : t.billable ? "Pending" : "Non-billable"}</td>
                  </tr>
                ))}
                {matter.timeRecords.length === 0 && (
                  <tr><td colSpan={5} className="py-4 text-center text-slate-400">Koi time record nahi hai.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="card">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Disbursements</h2>
              <Link href={`/disbursements/new?matterId=${matter.id}`} className="text-sm font-medium text-blue-900 hover:underline">+ Add</Link>
            </div>
            <table className="table-base">
              <thead>
                <tr><th>Date</th><th>Description</th><th>Amount</th><th>Billed</th></tr>
              </thead>
              <tbody>
                {matter.disbursements.map((d) => (
                  <tr key={d.id}>
                    <td>{formatDate(d.date)}</td>
                    <td>{d.description}</td>
                    <td>{formatCurrency(d.amount)}</td>
                    <td>{d.invoiced ? "Yes" : "Pending"}</td>
                  </tr>
                ))}
                {matter.disbursements.length === 0 && (
                  <tr><td colSpan={4} className="py-4 text-center text-slate-400">Koi disbursement nahi hai.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="card">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Invoices</h2>
            <table className="table-base">
              <thead>
                <tr><th>Invoice #</th><th>Issue Date</th><th>Status</th></tr>
              </thead>
              <tbody>
                {matter.invoices.map((inv) => (
                  <tr key={inv.id}>
                    <td>
                      <Link href={`/invoices/${inv.id}`} className="font-medium text-blue-900 hover:underline">{inv.invoiceNumber}</Link>
                    </td>
                    <td>{formatDate(inv.issueDate)}</td>
                    <td><span className={`badge ${INVOICE_STYLE[inv.status]}`}>{inv.status}</span></td>
                  </tr>
                ))}
                {matter.invoices.length === 0 && (
                  <tr><td colSpan={3} className="py-4 text-center text-slate-400">Koi invoice nahi hai.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
