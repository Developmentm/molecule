"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

const ClientSchema = z.object({
  name: z.string().min(2, "Naam kam se kam 2 characters ka hona chahiye"),
  email: z.string().email("Valid email daalein").optional().or(z.literal("")),
  phone: z.string().optional(),
  company: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
});

export type ClientFormState = { error?: string };

function parseClientForm(formData: FormData) {
  return ClientSchema.parse({
    name: formData.get("name"),
    email: formData.get("email") || "",
    phone: formData.get("phone") || "",
    company: formData.get("company") || "",
    address: formData.get("address") || "",
    notes: formData.get("notes") || "",
  });
}

export async function createClient(
  _prevState: ClientFormState,
  formData: FormData
): Promise<ClientFormState> {
  let data;
  try {
    data = parseClientForm(formData);
  } catch (e) {
    if (e instanceof z.ZodError) return { error: e.issues[0].message };
    return { error: "Invalid data" };
  }

  await prisma.client.create({
    data: {
      name: data.name,
      email: data.email || null,
      phone: data.phone || null,
      company: data.company || null,
      address: data.address || null,
      notes: data.notes || null,
    },
  });

  revalidatePath("/clients");
  redirect("/clients");
}

export async function updateClient(
  id: string,
  _prevState: ClientFormState,
  formData: FormData
): Promise<ClientFormState> {
  let data;
  try {
    data = parseClientForm(formData);
  } catch (e) {
    if (e instanceof z.ZodError) return { error: e.issues[0].message };
    return { error: "Invalid data" };
  }

  await prisma.client.update({
    where: { id },
    data: {
      name: data.name,
      email: data.email || null,
      phone: data.phone || null,
      company: data.company || null,
      address: data.address || null,
      notes: data.notes || null,
    },
  });

  revalidatePath("/clients");
  revalidatePath(`/clients/${id}`);
  redirect(`/clients/${id}`);
}

export async function deleteClient(id: string) {
  const matterCount = await prisma.matter.count({ where: { clientId: id } });
  if (matterCount > 0) {
    throw new Error("Is client ke matters hai, pehle unhe delete/reassign karein.");
  }
  await prisma.client.delete({ where: { id } });
  revalidatePath("/clients");
  redirect("/clients");
}
