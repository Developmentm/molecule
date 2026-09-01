import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/PageHeader";
import DeleteButton from "@/components/DeleteButton";
import { createLocation, deleteLocation } from "./actions";

export default async function LocationsPage() {
  const locations = await prisma.location.findMany({
    include: { _count: { select: { matters: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <PageHeader title="Locations" />

      <form action={createLocation} className="card mb-5 flex max-w-2xl flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[160px]">
          <label className="label" htmlFor="name">Location Name *</label>
          <input id="name" name="name" required className="input" />
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="label" htmlFor="address">Address</label>
          <input id="address" name="address" className="input" />
        </div>
        <button type="submit" className="btn-primary">Add</button>
      </form>

      <div className="card overflow-x-auto p-0">
        <table className="table-base">
          <thead><tr><th>Name</th><th>Address</th><th>Matters</th><th></th></tr></thead>
          <tbody>
            {locations.map((l) => (
              <tr key={l.id}>
                <td className="font-medium text-slate-800">{l.name}</td>
                <td>{l.address || "—"}</td>
                <td>{l._count.matters}</td>
                <td>{l._count.matters === 0 && <DeleteButton action={deleteLocation.bind(null, l.id)} confirmText="Location delete karein?" />}</td>
              </tr>
            ))}
            {locations.length === 0 && <tr><td colSpan={4} className="py-8 text-center text-slate-400">Koi location nahi hai.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
