import Link from "next/link";
import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/PageHeader";
import { formatDate } from "@/lib/format";

const STATUS_STYLE: Record<string, string> = {
  OPEN: "bg-green-100 text-green-800",
  ON_HOLD: "bg-amber-100 text-amber-800",
  CLOSED: "bg-slate-200 text-slate-600",
};

export default async function MattersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const { q, status } = await searchParams;
  const matters = await prisma.matter.findMany({
    where: {
      status: status ? (status as "OPEN" | "ON_HOLD" | "CLOSED") : undefined,
      OR: q
        ? [
            { title: { contains: q } },
            { caseNumber: { contains: q } },
            { client: { name: { contains: q } } },
          ]
        : undefined,
    },
    include: { client: true, lawyers: { include: { lawyer: true } } },
    orderBy: { openDate: "desc" },
  });

  return (
    <div>
      <PageHeader title="Matter List" action={{ label: "+ Add Matter", href: "/matters/new" }} />

      <form className="mb-4 flex flex-wrap gap-3" method="get">
        <input type="text" name="q" defaultValue={q} placeholder="Search case no, title, client..." className="input max-w-sm" />
        <select name="status" defaultValue={status ?? ""} className="input max-w-[180px]">
          <option value="">All Status</option>
          <option value="OPEN">Open</option>
          <option value="ON_HOLD">On Hold</option>
          <option value="CLOSED">Closed</option>
        </select>
        <button type="submit" className="btn-secondary">Filter</button>
      </form>

      <div className="card overflow-x-auto p-0">
        <table className="table-base">
          <thead>
            <tr>
              <th>Case No.</th>
              <th>Title</th>
              <th>Client</th>
              <th>Lawyers</th>
              <th>Status</th>
              <th>Opened</th>
            </tr>
          </thead>
          <tbody>
            {matters.map((m) => (
              <tr key={m.id}>
                <td>
                  <Link href={`/matters/${m.id}`} className="font-medium text-blue-900 hover:underline">{m.caseNumber}</Link>
                </td>
                <td>{m.title}</td>
                <td>
                  <Link href={`/clients/${m.clientId}`} className="hover:underline">{m.client.name}</Link>
                </td>
                <td className="text-xs">{m.lawyers.map((ml) => ml.lawyer.name).join(", ") || "—"}</td>
                <td><span className={`badge ${STATUS_STYLE[m.status]}`}>{m.status.replace("_", " ")}</span></td>
                <td>{formatDate(m.openDate)}</td>
              </tr>
            ))}
            {matters.length === 0 && (
              <tr><td colSpan={6} className="py-8 text-center text-slate-400">Koi matter nahi mila.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
