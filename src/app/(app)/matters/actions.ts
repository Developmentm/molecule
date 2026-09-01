"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

const MatterSchema = z.object({
  caseNumber: z.string().min(1, "Case number zaroori hai"),
  title: z.string().min(2, "Title zaroori hai"),
  description: z.string().optional(),
  clientId: z.string().min(1, "Client select karein"),
  locationId: z.string().optional(),
  status: z.enum(["OPEN", "ON_HOLD", "CLOSED"]),
  billingRate: z.coerce.number().min(0).optional(),
  lawyerIds: z.array(z.string()).min(1, "Kam se kam ek lawyer select karein"),
});

export type MatterFormState = { error?: string };

function parseForm(formData: FormData) {
  return MatterSchema.parse({
    caseNumber: formData.get("caseNumber"),
    title: formData.get("title"),
    description: formData.get("description") || "",
    clientId: formData.get("clientId"),
    locationId: formData.get("locationId") || "",
    status: formData.get("status"),
    billingRate: formData.get("billingRate") || 0,
    lawyerIds: formData.getAll("lawyerIds"),
  });
}

export async function createMatter(
  _prevState: MatterFormState,
  formData: FormData
): Promise<MatterFormState> {
  let data;
  try {
    data = parseForm(formData);
  } catch (e) {
    if (e instanceof z.ZodError) return { error: e.issues[0].message };
    return { error: "Invalid data" };
  }

  try {
    await prisma.matter.create({
      data: {
        caseNumber: data.caseNumber,
        title: data.title,
        description: data.description || null,
        clientId: data.clientId,
        locationId: data.locationId || null,
        status: data.status,
        billingRate: data.billingRate || null,
        lawyers: { create: data.lawyerIds.map((lawyerId) => ({ lawyerId })) },
      },
    });
  } catch {
    return { error: "Ye case number pehle se maujood hai." };
  }

  revalidatePath("/matters");
  redirect("/matters");
}

export async function updateMatter(
  id: string,
  _prevState: MatterFormState,
  formData: FormData
): Promise<MatterFormState> {
  let data;
  try {
    data = parseForm(formData);
  } catch (e) {
    if (e instanceof z.ZodError) return { error: e.issues[0].message };
    return { error: "Invalid data" };
  }

  try {
    await prisma.$transaction([
      prisma.matterLawyer.deleteMany({ where: { matterId: id } }),
      prisma.matter.update({
        where: { id },
        data: {
          caseNumber: data.caseNumber,
          title: data.title,
          description: data.description || null,
          clientId: data.clientId,
          locationId: data.locationId || null,
          status: data.status,
          billingRate: data.billingRate || null,
          closeDate: data.status === "CLOSED" ? new Date() : null,
          lawyers: { create: data.lawyerIds.map((lawyerId) => ({ lawyerId })) },
        },
      }),
    ]);
  } catch {
    return { error: "Ye case number pehle se maujood hai." };
  }

  revalidatePath("/matters");
  revalidatePath(`/matters/${id}`);
  redirect(`/matters/${id}`);
}

export async function deleteMatter(id: string) {
  const invoiceCount = await prisma.invoice.count({ where: { matterId: id } });
  if (invoiceCount > 0) {
    throw new Error("Is matter ke invoices ban chuke hain, isliye delete nahi ho sakta.");
  }
  await prisma.$transaction([
    prisma.matterLawyer.deleteMany({ where: { matterId: id } }),
    prisma.timeRecord.deleteMany({ where: { matterId: id } }),
    prisma.disbursement.deleteMany({ where: { matterId: id } }),
    prisma.matter.delete({ where: { id } }),
  ]);
  revalidatePath("/matters");
  redirect("/matters");
}
