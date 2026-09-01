"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

const DisbursementSchema = z.object({
  matterId: z.string().min(1, "Matter select karein"),
  date: z.string().min(1),
  description: z.string().min(2, "Description likhein"),
  amount: z.coerce.number().positive("Amount 0 se zyada hona chahiye"),
});

export type DisbursementFormState = { error?: string };

export async function createDisbursement(
  _prevState: DisbursementFormState,
  formData: FormData
): Promise<DisbursementFormState> {
  let data;
  try {
    data = DisbursementSchema.parse({
      matterId: formData.get("matterId"),
      date: formData.get("date"),
      description: formData.get("description"),
      amount: formData.get("amount"),
    });
  } catch (e) {
    if (e instanceof z.ZodError) return { error: e.issues[0].message };
    return { error: "Invalid data" };
  }

  await prisma.disbursement.create({
    data: {
      matterId: data.matterId,
      date: new Date(data.date),
      description: data.description,
      amount: data.amount,
    },
  });

  revalidatePath("/disbursements");
  revalidatePath(`/matters/${data.matterId}`);
  redirect("/disbursements");
}

export async function deleteDisbursement(id: string) {
  const record = await prisma.disbursement.findUnique({ where: { id } });
  if (!record) return;
  if (record.invoiced) {
    throw new Error("Ye disbursement invoice ho chuka hai, delete nahi ho sakta.");
  }
  await prisma.disbursement.delete({ where: { id } });
  revalidatePath("/disbursements");
  revalidatePath(`/matters/${record.matterId}`);
  redirect("/disbursements");
}
