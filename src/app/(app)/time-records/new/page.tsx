import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/PageHeader";
import TimeRecordForm from "./TimeRecordForm";
import { toDateInputValue } from "@/lib/format";

export default async function NewTimeRecordPage({
  searchParams,
}: {
  searchParams: Promise<{ matterId?: string }>;
}) {
  const { matterId } = await searchParams;
  const [matters, lawyers] = await Promise.all([
    prisma.matter.findMany({
      where: { status: { not: "CLOSED" } },
      orderBy: { openDate: "desc" },
      select: { id: true, caseNumber: true, title: true },
    }),
    prisma.lawyer.findMany({
      where: { active: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true, hourlyRate: true },
    }),
  ]);

  return (
    <div>
      <PageHeader title="Add Time Record" />
      <TimeRecordForm matters={matters} lawyers={lawyers} defaultMatterId={matterId} today={toDateInputValue(new Date())} />
    </div>
  );
}
