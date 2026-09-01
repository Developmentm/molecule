"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

const LeaveSchema = z.object({
  lawyerId: z.string().min(1, "Lawyer select karein"),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  type: z.string().min(1),
  reason: z.string().optional(),
});

export type LeaveFormState = { error?: string };

export async function applyLeave(
  _prevState: LeaveFormState,
  formData: FormData
): Promise<LeaveFormState> {
  let data;
  try {
    data = LeaveSchema.parse({
      lawyerId: formData.get("lawyerId"),
      startDate: formData.get("startDate"),
      endDate: formData.get("endDate"),
      type: formData.get("type"),
      reason: formData.get("reason") || "",
    });
  } catch (e) {
    if (e instanceof z.ZodError) return { error: e.issues[0].message };
    return { error: "Invalid data" };
  }

  if (new Date(data.endDate) < new Date(data.startDate)) {
    return { error: "End date, start date se pehle nahi ho sakti." };
  }

  await prisma.leave.create({
    data: {
      lawyerId: data.lawyerId,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      type: data.type,
      reason: data.reason || null,
    },
  });

  revalidatePath("/leaves");
  redirect("/leaves");
}

export async function updateLeaveStatus(id: string, status: "APPROVED" | "REJECTED") {
  await prisma.leave.update({ where: { id }, data: { status } });
  revalidatePath("/leaves");
}

export async function deleteLeave(id: string) {
  await prisma.leave.delete({ where: { id } });
  revalidatePath("/leaves");
}
