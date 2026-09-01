import { logoutAction } from "@/app/(app)/logout-action";
import { IconLogout } from "./icons";

export default function Topbar({
  name,
  role,
}: {
  name: string;
  role: string;
}) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
      <div />
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-semibold text-slate-800">{name}</p>
          <p className="text-xs text-slate-400">{role}</p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-900 text-sm font-bold text-white">
          {name.charAt(0).toUpperCase()}
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            title="Logout"
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-red-700"
          >
            <IconLogout className="h-5 w-5" />
          </button>
        </form>
      </div>
    </header>
  );
}
