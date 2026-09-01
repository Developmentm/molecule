import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/PageHeader";
import LeaveForm from "./LeaveForm";

export default async function NewLeavePage() {
  const lawyers = await prisma.lawyer.findMany({
    where: { active: true },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div>
      <PageHeader title="Apply Leave" />
      <LeaveForm lawyers={lawyers} />
    </div>
  );
}
