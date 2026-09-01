import Link from "next/link";
import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/PageHeader";

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const clients = await prisma.client.findMany({
    where: q
      ? {
          OR: [
            { name: { contains: q } },
            { email: { contains: q } },
            { company: { contains: q } },
          ],
        }
      : undefined,
    include: { _count: { select: { matters: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <PageHeader title="Client Management" action={{ label: "+ Add Client", href: "/clients/new" }} />

      <form className="mb-4" method="get">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Search by name, email or company..."
          className="input max-w-sm"
        />
      </form>

      <div className="card overflow-x-auto p-0">
        <table className="table-base">
          <thead>
            <tr>
              <th>Name</th>
              <th>Company</th>
              <th>Contact</th>
              <th>Matters</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {clients.map((c) => (
              <tr key={c.id}>
                <td>
                  <Link href={`/clients/${c.id}`} className="font-medium text-blue-900 hover:underline">
                    {c.name}
                  </Link>
                </td>
                <td>{c.company || "—"}</td>
                <td>
                  <div>{c.email || "—"}</div>
                  <div className="text-xs text-slate-400">{c.phone || ""}</div>
                </td>
                <td>{c._count.matters}</td>
                <td>
                  <Link href={`/clients/${c.id}/edit`} className="text-sm font-medium text-blue-900 hover:underline">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {clients.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-400">
                  Koi client nahi mila.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
