import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { formatDate } from "@/lib/format";

function csvEscape(value: string) {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.redirect(new URL("/login", request.url));

  const { searchParams } = request.nextUrl;
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const matterId = searchParams.get("matterId");
  const lawyerId = searchParams.get("lawyerId");

  const records = await prisma.timeRecord.findMany({
    where: {
      matterId: matterId || undefined,
      lawyerId: lawyerId || undefined,
      date: {
        ...(from ? { gte: new Date(from) } : {}),
        ...(to ? { lte: new Date(`${to}T23:59:59`) } : {}),
      },
    },
    include: { matter: true, lawyer: true },
    orderBy: { date: "asc" },
  });

  const header = ["Date", "Matter", "Case No", "Lawyer", "Hours", "Rate", "Billable Value", "Billable", "Invoiced", "Description"];
  const rows = records.map((r) => [
    formatDate(r.date),
    r.matter.title,
    r.matter.caseNumber,
    r.lawyer.name,
    r.hours.toString(),
    r.rate.toString(),
    (r.billable ? r.hours * r.rate : 0).toFixed(2),
    r.billable ? "Yes" : "No",
    r.invoiced ? "Yes" : "No",
    r.description,
  ]);

  const csv = [header, ...rows].map((row) => row.map((v) => csvEscape(String(v))).join(",")).join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="time-report.csv"`,
    },
  });
}
