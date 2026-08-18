import { NewPostForm } from "@/components/posts/NewPostForm";
import { Suspense } from "react";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <Suspense fallback={null}>
      <NewPostForm mode="edit" editId={id} />
    </Suspense>
  );
}
