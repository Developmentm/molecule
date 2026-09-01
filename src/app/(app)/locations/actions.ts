"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function createLocation(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const address = String(formData.get("address") || "").trim();
  if (!name) return;
  await prisma.location.create({ data: { name, address: address || null } });
  revalidatePath("/locations");
}

export async function deleteLocation(id: string) {
  const count = await prisma.matter.count({ where: { locationId: id } });
  if (count > 0) throw new Error("Is location se matters jude hain, pehle unhe hatayein.");
  await prisma.location.delete({ where: { id } });
  revalidatePath("/locations");
}
