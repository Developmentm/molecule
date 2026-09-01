"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function createHoliday(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const date = String(formData.get("date") || "");
  if (!name || !date) return;
  await prisma.holiday.create({ data: { name, date: new Date(date) } });
  revalidatePath("/holidays");
}

export async function deleteHoliday(id: string) {
  await prisma.holiday.delete({ where: { id } });
  revalidatePath("/holidays");
}
