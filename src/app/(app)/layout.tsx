import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar isAdmin={session.role === "ADMIN"} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar name={session.name} role={session.role} />
        <main className="flex-1 overflow-y-auto bg-slate-100 p-6">{children}</main>
      </div>
    </div>
  );
}
