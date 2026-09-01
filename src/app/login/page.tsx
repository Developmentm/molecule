import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import LoginForm from "./LoginForm";

export default async function LoginPage() {
  const session = await getSession();
  if (session) redirect("/dashboard");

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-900 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-red-700 text-2xl font-bold text-white">
            L
          </div>
          <h1 className="text-2xl font-bold text-white">LexTrack</h1>
          <p className="mt-1 text-sm text-slate-400">Law Firm Case Management</p>
        </div>
        <div className="card">
          <LoginForm />
          <p className="mt-4 text-center text-xs text-slate-400">
            Demo login: admin@lawfirm.test / admin123
          </p>
        </div>
      </div>
    </div>
  );
}
