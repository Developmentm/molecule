import Link from "next/link";
import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/PageHeader";

export default async function InChargePage() {
  const lawyers = await prisma.lawyer.findMany({
    where: { inCharge: true },
    include: {
      matters: {
        include: { matter: { include: { client: true } } },
      },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <PageHeader title="In Charge Lawyers" />
      <div className="space-y-5">
        {lawyers.map((l) => (
          <div key={l.id} className="card">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-800">{l.name}</p>
                <p className="text-xs text-slate-400">{l.email}</p>
              </div>
              <span className="badge bg-blue-100 text-blue-900">{l.matters.length} matters</span>
            </div>
            <table className="table-base">
              <thead>
                <tr><th>Case No.</th><th>Title</th><th>Client</th><th>Status</th></tr>
              </thead>
              <tbody>
                {l.matters.map(({ matter }) => (
                  <tr key={matter.id}>
                    <td>
                      <Link href={`/matters/${matter.id}`} className="font-medium text-blue-900 hover:underline">{matter.caseNumber}</Link>
                    </td>
                    <td>{matter.title}</td>
                    <td>{matter.client.name}</td>
                    <td>{matter.status.replace("_", " ")}</td>
                  </tr>
                ))}
                {l.matters.length === 0 && (
                  <tr><td colSpan={4} className="py-4 text-center text-slate-400">Koi matter assign nahi hai.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        ))}
        {lawyers.length === 0 && (
          <div className="card text-center text-slate-400">Koi lawyer &quot;In Charge&quot; mark nahi hai.</div>
        )}
      </div>
    </div>
  );
}
