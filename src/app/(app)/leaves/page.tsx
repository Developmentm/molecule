import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/PageHeader";
import DeleteButton from "@/components/DeleteButton";
import { deleteLeave, updateLeaveStatus } from "./actions";
import { formatDate } from "@/lib/format";

const STATUS_STYLE: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  APPROVED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
};

export default async function LeavesPage() {
  const leaves = await prisma.leave.findMany({
    include: { lawyer: true },
    orderBy: { startDate: "desc" },
  });

  return (
    <div>
      <PageHeader title="Leave Management" action={{ label: "+ Apply Leave", href: "/leaves/new" }} />

      <div className="card overflow-x-auto p-0">
        <table className="table-base">
          <thead>
            <tr><th>Lawyer</th><th>Type</th><th>From</th><th>To</th><th>Reason</th><th>Status</th><th></th></tr>
          </thead>
          <tbody>
            {leaves.map((l) => (
              <tr key={l.id}>
                <td className="font-medium text-slate-800">{l.lawyer.name}</td>
                <td>{l.type}</td>
                <td>{formatDate(l.startDate)}</td>
                <td>{formatDate(l.endDate)}</td>
                <td>{l.reason || "—"}</td>
                <td><span className={`badge ${STATUS_STYLE[l.status]}`}>{l.status}</span></td>
                <td className="space-x-3 whitespace-nowrap">
                  {l.status === "PENDING" && (
                    <>
                      <form action={updateLeaveStatus.bind(null, l.id, "APPROVED")} className="inline">
                        <button type="submit" className="text-sm font-medium text-green-700 hover:underline">Approve</button>
                      </form>
                      <form action={updateLeaveStatus.bind(null, l.id, "REJECTED")} className="inline">
                        <button type="submit" className="text-sm font-medium text-red-700 hover:underline">Reject</button>
                      </form>
                    </>
                  )}
                  <DeleteButton action={deleteLeave.bind(null, l.id)} confirmText="Leave record delete karein?" />
                </td>
              </tr>
            ))}
            {leaves.length === 0 && <tr><td colSpan={7} className="py-8 text-center text-slate-400">Koi leave record nahi hai.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
