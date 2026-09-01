import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/PageHeader";
import MatterForm from "../MatterForm";
import { createMatter } from "../actions";

export default async function NewMatterPage({
  searchParams,
}: {
  searchParams: Promise<{ clientId?: string }>;
}) {
  const { clientId } = await searchParams;
  const [clients, locations, lawyers] = await Promise.all([
    prisma.client.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.location.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.lawyer.findMany({ where: { active: true }, orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);

  return (
    <div>
      <PageHeader title="Add Matter" />
      <MatterForm action={createMatter} clients={clients} locations={locations} lawyers={lawyers} defaultClientId={clientId} />
    </div>
  );
}
