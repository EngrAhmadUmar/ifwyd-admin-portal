"use client";

import { ContentEditor } from "@/components/content/ContentEditor";
import { createNews } from "@/lib/api/news";
import { createProject } from "@/lib/api/projects";
import type { ContentType } from "@/lib/dashboard-data";
import { NEWS_CATEGORIES } from "@/lib/news-data";
import { PROJECT_FOCUS_AREAS, type ProjectFocusArea } from "@/lib/projects-data";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ImagePlus } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";

function deriveExcerpt(html: string, maxLength = 160): string {
  const text = html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}…`;
}

type SaveState = "publish" | "draft" | null;

export function NewPostForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialType: ContentType = searchParams.get("type") === "project" ? "Projects" : "News";

  const [postType, setPostType] = useState<ContentType>(initialType);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<string>(postType === "News" ? NEWS_CATEGORIES[0] : PROJECT_FOCUS_AREAS[0]);
  const [tagsInput, setTagsInput] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const [coverImageName, setCoverImageName] = useState("");
  const [body, setBody] = useState("");
  const [saving, setSaving] = useState<SaveState>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categoryOptions = postType === "News" ? NEWS_CATEGORIES : PROJECT_FOCUS_AREAS;

  function handleTypeChange(next: ContentType) {
    setPostType(next);
    setCategory(next === "News" ? NEWS_CATEGORIES[0] : PROJECT_FOCUS_AREAS[0]);
  }

  function handleCoverImageChange(file: File | null) {
    if (!file) {
      setCoverImageUrl(null);
      setCoverImageName("");
      return;
    }
    setCoverImageName(file.name);
    const reader = new FileReader();
    reader.onload = () => setCoverImageUrl(typeof reader.result === "string" ? reader.result : null);
    reader.readAsDataURL(file);
  }

  async function handleSubmit(status: "Published" | "Draft") {
    if (!title.trim() || !body.trim()) {
      setFormError("Add a title and body before saving.");
      return;
    }
    setFormError(null);
    setSaving(status === "Published" ? "publish" : "draft");

    const tags = tagsInput
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
    const excerpt = deriveExcerpt(body);

    if (postType === "News") {
      await createNews({ title, excerpt, category, tags, coverImageUrl, body, status });
      router.push("/news");
    } else {
      await createProject({
        title,
        summary: excerpt,
        focusArea: category as ProjectFocusArea,
        tags,
        coverImageUrl,
        body,
        status,
      });
      router.push("/projects");
    }
  }

  const excerptPreview = body.trim() ? deriveExcerpt(body) : "";

  return (
    <div className="flex mt-3 h-full min-h-0 flex-col overflow-hidden">
      <div className="shrink-0">
        <h1 className="text-[22px] font-semibold text-neutral-900">New Post</h1>
        <p className="mt-1 text-[15px] font-regular text-black">Write, preview, and publish to the IFWYD website.</p>
      </div>

      {formError && <p className="mt-2 shrink-0 text-[12px] font-medium text-red-600">{formError}</p>}

      <div className="mt-5 grid min-h-0 flex-1 grid-cols-[1fr_400px] items-start gap-5 overflow-hidden">
        <div className="flex min-h-0 flex-col overflow-y-auto rounded-[10px] border border-neutral-200/80 bg-white p-6 shadow-sm">
          <label className="block">
            <span className="mb-2 block text-[12px] font-medium text-neutral-900">Post Type</span>
            <div className="grid grid-cols-2 gap-1 rounded-[10px] bg-neutral-100 p-1">
              <button
                type="button"
                onClick={() => handleTypeChange("News")}
                className={cn(
                  "h-9 rounded-[10px] text-[12px] font-medium transition-colors",
                  postType === "News" ? "bg-ifwyd-brand text-white" : "text-neutral-500 hover:text-neutral-800",
                )}
              >
                News &amp; Updates
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange("Projects")}
                className={cn(
                  "h-9 rounded-[10px] text-[12px] font-medium transition-colors",
                  postType === "Projects" ? "bg-ifwyd-brand text-white" : "text-neutral-500 hover:text-neutral-800",
                )}
              >
                Project
              </button>
            </div>
          </label>

          <label className="mt-5 block">
            <span className="mb-2 block text-[12px] font-medium text-neutral-900">Title</span>
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g stand rally against antiviolence"
              className="h-[47px] w-full rounded-[10px] bg-[#F5F5F5] px-4 text-[12px] font-light text-neutral-900 outline-none focus:ring-2 focus:ring-ifwyd-brand/20"
            />
          </label>

          <div className="mt-5 grid grid-cols-2 gap-4">
            <label className="block">
              <span className="mb-2 block text-[12px] font-medium text-neutral-900">Category</span>
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="h-[47px] w-full appearance-none rounded-[10px] bg-[#F5F5F5] px-4 text-[12px] font-light text-neutral-900 outline-none focus:ring-2 focus:ring-ifwyd-brand/20"
              >
                {categoryOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-[12px] font-medium text-neutral-900">Tags (comma separated)</span>
              <input
                type="text"
                value={tagsInput}
                onChange={(event) => setTagsInput(event.target.value)}
                placeholder="Bauchi, women"
                className="h-[47px] w-full rounded-[10px] bg-[#F5F5F5] px-4 text-[12px] font-light text-neutral-900 outline-none focus:ring-2 focus:ring-ifwyd-brand/20"
              />
            </label>
          </div>

          <div className="mt-5">
            <span className="mb-2 block text-[12px] font-medium text-neutral-900">Cover Image</span>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex h-[100px] w-full flex-col items-center justify-center gap-1.5 rounded-[10px] border border-dashed border-ifwyd-brand/40 bg-ifwyd-brand/5 text-neutral-500 transition-colors hover:bg-ifwyd-brand/10"
            >
              {coverImageUrl ? (
                <span className="flex items-center gap-2 text-[12px] text-neutral-700">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={coverImageUrl} alt="" className="h-14 w-14 rounded-lg object-cover" />
                  {coverImageName}
                </span>
              ) : (
                <>
                  <ImagePlus className="h-5 w-5" strokeWidth={1.5} />
                  <span className="text-[12px]">Click to upload a cover image</span>
                </>
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(event) => handleCoverImageChange(event.target.files?.[0] ?? null)}
              className="hidden"
            />
          </div>

          <div className="mt-5 flex min-h-[220px] flex-1 flex-col">
            <span className="mb-2 block text-[12px] font-medium text-neutral-900">Body</span>
            <ContentEditor content={body} onChange={setBody} className="flex-1" />
          </div>

          <div className="mt-6 flex shrink-0 gap-3">
            <button
              type="button"
              onClick={() => handleSubmit("Published")}
              disabled={saving !== null}
              className="h-12 rounded-full bg-ifwyd-brand px-10 text-[14px] font-medium text-white transition-colors hover:bg-ifwyd-brand-dark disabled:opacity-60"
            >
              {saving === "publish" ? "Publishing..." : "Publish"}
            </button>
            <button
              type="button"
              onClick={() => handleSubmit("Draft")}
              disabled={saving !== null}
              className="h-12 rounded-full border border-neutral-300 bg-white px-6 text-[14px] font-medium text-neutral-900 transition-colors hover:bg-neutral-50 disabled:opacity-60"
            >
              {saving === "draft" ? "Saving..." : "Save as Draft"}
            </button>
          </div>
        </div>

        <div className="flex flex-col rounded-[10px] border border-neutral-200/80 bg-white p-4 shadow-sm">
          <p className="flex items-center gap-1.5 text-[12px] text-neutral-500">
            <span className="h-1.5 w-1.5 rounded-full bg-ifwyd-brand" />
            Live preview — how it appears on the site
          </p>

          <div className="relative mt-3 h-[130px] shrink-0 overflow-hidden rounded-lg bg-ifwyd-brand/10">
            {coverImageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={coverImageUrl} alt="" className="h-full w-full object-cover" />
            )}
          </div>

          <p className="mt-3 text-[12px] font-regular text-ifwyd-brand">{category}</p>
          <p className={cn("mt-1 text-[14px] font-medium", title ? "text-neutral-900" : "text-neutral-400")}>
            {title || "Your post title appears here"}
          </p>
          <p className="mt-1.5 text-[11px] font-light leading-relaxed text-neutral-500">
            {excerptPreview ||
              "Start typing the body and the excerpt will preview here exactly as readers will see it on the IFWYD website."}
          </p>

          <div className="mt-3 flex justify-end">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ifwyd-brand text-white">
              <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
