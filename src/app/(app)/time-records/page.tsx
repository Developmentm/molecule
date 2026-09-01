import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/PageHeader";
import DeleteButton from "@/components/DeleteButton";
import { deleteTimeRecord } from "./actions";
import { formatCurrency, formatDate } from "@/lib/format";

export default async function TimeRecordsPage({
  searchParams,
}: {
  searchParams: Promise<{ matterId?: string; lawyerId?: string }>;
}) {
  const { matterId, lawyerId } = await searchParams;
  const [records, matters, lawyers] = await Promise.all([
    prisma.timeRecord.findMany({
      where: {
        matterId: matterId || undefined,
        lawyerId: lawyerId || undefined,
      },
      include: { matter: true, lawyer: true },
      orderBy: { date: "desc" },
    }),
    prisma.matter.findMany({ orderBy: { caseNumber: "asc" }, select: { id: true, caseNumber: true, title: true } }),
    prisma.lawyer.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);

  const totalHours = records.reduce((s, r) => s + r.hours, 0);
  const totalValue = records.reduce((s, r) => s + (r.billable ? r.hours * r.rate : 0), 0);

  return (
    <div>
      <PageHeader title="TimeRecord List" action={{ label: "+ Add TimeRecord", href: "/time-records/new" }} />

      <form className="mb-4 flex flex-wrap gap-3" method="get">
        <select name="matterId" defaultValue={matterId ?? ""} className="input max-w-xs">
          <option value="">All Matters</option>
          {matters.map((m) => (
            <option key={m.id} value={m.id}>{m.caseNumber} — {m.title}</option>
          ))}
        </select>
        <select name="lawyerId" defaultValue={lawyerId ?? ""} className="input max-w-xs">
          <option value="">All Lawyers</option>
          {lawyers.map((l) => (
            <option key={l.id} value={l.id}>{l.name}</option>
          ))}
        </select>
        <button type="submit" className="btn-secondary">Filter</button>
      </form>

      <div className="mb-4 flex gap-6 text-sm text-slate-600">
        <span>Total Hours: <strong className="text-slate-800">{totalHours.toFixed(2)}</strong></span>
        <span>Billable Value: <strong className="text-slate-800">{formatCurrency(totalValue)}</strong></span>
      </div>

      <div className="card overflow-x-auto p-0">
        <table className="table-base">
          <thead>
            <tr>
              <th>Date</th>
              <th>Matter</th>
              <th>Lawyer</th>
              <th>Hours</th>
              <th>Rate</th>
              <th>Description</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r.id}>
                <td className="whitespace-nowrap">{formatDate(r.date)}</td>
                <td className="whitespace-nowrap">{r.matter.caseNumber}</td>
                <td className="whitespace-nowrap">{r.lawyer.name}</td>
                <td>{r.hours}</td>
                <td>{formatCurrency(r.rate)}</td>
                <td className="max-w-xs">{r.description}</td>
                <td>
                  {r.invoiced ? (
                    <span className="badge bg-green-100 text-green-800">Invoiced</span>
                  ) : r.billable ? (
                    <span className="badge bg-amber-100 text-amber-800">Pending</span>
                  ) : (
                    <span className="badge bg-slate-200 text-slate-600">Non-billable</span>
                  )}
                </td>
                <td>{!r.invoiced && <DeleteButton action={deleteTimeRecord.bind(null, r.id)} label="Delete" confirmText="Time record delete karein?" />}</td>
              </tr>
            ))}
            {records.length === 0 && (
              <tr><td colSpan={8} className="py-8 text-center text-slate-400">Koi time record nahi mila.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
