import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/PageHeader";
import { formatCurrency, formatDate, toDateInputValue } from "@/lib/format";

function buildWhere(params: { from?: string; to?: string; matterId?: string; lawyerId?: string }) {
  const where: Record<string, unknown> = {};
  if (params.matterId) where.matterId = params.matterId;
  if (params.lawyerId) where.lawyerId = params.lawyerId;
  if (params.from || params.to) {
    where.date = {
      ...(params.from ? { gte: new Date(params.from) } : {}),
      ...(params.to ? { lte: new Date(`${params.to}T23:59:59`) } : {}),
    };
  }
  return where;
}

export default async function TimeReportPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string; matterId?: string; lawyerId?: string }>;
}) {
  const params = await searchParams;
  const from = params.from ?? toDateInputValue(new Date(new Date().setDate(1)));
  const to = params.to ?? toDateInputValue(new Date());

  const [records, matters, lawyers] = await Promise.all([
    prisma.timeRecord.findMany({
      where: buildWhere({ ...params, from, to }),
      include: { matter: true, lawyer: true },
      orderBy: { date: "asc" },
    }),
    prisma.matter.findMany({ orderBy: { caseNumber: "asc" }, select: { id: true, caseNumber: true, title: true } }),
    prisma.lawyer.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);

  const byLawyer = new Map<string, { name: string; hours: number; value: number }>();
  for (const r of records) {
    const cur = byLawyer.get(r.lawyerId) ?? { name: r.lawyer.name, hours: 0, value: 0 };
    cur.hours += r.hours;
    cur.value += r.billable ? r.hours * r.rate : 0;
    byLawyer.set(r.lawyerId, cur);
  }

  const totalHours = records.reduce((s, r) => s + r.hours, 0);
  const totalValue = records.reduce((s, r) => s + (r.billable ? r.hours * r.rate : 0), 0);

  const exportQuery = new URLSearchParams({
    from,
    to,
    ...(params.matterId ? { matterId: params.matterId } : {}),
    ...(params.lawyerId ? { lawyerId: params.lawyerId } : {}),
  }).toString();

  return (
    <div>
      <PageHeader title="Time Report Generate" />

      <form className="mb-4 flex flex-wrap items-end gap-3" method="get">
        <div>
          <label className="label" htmlFor="from">From</label>
          <input id="from" name="from" type="date" defaultValue={from} className="input" />
        </div>
        <div>
          <label className="label" htmlFor="to">To</label>
          <input id="to" name="to" type="date" defaultValue={to} className="input" />
        </div>
        <div>
          <label className="label" htmlFor="matterId">Matter</label>
          <select id="matterId" name="matterId" defaultValue={params.matterId ?? ""} className="input">
            <option value="">All</option>
            {matters.map((m) => (
              <option key={m.id} value={m.id}>{m.caseNumber}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="lawyerId">Lawyer</label>
          <select id="lawyerId" name="lawyerId" defaultValue={params.lawyerId ?? ""} className="input">
            <option value="">All</option>
            {lawyers.map((l) => (
              <option key={l.id} value={l.id}>{l.name}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn-secondary">Generate</button>
        <a href={`/time-records/report/export?${exportQuery}`} className="btn-primary">Export CSV</a>
      </form>

      <div className="mb-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="card"><p className="text-xs text-slate-500 uppercase">Entries</p><p className="text-2xl font-bold">{records.length}</p></div>
        <div className="card"><p className="text-xs text-slate-500 uppercase">Total Hours</p><p className="text-2xl font-bold">{totalHours.toFixed(2)}</p></div>
        <div className="card"><p className="text-xs text-slate-500 uppercase">Billable Value</p><p className="text-2xl font-bold">{formatCurrency(totalValue)}</p></div>
      </div>

      <div className="card mb-5">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Summary by Lawyer</h2>
        <table className="table-base">
          <thead><tr><th>Lawyer</th><th>Hours</th><th>Billable Value</th></tr></thead>
          <tbody>
            {[...byLawyer.values()].map((v) => (
              <tr key={v.name}><td>{v.name}</td><td>{v.hours.toFixed(2)}</td><td>{formatCurrency(v.value)}</td></tr>
            ))}
            {byLawyer.size === 0 && <tr><td colSpan={3} className="py-4 text-center text-slate-400">Koi data nahi.</td></tr>}
          </tbody>
        </table>
      </div>

      <div className="card overflow-x-auto p-0">
        <table className="table-base">
          <thead><tr><th>Date</th><th>Matter</th><th>Lawyer</th><th>Hours</th><th>Value</th><th>Description</th></tr></thead>
          <tbody>
            {records.map((r) => (
              <tr key={r.id}>
                <td className="whitespace-nowrap">{formatDate(r.date)}</td>
                <td>{r.matter.caseNumber}</td>
                <td>{r.lawyer.name}</td>
                <td>{r.hours}</td>
                <td>{formatCurrency(r.billable ? r.hours * r.rate : 0)}</td>
                <td>{r.description}</td>
              </tr>
            ))}
            {records.length === 0 && <tr><td colSpan={6} className="py-8 text-center text-slate-400">Koi record nahi mila.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
