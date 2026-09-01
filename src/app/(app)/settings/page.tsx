import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/PageHeader";
import SettingsForm from "./SettingsForm";

export default async function SettingsPage() {
  const settings = await prisma.firmSettings.findUnique({ where: { id: "singleton" } });

  return (
    <div>
      <PageHeader title="Firm Settings" />
      <SettingsForm settings={settings} />
    </div>
  );
}
