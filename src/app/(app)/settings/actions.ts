"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export type SettingsFormState = { error?: string; success?: boolean };

export async function updateSettings(
  _prevState: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> {
  const firmName = String(formData.get("firmName") || "").trim();
  if (!firmName) return { error: "Firm name zaroori hai." };

  await prisma.firmSettings.upsert({
    where: { id: "singleton" },
    update: {
      firmName,
      address: String(formData.get("address") || "") || null,
      phone: String(formData.get("phone") || "") || null,
      email: String(formData.get("email") || "") || null,
      defaultRate: Number(formData.get("defaultRate") || 0),
      invoicePrefix: String(formData.get("invoicePrefix") || "INV"),
    },
    create: {
      id: "singleton",
      firmName,
      address: String(formData.get("address") || "") || null,
      phone: String(formData.get("phone") || "") || null,
      email: String(formData.get("email") || "") || null,
      defaultRate: Number(formData.get("defaultRate") || 0),
      invoicePrefix: String(formData.get("invoicePrefix") || "INV"),
    },
  });

  revalidatePath("/settings");
  return { success: true };
}
