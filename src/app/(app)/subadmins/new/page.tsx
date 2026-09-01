import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import PageHeader from "@/components/PageHeader";
import SubadminForm from "./SubadminForm";

export default async function NewSubadminPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/dashboard");

  return (
    <div>
      <PageHeader title="Add Subadmin" />
      <SubadminForm />
    </div>
  );
}
