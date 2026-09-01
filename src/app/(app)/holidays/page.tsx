import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/PageHeader";
import DeleteButton from "@/components/DeleteButton";
import { createHoliday, deleteHoliday } from "./actions";
import { formatDate } from "@/lib/format";

export default async function HolidaysPage() {
  const holidays = await prisma.holiday.findMany({ orderBy: { date: "asc" } });

  return (
    <div>
      <PageHeader title="Holidays" />

      <form action={createHoliday} className="card mb-5 flex max-w-2xl flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[160px]">
          <label className="label" htmlFor="name">Holiday Name *</label>
          <input id="name" name="name" required className="input" />
        </div>
        <div>
          <label className="label" htmlFor="date">Date *</label>
          <input id="date" name="date" type="date" required className="input" />
        </div>
        <button type="submit" className="btn-primary">Add</button>
      </form>

      <div className="card overflow-x-auto p-0">
        <table className="table-base">
          <thead><tr><th>Name</th><th>Date</th><th></th></tr></thead>
          <tbody>
            {holidays.map((h) => (
              <tr key={h.id}>
                <td className="font-medium text-slate-800">{h.name}</td>
                <td>{formatDate(h.date)}</td>
                <td><DeleteButton action={deleteHoliday.bind(null, h.id)} confirmText="Holiday delete karein?" /></td>
              </tr>
            ))}
            {holidays.length === 0 && <tr><td colSpan={3} className="py-8 text-center text-slate-400">Koi holiday add nahi hui.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
