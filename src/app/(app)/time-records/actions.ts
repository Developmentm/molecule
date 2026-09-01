"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

const TimeRecordSchema = z.object({
  matterId: z.string().min(1, "Matter select karein"),
  lawyerId: z.string().min(1, "Lawyer select karein"),
  date: z.string().min(1),
  hours: z.coerce.number().positive("Hours 0 se zyada hone chahiye"),
  rate: z.coerce.number().min(0),
  description: z.string().min(2, "Description likhein"),
  billable: z.coerce.boolean().optional(),
});

export type TimeRecordFormState = { error?: string };

export async function createTimeRecord(
  _prevState: TimeRecordFormState,
  formData: FormData
): Promise<TimeRecordFormState> {
  let data;
  try {
    data = TimeRecordSchema.parse({
      matterId: formData.get("matterId"),
      lawyerId: formData.get("lawyerId"),
      date: formData.get("date"),
      hours: formData.get("hours"),
      rate: formData.get("rate"),
      description: formData.get("description"),
      billable: formData.get("billable") === "on",
    });
  } catch (e) {
    if (e instanceof z.ZodError) return { error: e.issues[0].message };
    return { error: "Invalid data" };
  }

  await prisma.timeRecord.create({
    data: {
      matterId: data.matterId,
      lawyerId: data.lawyerId,
      date: new Date(data.date),
      hours: data.hours,
      rate: data.rate,
      description: data.description,
      billable: !!data.billable,
    },
  });

  revalidatePath("/time-records");
  revalidatePath(`/matters/${data.matterId}`);
  redirect("/time-records");
}

export async function deleteTimeRecord(id: string) {
  const record = await prisma.timeRecord.findUnique({ where: { id } });
  if (!record) return;
  if (record.invoiced) {
    throw new Error("Ye time record invoice ho chuka hai, delete nahi ho sakta.");
  }
  await prisma.timeRecord.delete({ where: { id } });
  revalidatePath("/time-records");
  revalidatePath(`/matters/${record.matterId}`);
  redirect("/time-records");
}
