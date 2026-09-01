import Link from "next/link";
import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/PageHeader";
import { formatCurrency, formatDate } from "@/lib/format";

const INVOICE_STYLE: Record<string, string> = {
  DRAFT: "bg-slate-200 text-slate-700",
  SENT: "bg-blue-100 text-blue-900",
  PAID: "bg-green-100 text-green-800",
  OVERDUE: "bg-red-100 text-red-800",
};

export default async function InvoicesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const invoices = await prisma.invoice.findMany({
    where: status ? { status: status as "DRAFT" | "SENT" | "PAID" | "OVERDUE" } : undefined,
    include: { client: true, matter: true, items: true },
    orderBy: { issueDate: "desc" },
  });

  return (
    <div>
      <PageHeader title="Invoices" action={{ label: "+ Generate Invoice", href: "/invoices/new" }} />

      <form className="mb-4 flex gap-3" method="get">
        <select name="status" defaultValue={status ?? ""} className="input max-w-[200px]">
          <option value="">All Status</option>
          <option value="DRAFT">Draft</option>
          <option value="SENT">Sent</option>
          <option value="PAID">Paid</option>
          <option value="OVERDUE">Overdue</option>
        </select>
        <button type="submit" className="btn-secondary">Filter</button>
      </form>

      <div className="card overflow-x-auto p-0">
        <table className="table-base">
          <thead>
            <tr><th>Invoice #</th><th>Client</th><th>Matter</th><th>Issue Date</th><th>Due Date</th><th>Amount</th><th>Status</th></tr>
          </thead>
          <tbody>
            {invoices.map((inv) => {
              const total = inv.items.reduce((s, i) => s + i.amount, 0);
              return (
                <tr key={inv.id}>
                  <td>
                    <Link href={`/invoices/${inv.id}`} className="font-medium text-blue-900 hover:underline">{inv.invoiceNumber}</Link>
                  </td>
                  <td>{inv.client.name}</td>
                  <td>{inv.matter.caseNumber}</td>
                  <td className="whitespace-nowrap">{formatDate(inv.issueDate)}</td>
                  <td className="whitespace-nowrap">{formatDate(inv.dueDate)}</td>
                  <td>{formatCurrency(total)}</td>
                  <td><span className={`badge ${INVOICE_STYLE[inv.status]}`}>{inv.status}</span></td>
                </tr>
              );
            })}
            {invoices.length === 0 && (
              <tr><td colSpan={7} className="py-8 text-center text-slate-400">Koi invoice nahi mila.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
