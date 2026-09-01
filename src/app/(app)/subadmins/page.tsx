import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import PageHeader from "@/components/PageHeader";
import { toggleSubadminActive } from "./actions";

export default async function SubadminsPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/dashboard");

  const users = await prisma.user.findMany({
    where: { role: "SUBADMIN" },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <PageHeader title="Subadmin Management" action={{ label: "+ Add Subadmin", href: "/subadmins/new" }} />

      <div className="card overflow-x-auto p-0">
        <table className="table-base">
          <thead><tr><th>Name</th><th>Email</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td className="font-medium text-slate-800">{u.name}</td>
                <td>{u.email}</td>
                <td>
                  {u.active ? (
                    <span className="badge bg-green-100 text-green-800">Active</span>
                  ) : (
                    <span className="badge bg-slate-200 text-slate-600">Inactive</span>
                  )}
                </td>
                <td>
                  <form action={toggleSubadminActive.bind(null, u.id, !u.active)}>
                    <button type="submit" className="text-sm font-medium text-blue-900 hover:underline">
                      {u.active ? "Deactivate" : "Activate"}
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {users.length === 0 && <tr><td colSpan={4} className="py-8 text-center text-slate-400">Koi subadmin nahi hai.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
