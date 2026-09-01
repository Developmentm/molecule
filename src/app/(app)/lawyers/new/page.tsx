import PageHeader from "@/components/PageHeader";
import LawyerForm from "../LawyerForm";
import { createLawyer } from "../actions";

export default function NewLawyerPage() {
  return (
    <div>
      <PageHeader title="Add Lawyer" />
      <LawyerForm action={createLawyer} />
    </div>
  );
}
