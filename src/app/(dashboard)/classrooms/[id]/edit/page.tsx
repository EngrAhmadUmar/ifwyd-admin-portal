import { ClassroomForm } from "@/components/classrooms/ClassroomForm";

export default async function EditClassroomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ClassroomForm mode="edit" editId={id} />;
}
