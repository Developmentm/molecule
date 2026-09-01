import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/PageHeader";
import DisbursementForm from "./DisbursementForm";
import { toDateInputValue } from "@/lib/format";

export default async function NewDisbursementPage({
  searchParams,
}: {
  searchParams: Promise<{ matterId?: string }>;
}) {
  const { matterId } = await searchParams;
  const matters = await prisma.matter.findMany({
    where: { status: { not: "CLOSED" } },
    orderBy: { openDate: "desc" },
    select: { id: true, caseNumber: true, title: true },
  });

  return (
    <div>
      <PageHeader title="Add Disbursement" />
      <DisbursementForm matters={matters} defaultMatterId={matterId} today={toDateInputValue(new Date())} />
    </div>
  );
}
