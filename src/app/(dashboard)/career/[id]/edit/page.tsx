import { JobForm } from "@/components/career/JobForm";

export default async function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <JobForm mode="edit" editId={id} />;
}
