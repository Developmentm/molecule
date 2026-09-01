"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

const GenerateInvoiceSchema = z.object({
  matterId: z.string().min(1),
  dueDate: z.string().min(1),
  notes: z.string().optional(),
  timeRecordIds: z.array(z.string()),
  disbursementIds: z.array(z.string()),
});

export type InvoiceFormState = { error?: string };

export async function generateInvoice(
  _prevState: InvoiceFormState,
  formData: FormData
): Promise<InvoiceFormState> {
  let data;
  try {
    data = GenerateInvoiceSchema.parse({
      matterId: formData.get("matterId"),
      dueDate: formData.get("dueDate"),
      notes: formData.get("notes") || "",
      timeRecordIds: formData.getAll("timeRecordIds"),
      disbursementIds: formData.getAll("disbursementIds"),
    });
  } catch (e) {
    if (e instanceof z.ZodError) return { error: e.issues[0].message };
    return { error: "Invalid data" };
  }

  if (data.timeRecordIds.length === 0 && data.disbursementIds.length === 0) {
    return { error: "Kam se kam ek time record ya disbursement select karein." };
  }

  const matter = await prisma.matter.findUnique({ where: { id: data.matterId } });
  if (!matter) return { error: "Matter nahi mila." };

  const [timeRecords, disbursements, settings, invoiceCount] = await Promise.all([
    prisma.timeRecord.findMany({ where: { id: { in: data.timeRecordIds }, invoiced: false } }),
    prisma.disbursement.findMany({ where: { id: { in: data.disbursementIds }, invoiced: false } }),
    prisma.firmSettings.findUnique({ where: { id: "singleton" } }),
    prisma.invoice.count(),
  ]);

  const prefix = settings?.invoicePrefix ?? "INV";
  const invoiceNumber = `${prefix}-${String(invoiceCount + 1).padStart(5, "0")}`;

  const items = [
    ...timeRecords.map((t) => ({
      description: t.description,
      quantity: t.hours,
      rate: t.rate,
      amount: t.hours * t.rate,
      timeRecordId: t.id,
    })),
    ...disbursements.map((d) => ({
      description: d.description,
      quantity: 1,
      rate: d.amount,
      amount: d.amount,
      disbursementId: d.id,
    })),
  ];

  const invoice = await prisma.$transaction(async (tx) => {
    const inv = await tx.invoice.create({
      data: {
        invoiceNumber,
        clientId: matter.clientId,
        matterId: matter.id,
        dueDate: new Date(data.dueDate),
        notes: data.notes || null,
        items: { create: items },
      },
    });
    if (timeRecords.length > 0) {
      await tx.timeRecord.updateMany({ where: { id: { in: timeRecords.map((t) => t.id) } }, data: { invoiced: true } });
    }
    if (disbursements.length > 0) {
      await tx.disbursement.updateMany({ where: { id: { in: disbursements.map((d) => d.id) } }, data: { invoiced: true } });
    }
    return inv;
  });

  revalidatePath("/invoices");
  revalidatePath(`/matters/${matter.id}`);
  redirect(`/invoices/${invoice.id}`);
}

export async function markInvoiceStatus(id: string, status: "SENT" | "PAID" | "OVERDUE" | "DRAFT") {
  const invoice = await prisma.invoice.update({ where: { id }, data: { status } });
  revalidatePath("/invoices");
  revalidatePath(`/invoices/${id}`);
  return invoice;
}

export async function markInvoiceSent(id: string) {
  await markInvoiceStatus(id, "SENT");
  revalidatePath(`/invoices/${id}`);
}

export async function markInvoicePaid(id: string) {
  await markInvoiceStatus(id, "PAID");
  revalidatePath(`/invoices/${id}`);
}
