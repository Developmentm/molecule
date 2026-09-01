import Link from "next/link";
import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/PageHeader";
import { formatCurrency } from "@/lib/format";
import { IconTime, IconInvoice, IconMatter, IconDisbursement } from "@/components/icons";

export default async function ReportsPage() {
  const [
    totalHours,
    billableValue,
    totalDisbursed,
    outstandingInvoices,
    matterByStatus,
  ] = await Promise.all([
    prisma.timeRecord.aggregate({ _sum: { hours: true } }),
    prisma.timeRecord.findMany({ where: { billable: true }, select: { hours: true, rate: true } }),
    prisma.disbursement.aggregate({ _sum: { amount: true } }),
    prisma.invoice.findMany({ where: { status: { in: ["SENT", "OVERDUE"] } }, include: { items: true } }),
    prisma.matter.groupBy({ by: ["status"], _count: { _all: true } }),
  ]);

  const billableTotal = billableValue.reduce((s, t) => s + t.hours * t.rate, 0);
  const outstandingTotal = outstandingInvoices.reduce((s, inv) => s + inv.items.reduce((a, i) => a + i.amount, 0), 0);

  const cards = [
    { label: "Time Report", desc: "Hours & billable value by lawyer / matter, with CSV export.", href: "/time-records/report", icon: IconTime },
    { label: "Invoices", desc: "All invoices, status and outstanding amounts.", href: "/invoices", icon: IconInvoice },
    { label: "Matters", desc: "Case list filterable by status.", href: "/matters", icon: IconMatter },
    { label: "Disbursements", desc: "All firm disbursements across matters.", href: "/disbursements", icon: IconDisbursement },
  ];

  return (
    <div>
      <PageHeader title="Report Management" />

      <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card"><p className="text-xs uppercase text-slate-500">Total Hours Logged</p><p className="text-2xl font-bold">{(totalHours._sum.hours ?? 0).toFixed(2)}</p></div>
        <div className="card"><p className="text-xs uppercase text-slate-500">Billable Value</p><p className="text-2xl font-bold">{formatCurrency(billableTotal)}</p></div>
        <div className="card"><p className="text-xs uppercase text-slate-500">Total Disbursed</p><p className="text-2xl font-bold">{formatCurrency(totalDisbursed._sum.amount ?? 0)}</p></div>
        <div className="card"><p className="text-xs uppercase text-slate-500">Outstanding Invoices</p><p className="text-2xl font-bold">{formatCurrency(outstandingTotal)}</p></div>
      </div>

      <div className="card mb-6">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Matters by Status</h2>
        <div className="flex gap-6">
          {matterByStatus.map((m) => (
            <div key={m.status}>
              <p className="text-sm text-slate-500">{m.status.replace("_", " ")}</p>
              <p className="text-xl font-bold text-slate-800">{m._count._all}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {cards.map((c) => (
          <Link key={c.href} href={c.href} className="card flex items-start gap-4 transition-shadow hover:shadow-md">
            <c.icon className="h-8 w-8 shrink-0 text-blue-900" />
            <div>
              <p className="font-semibold text-slate-800">{c.label}</p>
              <p className="text-sm text-slate-500">{c.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
