"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession, hashPassword } from "@/lib/auth";

const SubadminSchema = z.object({
  name: z.string().min(2, "Naam kam se kam 2 characters ka hona chahiye"),
  email: z.string().email("Valid email daalein"),
  password: z.string().min(6, "Password kam se kam 6 characters ka hona chahiye"),
});

export type SubadminFormState = { error?: string };

async function requireAdmin() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    throw new Error("Sirf Admin hi ye action kar sakte hain.");
  }
}

export async function createSubadmin(
  _prevState: SubadminFormState,
  formData: FormData
): Promise<SubadminFormState> {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return { error: "Sirf Admin hi subadmin add kar sakte hain." };
  }

  let data;
  try {
    data = SubadminSchema.parse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
    });
  } catch (e) {
    if (e instanceof z.ZodError) return { error: e.issues[0].message };
    return { error: "Invalid data" };
  }

  const passwordHash = await hashPassword(data.password);
  try {
    await prisma.user.create({
      data: { name: data.name, email: data.email, passwordHash, role: "SUBADMIN" },
    });
  } catch {
    return { error: "Is email se user pehle se maujood hai." };
  }

  revalidatePath("/subadmins");
  redirect("/subadmins");
}

export async function toggleSubadminActive(id: string, active: boolean) {
  await requireAdmin();
  await prisma.user.update({ where: { id }, data: { active } });
  revalidatePath("/subadmins");
}
