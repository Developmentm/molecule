import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/PageHeader";
import DeleteButton from "@/components/DeleteButton";
import { deleteDisbursement } from "./actions";
import { formatCurrency, formatDate } from "@/lib/format";

export default async function DisbursementsPage() {
  const disbursements = await prisma.disbursement.findMany({
    include: { matter: true },
    orderBy: { date: "desc" },
  });

  const total = disbursements.reduce((s, d) => s + d.amount, 0);

  return (
    <div>
      <PageHeader title="Disbursement Management" action={{ label: "+ Add Disbursement", href: "/disbursements/new" }} />

      <div className="mb-4 text-sm text-slate-600">
        Total Disbursed: <strong className="text-slate-800">{formatCurrency(total)}</strong>
      </div>

      <div className="card overflow-x-auto p-0">
        <table className="table-base">
          <thead>
            <tr><th>Date</th><th>Matter</th><th>Description</th><th>Amount</th><th>Status</th><th></th></tr>
          </thead>
          <tbody>
            {disbursements.map((d) => (
              <tr key={d.id}>
                <td className="whitespace-nowrap">{formatDate(d.date)}</td>
                <td>{d.matter.caseNumber}</td>
                <td>{d.description}</td>
                <td>{formatCurrency(d.amount)}</td>
                <td>
                  {d.invoiced ? (
                    <span className="badge bg-green-100 text-green-800">Invoiced</span>
                  ) : (
                    <span className="badge bg-amber-100 text-amber-800">Pending</span>
                  )}
                </td>
                <td>{!d.invoiced && <DeleteButton action={deleteDisbursement.bind(null, d.id)} confirmText="Disbursement delete karein?" />}</td>
              </tr>
            ))}
            {disbursements.length === 0 && (
              <tr><td colSpan={6} className="py-8 text-center text-slate-400">Koi disbursement nahi mila.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
