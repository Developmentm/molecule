import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/PageHeader";
import DeleteButton from "@/components/DeleteButton";
import { deleteClient } from "../actions";
import { formatDate } from "@/lib/format";

const STATUS_STYLE: Record<string, string> = {
  OPEN: "bg-green-100 text-green-800",
  ON_HOLD: "bg-amber-100 text-amber-800",
  CLOSED: "bg-slate-200 text-slate-600",
};

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const client = await prisma.client.findUnique({
    where: { id },
    include: { matters: { orderBy: { openDate: "desc" } } },
  });
  if (!client) notFound();

  return (
    <div>
      <PageHeader title={client.name} />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="card lg:col-span-1">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Details</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-slate-500">Company</dt><dd>{client.company || "—"}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">Email</dt><dd>{client.email || "—"}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">Phone</dt><dd>{client.phone || "—"}</dd></div>
            <div><dt className="text-slate-500">Address</dt><dd className="mt-1">{client.address || "—"}</dd></div>
            {client.notes && <div><dt className="text-slate-500">Notes</dt><dd className="mt-1">{client.notes}</dd></div>}
          </dl>
          <div className="mt-5 flex gap-4 border-t border-slate-100 pt-4">
            <Link href={`/clients/${client.id}/edit`} className="text-sm font-medium text-blue-900 hover:underline">Edit</Link>
            <DeleteButton action={deleteClient.bind(null, client.id)} confirmText="Client delete karein?" />
          </div>
        </div>

        <div className="card lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Matters</h2>
            <Link href={`/matters/new?clientId=${client.id}`} className="text-sm font-medium text-blue-900 hover:underline">+ New Matter</Link>
          </div>
          <table className="table-base">
            <thead>
              <tr><th>Case No.</th><th>Title</th><th>Status</th><th>Opened</th></tr>
            </thead>
            <tbody>
              {client.matters.map((m) => (
                <tr key={m.id}>
                  <td>
                    <Link href={`/matters/${m.id}`} className="font-medium text-blue-900 hover:underline">{m.caseNumber}</Link>
                  </td>
                  <td>{m.title}</td>
                  <td><span className={`badge ${STATUS_STYLE[m.status]}`}>{m.status.replace("_", " ")}</span></td>
                  <td>{formatDate(m.openDate)}</td>
                </tr>
              ))}
              {client.matters.length === 0 && (
                <tr><td colSpan={4} className="py-6 text-center text-slate-400">Koi matter nahi hai.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
