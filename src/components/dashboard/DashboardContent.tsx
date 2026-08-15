"use client";

import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { fetchDashboard, type DashboardView } from "@/lib/api/dashboard";
import { deleteNews } from "@/lib/api/news";
import { deleteProject } from "@/lib/api/projects";
import type { ContentItem } from "@/lib/dashboard-data";
import { cn } from "@/lib/utils";
import { Pencil, PlusIcon, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { StatCard } from "./StatCard";

function Tag({ tone, children }: { tone: "type" | "published" | "draft" | "neutral"; children: React.ReactNode }) {
  const styles: Record<typeof tone, string> = {
    type: "bg-ifwyd-brand/10 text-ifwyd-brand-dark",
    published: "bg-[#E8F5E9] text-[#2E7D32]",
    draft: "bg-neutral-100 text-neutral-500",
    neutral: "bg-neutral-100 text-neutral-600",
  };
  const dot: Record<typeof tone, string> = {
    type: "bg-ifwyd-brand",
    published: "bg-[#2E7D32]",
    draft: "bg-neutral-400",
    neutral: "bg-neutral-400",
  };

  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium", styles[tone])}>
      <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", dot[tone])} />
      {children}
    </span>
  );
}

function ContentRow({ item, onDelete }: { item: ContentItem; onDelete: () => void }) {
  const editHref = item.type === "News" ? "/news" : "/projects";

  return (
    <div className="flex items-center gap-4 border-b border-neutral-100 px-6 py-4 last:border-0 hover:bg-neutral-50/60">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={item.thumbnail}
        alt=""
        className="h-[80px] w-[122px] shrink-0 rounded-xl object-cover"
      />

      <div className="min-w-0 flex-1">
        <p className="truncate text-[16px] font-semibold text-neutral-900">{item.title}</p>
        <div className="mt-1.5 flex flex-wrap items-center gap-3">
          <Tag tone="type">{item.type}</Tag>
          <Tag tone={item.status === "Published" ? "published" : "draft"}>{item.status}</Tag>
          <Tag tone="neutral">{item.category}</Tag>
        </div>
      </div>

      <span className="shrink-0 text-[12px] text-neutral-500 font-light">{item.date}</span>

      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={onDelete}
          className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-red-50 hover:text-red-600"
          aria-label={`Delete ${item.title}`}
        >
          <Trash2 className="h-4 w-4" strokeWidth={2} />
        </button>
        <Link
          href={editHref}
          className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-ifwyd-brand/10 hover:text-ifwyd-brand-dark"
          aria-label={`Edit ${item.title}`}
        >
          <Pencil className="h-4 w-4" strokeWidth={2} />
        </Link>
      </div>
    </div>
  );
}

export function DashboardPageClient() {
  const [data, setData] = useState<DashboardView | null>(null);
  const [source, setSource] = useState<"api" | "mock" | null>(null);
  const [loadError, setLoadError] = useState<string | undefined>();
  const [search, setSearch] = useState("");
  const [pendingDelete, setPendingDelete] = useState<ContentItem | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetchDashboard().then((result) => {
      if (!active) return;
      setData(result.data);
      setSource(result.source);
      setLoadError(result.error);
    });
    return () => {
      active = false;
    };
  }, []);

  const filteredItems = useMemo(() => {
    if (!data) return [];
    const query = search.trim().toLowerCase();
    if (!query) return data.items;
    return data.items.filter((item) => item.title.toLowerCase().includes(query));
  }, [data, search]);

  async function handleConfirmDelete() {
    if (!pendingDelete || !data) return;
    setActionError(null);

    if (source === "api") {
      try {
        if (pendingDelete.type === "News") {
          await deleteNews(pendingDelete.sourceId);
        } else {
          await deleteProject(pendingDelete.sourceId);
        }
      } catch (error) {
        setActionError(error instanceof Error ? error.message : "Delete failed");
        setPendingDelete(null);
        return;
      }
    }

    const items = data.items.filter((item) => item.id !== pendingDelete.id);
    const published = items.filter((item) => item.status === "Published").length;
    const projects = items.filter((item) => item.type === "Projects").length;
    const posts = items.filter((item) => item.type === "News").length;
    const drafts = items.filter((item) => item.status === "Draft").length;
    setData({
      items,
      stats: data.stats.map((stat) => {
        if (stat.key === "published") return { ...stat, value: published };
        if (stat.key === "projects") return { ...stat, value: projects };
        if (stat.key === "posts") return { ...stat, value: posts };
        if (stat.key === "drafts") return { ...stat, value: drafts };
        return stat;
      }),
    });
    setPendingDelete(null);
  }

  return (
    <div className="flex mt-3 h-full min-h-0 min-w-0 flex-col gap-5 overflow-hidden">
      <div className="flex shrink-0 items-start justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-semibold text-neutral-900">All Content</h1>
          <p className="mt-1 text-[15px] font-regular text-black">
            Projects and news published on the IFWYD website, in one place.
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <Link
            href="/posts/new"
            className="flex h-10 items-center gap-1.5 rounded-full bg-ifwyd-brand px-4 text-[12px] font-medium text-white transition-colors hover:bg-ifwyd-brand-dark"
          >
            <PlusIcon className="h-[18px] w-[18px] shrink-0" strokeWidth={2} />
            New Post
          </Link>
          {source === "mock" && loadError && (
            <span className="max-w-[220px] text-right text-[10px] font-light text-neutral-500">
              API error: {loadError}
            </span>
          )}
        </div>
      </div>

      {actionError && <p className="shrink-0 text-[12px] font-medium text-red-600">{actionError}</p>}

      {!data ? (
        <div className="flex min-h-0 flex-1 items-center justify-center text-[14px] text-neutral-500">
          Loading dashboard...
        </div>
      ) : (
        <>
          <div className="grid shrink-0 grid-cols-[1fr_1fr_1fr_1fr] gap-4">
            {data.stats.map((stat) => (
              <StatCard
                key={stat.key}
                label={stat.label}
                value={stat.value}
                change={stat.change}
                highlight={stat.highlight}
              />
            ))}
          </div>

          <div className="relative shrink-0">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
              <Search className="h-4 w-4 " strokeWidth={2} />
            </span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search Posts..."
              className="h-12 w-full rounded-full border border-neutral-200/80 bg-white pl-11 pr-4 text-[11px] text-neutral-900 outline-none placeholder:text-neutral-400 "
            />
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto rounded-[10px] border border-neutral-200/80 bg-white shadow-sm">
            {filteredItems.length === 0 ? (
              <p className="py-12 text-center text-[13px] text-neutral-400">No content found.</p>
            ) : (
              filteredItems.map((item) => (
                <ContentRow key={item.id} item={item} onDelete={() => setPendingDelete(item)} />
              ))
            )}
          </div>
        </>
      )}

      <ConfirmModal
        open={pendingDelete !== null}
        onClose={() => setPendingDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete this post?"
        description={`"${pendingDelete?.title ?? ""}" will be removed from the website. This action can't be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
      />
    </div>
  );
}
