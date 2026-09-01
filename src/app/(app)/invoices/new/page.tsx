import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/PageHeader";
import InvoiceGenerateForm from "./InvoiceGenerateForm";
import { toDateInputValue } from "@/lib/format";

export default async function NewInvoicePage({
  searchParams,
}: {
  searchParams: Promise<{ matterId?: string }>;
}) {
  const { matterId } = await searchParams;

  const matters = await prisma.matter.findMany({
    orderBy: { openDate: "desc" },
    include: { client: true },
  });

  if (!matterId) {
    return (
      <div>
        <PageHeader title="Generate Invoice" />
        <form method="get" className="card max-w-xl space-y-4">
          <div>
            <label className="label" htmlFor="matterId">Select Matter *</label>
            <select id="matterId" name="matterId" required defaultValue="" className="input">
              <option value="" disabled>Choose a matter</option>
              {matters.map((m) => (
                <option key={m.id} value={m.id}>{m.caseNumber} — {m.title} ({m.client.name})</option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn-primary">Continue</button>
        </form>
      </div>
    );
  }

  const matter = matters.find((m) => m.id === matterId);
  const [timeRecords, disbursements] = await Promise.all([
    prisma.timeRecord.findMany({
      where: { matterId, invoiced: false, billable: true },
      include: { lawyer: true },
      orderBy: { date: "asc" },
    }),
    prisma.disbursement.findMany({ where: { matterId, invoiced: false }, orderBy: { date: "asc" } }),
  ]);
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 14);
  const defaultDue = toDateInputValue(dueDate);

  return (
    <div>
      <PageHeader title={`Generate Invoice — ${matter?.caseNumber ?? ""}`} />
      <InvoiceGenerateForm
        matterId={matterId}
        matterLabel={matter ? `${matter.caseNumber} — ${matter.title} (${matter.client.name})` : matterId}
        timeRecords={timeRecords.map((t) => ({
          id: t.id,
          date: t.date.toISOString(),
          lawyerName: t.lawyer.name,
          hours: t.hours,
          rate: t.rate,
          description: t.description,
        }))}
        disbursements={disbursements.map((d) => ({
          id: d.id,
          date: d.date.toISOString(),
          amount: d.amount,
          description: d.description,
        }))}
        defaultDueDate={defaultDue}
      />
    </div>
  );
}
