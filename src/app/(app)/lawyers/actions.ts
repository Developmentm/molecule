"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

const LawyerSchema = z.object({
  name: z.string().min(2, "Naam kam se kam 2 characters ka hona chahiye"),
  email: z.string().email("Valid email daalein"),
  phone: z.string().optional(),
  barNumber: z.string().optional(),
  designation: z.enum(["LAWYER", "PARTNER", "ASSOCIATE_PARTNER"]),
  hourlyRate: z.coerce.number().min(0),
  inCharge: z.coerce.boolean().optional(),
});

export type LawyerFormState = { error?: string };

function parseForm(formData: FormData) {
  return LawyerSchema.parse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") || "",
    barNumber: formData.get("barNumber") || "",
    designation: formData.get("designation"),
    hourlyRate: formData.get("hourlyRate") || 0,
    inCharge: formData.get("inCharge") === "on",
  });
}

export async function createLawyer(
  _prevState: LawyerFormState,
  formData: FormData
): Promise<LawyerFormState> {
  let data;
  try {
    data = parseForm(formData);
  } catch (e) {
    if (e instanceof z.ZodError) return { error: e.issues[0].message };
    return { error: "Invalid data" };
  }

  try {
    await prisma.lawyer.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        barNumber: data.barNumber || null,
        designation: data.designation,
        hourlyRate: data.hourlyRate,
        inCharge: !!data.inCharge,
      },
    });
  } catch {
    return { error: "Is email se lawyer pehle se maujood hai." };
  }

  revalidatePath("/lawyers");
  redirect("/lawyers");
}

export async function updateLawyer(
  id: string,
  _prevState: LawyerFormState,
  formData: FormData
): Promise<LawyerFormState> {
  let data;
  try {
    data = parseForm(formData);
  } catch (e) {
    if (e instanceof z.ZodError) return { error: e.issues[0].message };
    return { error: "Invalid data" };
  }

  try {
    await prisma.lawyer.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        barNumber: data.barNumber || null,
        designation: data.designation,
        hourlyRate: data.hourlyRate,
        inCharge: !!data.inCharge,
      },
    });
  } catch {
    return { error: "Is email se lawyer pehle se maujood hai." };
  }

  revalidatePath("/lawyers");
  redirect("/lawyers");
}

export async function deleteLawyer(id: string) {
  const matterCount = await prisma.matterLawyer.count({ where: { lawyerId: id } });
  if (matterCount > 0) {
    throw new Error("Is lawyer ko matters assign hain, pehle unhe hatayein.");
  }
  await prisma.lawyer.delete({ where: { id } });
  revalidatePath("/lawyers");
  redirect("/lawyers");
}
