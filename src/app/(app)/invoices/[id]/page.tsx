import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/PageHeader";
import InvoiceActions from "./InvoiceActions";
import { formatCurrency, formatDate } from "@/lib/format";

const INVOICE_STYLE: Record<string, string> = {
  DRAFT: "bg-slate-200 text-slate-700",
  SENT: "bg-blue-100 text-blue-900",
  PAID: "bg-green-100 text-green-800",
  OVERDUE: "bg-red-100 text-red-800",
};

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [invoice, settings] = await Promise.all([
    prisma.invoice.findUnique({
      where: { id },
      include: { client: true, matter: true, items: true },
    }),
    prisma.firmSettings.findUnique({ where: { id: "singleton" } }),
  ]);
  if (!invoice) notFound();

  const total = invoice.items.reduce((s, i) => s + i.amount, 0);

  return (
    <div>
      <PageHeader title={`Invoice ${invoice.invoiceNumber}`} />

      <div className="no-print mb-5">
        <InvoiceActions invoiceId={invoice.id} status={invoice.status} clientEmail={invoice.client.email} invoiceNumber={invoice.invoiceNumber} />
      </div>

      <div className="card mx-auto max-w-3xl">
        <div className="mb-6 flex items-start justify-between border-b border-slate-100 pb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-800">{settings?.firmName ?? "Law Firm"}</h2>
            <p className="text-sm text-slate-500">{settings?.address}</p>
            <p className="text-sm text-slate-500">{settings?.phone} {settings?.email && `· ${settings.email}`}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-slate-800">INVOICE</p>
            <p className="text-sm text-slate-500">{invoice.invoiceNumber}</p>
            <span className={`badge mt-1 inline-block ${INVOICE_STYLE[invoice.status]}`}>{invoice.status}</span>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Bill To</p>
            <p className="font-medium text-slate-800">{invoice.client.name}</p>
            <p className="text-sm text-slate-500">{invoice.client.address}</p>
            <p className="text-sm text-slate-500">{invoice.client.email}</p>
          </div>
          <div className="text-right text-sm">
            <p><span className="text-slate-500">Matter:</span> {invoice.matter.caseNumber}</p>
            <p><span className="text-slate-500">Issue Date:</span> {formatDate(invoice.issueDate)}</p>
            <p><span className="text-slate-500">Due Date:</span> {formatDate(invoice.dueDate)}</p>
          </div>
        </div>

        <table className="table-base mb-6">
          <thead>
            <tr><th>Description</th><th>Qty</th><th>Rate</th><th className="text-right">Amount</th></tr>
          </thead>
          <tbody>
            {invoice.items.map((item) => (
              <tr key={item.id}>
                <td>{item.description}</td>
                <td>{item.quantity}</td>
                <td>{formatCurrency(item.rate)}</td>
                <td className="text-right">{formatCurrency(item.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end">
          <div className="w-64 space-y-1">
            <div className="flex justify-between text-lg font-bold text-slate-800 border-t border-slate-200 pt-2">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        </div>

        {invoice.notes && (
          <div className="mt-6 border-t border-slate-100 pt-4 text-sm text-slate-600">
            <p className="mb-1 font-semibold text-slate-700">Notes</p>
            <p>{invoice.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
