import { prisma } from "@/lib/prisma";
import StatCard from "@/components/StatCard";
import PageHeader from "@/components/PageHeader";
import {
  IconLawyer,
  IconClient,
  IconMatter,
  IconLocation,
  IconHoliday,
  IconSubadmin,
} from "@/components/icons";

export default async function DashboardPage() {
  const [
    lawyerCount,
    clientCount,
    matterCount,
    locationCount,
    holidayCount,
    partnerCount,
    assoPartnerCount,
    openMatters,
    unpaidInvoices,
  ] = await Promise.all([
    prisma.lawyer.count(),
    prisma.client.count(),
    prisma.matter.count(),
    prisma.location.count(),
    prisma.holiday.count(),
    prisma.lawyer.count({ where: { designation: "PARTNER" } }),
    prisma.lawyer.count({ where: { designation: "ASSOCIATE_PARTNER" } }),
    prisma.matter.count({ where: { status: "OPEN" } }),
    prisma.invoice.count({ where: { status: { in: ["SENT", "OVERDUE"] } } }),
  ]);

  const iconClass = "h-10 w-10";

  return (
    <div>
      <PageHeader title="Dashboard" />
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
        <StatCard label="Lawyer" value={lawyerCount} href="/lawyers" icon={<IconLawyer className={iconClass} />} color="red" />
        <StatCard label="Client" value={clientCount} href="/clients" icon={<IconClient className={iconClass} />} color="navy" />
        <StatCard label="Matter" value={matterCount} href="/matters" icon={<IconMatter className={iconClass} />} color="red" />
        <StatCard label="Location" value={locationCount} href="/locations" icon={<IconLocation className={iconClass} />} color="navy" />
        <StatCard label="Holiday" value={holidayCount} href="/holidays" icon={<IconHoliday className={iconClass} />} color="red" />
        <StatCard label="Partner" value={partnerCount} href="/lawyers?designation=PARTNER" icon={<IconSubadmin className={iconClass} />} color="navy" />
        <StatCard label="Asso. Partner" value={assoPartnerCount} href="/lawyers?designation=ASSOCIATE_PARTNER" icon={<IconSubadmin className={iconClass} />} color="red" />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="card">
          <h2 className="mb-1 text-sm font-semibold uppercase tracking-wide text-slate-500">Open Matters</h2>
          <p className="text-3xl font-bold text-slate-800">{openMatters}</p>
          <p className="mt-1 text-sm text-slate-500">Currently active cases being handled by the firm.</p>
        </div>
        <div className="card">
          <h2 className="mb-1 text-sm font-semibold uppercase tracking-wide text-slate-500">Outstanding Invoices</h2>
          <p className="text-3xl font-bold text-slate-800">{unpaidInvoices}</p>
          <p className="mt-1 text-sm text-slate-500">Invoices sent to clients awaiting payment.</p>
        </div>
      </div>
    </div>
  );
}
