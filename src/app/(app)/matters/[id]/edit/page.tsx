import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/PageHeader";
import MatterForm from "../../MatterForm";
import { updateMatter } from "../../actions";

export default async function EditMatterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [matter, clients, locations, lawyers] = await Promise.all([
    prisma.matter.findUnique({ where: { id }, include: { lawyers: true } }),
    prisma.client.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.location.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.lawyer.findMany({ where: { active: true }, orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);
  if (!matter) notFound();

  const boundUpdate = updateMatter.bind(null, id);

  return (
    <div>
      <PageHeader title={`Edit Matter — ${matter.caseNumber}`} />
      <MatterForm action={boundUpdate} matter={matter} clients={clients} locations={locations} lawyers={lawyers} />
    </div>
  );
}
