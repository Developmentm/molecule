import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/PageHeader";
import ClientForm from "../../ClientForm";
import { updateClient } from "../../actions";

export default async function EditClientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const client = await prisma.client.findUnique({ where: { id } });
  if (!client) notFound();

  const boundUpdate = updateClient.bind(null, id);

  return (
    <div>
      <PageHeader title={`Edit Client — ${client.name}`} />
      <ClientForm action={boundUpdate} client={client} />
    </div>
  );
}
