import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/PageHeader";
import LawyerForm from "../../LawyerForm";
import { updateLawyer } from "../../actions";

export default async function EditLawyerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lawyer = await prisma.lawyer.findUnique({ where: { id } });
  if (!lawyer) notFound();

  const boundUpdate = updateLawyer.bind(null, id);

  return (
    <div>
      <PageHeader title={`Edit Lawyer — ${lawyer.name}`} />
      <LawyerForm action={boundUpdate} lawyer={lawyer} />
    </div>
  );
}
