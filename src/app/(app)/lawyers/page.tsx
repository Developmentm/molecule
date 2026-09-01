import Link from "next/link";
import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/PageHeader";
import DeleteButton from "@/components/DeleteButton";
import { deleteLawyer } from "./actions";
import { formatCurrency } from "@/lib/format";

const DESIGNATION_LABEL: Record<string, string> = {
  LAWYER: "Lawyer",
  PARTNER: "Partner",
  ASSOCIATE_PARTNER: "Associate Partner",
};

export default async function LawyersPage({
  searchParams,
}: {
  searchParams: Promise<{ designation?: string }>;
}) {
  const { designation } = await searchParams;
  const lawyers = await prisma.lawyer.findMany({
    where: designation ? { designation: designation as "LAWYER" | "PARTNER" | "ASSOCIATE_PARTNER" } : undefined,
    include: { _count: { select: { matters: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <PageHeader title="Lawyer Management" action={{ label: "+ Add Lawyer", href: "/lawyers/new" }} />

      <div className="card overflow-x-auto p-0">
        <table className="table-base">
          <thead>
            <tr>
              <th>Name</th>
              <th>Designation</th>
              <th>Contact</th>
              <th>Bar No.</th>
              <th>Rate/hr</th>
              <th>In Charge</th>
              <th>Matters</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {lawyers.map((l) => (
              <tr key={l.id}>
                <td className="font-medium text-slate-800">{l.name}</td>
                <td>{DESIGNATION_LABEL[l.designation]}</td>
                <td>
                  <div>{l.email}</div>
                  <div className="text-xs text-slate-400">{l.phone}</div>
                </td>
                <td>{l.barNumber || "—"}</td>
                <td>{formatCurrency(l.hourlyRate)}</td>
                <td>{l.inCharge ? <span className="badge bg-green-100 text-green-800">Yes</span> : "—"}</td>
                <td>{l._count.matters}</td>
                <td className="space-x-3 whitespace-nowrap">
                  <Link href={`/lawyers/${l.id}/edit`} className="text-sm font-medium text-blue-900 hover:underline">Edit</Link>
                  <DeleteButton action={deleteLawyer.bind(null, l.id)} confirmText={`${l.name} ko delete karein?`} />
                </td>
              </tr>
            ))}
            {lawyers.length === 0 && (
              <tr><td colSpan={8} className="py-8 text-center text-slate-400">Koi lawyer nahi mila.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
