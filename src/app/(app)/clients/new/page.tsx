import PageHeader from "@/components/PageHeader";
import ClientForm from "../ClientForm";
import { createClient } from "../actions";

export default function NewClientPage() {
  return (
    <div>
      <PageHeader title="Add Client" />
      <ClientForm action={createClient} />
    </div>
  );
}
