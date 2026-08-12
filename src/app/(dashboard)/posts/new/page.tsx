import { NewPostForm } from "@/components/posts/NewPostForm";
import { Suspense } from "react";

export default function NewPostPage() {
  return (
    <Suspense fallback={null}>
      <NewPostForm />
    </Suspense>
  );
}
