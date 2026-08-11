"use client";

import { ActionMenu } from "@/components/ui/ActionMenu";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { deleteProject, fetchProjects, updateProjectStatus } from "@/lib/api/projects";
import { PROJECTS_PER_PAGE, type Project, type ProjectStatus } from "@/lib/projects-data";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useState } from "react";

type PendingAction = { type: "publish" | "unpublish" | "delete"; id: string };

const MODAL_CONFIG: Record<PendingAction["type"], { title: string; description: string; confirmLabel: string }> = {
  publish: {
    title: "Publish Project",
    description: "Publish this project? It will become visible on the public website.",
    confirmLabel: "Publish",
  },
  unpublish: {
    title: "Unpublish Project",
    description: "Unpublish this project? It will be hidden from the public website.",
    confirmLabel: "Unpublish",
  },
  delete: {
    title: "Delete Project",
    description: "This will permanently remove this project. This cannot be undone.",
    confirmLabel: "Delete",
  },
};

const STATUS_STYLES: Record<ProjectStatus, string> = {
  Published: "bg-[#E8F5E9] text-[#13BE00]",
  Draft: "border border-neutral-300 bg-white text-neutral-400",
};

function StatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <span className={cn("inline-flex w-[90px] items-center justify-center rounded-[9px] py-1 text-[11px] font-[500]", STATUS_STYLES[status])}>
      {status}
    </span>
  );
}

const COLUMNS = ["Title", "Focus Area", "Slug", "Updated", "Status", "Action"] as const;
const COL_GRID = "grid-cols-[1.8fr_1fr_1.3fr_1fr_1fr_68px]";

export default function ProjectsPage() {
  const [items, setItems] = useState<Project[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<"api" | "mock" | null>(null);
  const [loadError, setLoadError] = useState<string | undefined>();
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const load = useCallback(async (pageNum: number) => {
    setLoading(true);
    const result = await fetchProjects(pageNum, PROJECTS_PER_PAGE);
    setItems(result.items);
    setTotal(result.total);
    setSource(result.source);
    setLoadError(result.error);
    setLoading(false);
  }, []);

  useEffect(() => {
    load(page);
  }, [page, load]);

  const totalPages = Math.max(1, Math.ceil(total / PROJECTS_PER_PAGE));

  async function handleConfirm() {
    if (!pendingAction) return;
    const { type, id } = pendingAction;
    setActionError(null);

    if (source === "api") {
      try {
        if (type === "delete") {
          await deleteProject(id);
        } else {
          await updateProjectStatus(id, type === "publish" ? "Published" : "Draft");
        }
        await load(page);
      } catch (error) {
        setActionError(error instanceof Error ? error.message : "Action failed");
        setPendingAction(null);
        return;
      }
    } else {
      if (type === "delete") {
        setItems((prev) => prev.filter((item) => item.id !== id));
        setTotal((t) => Math.max(0, t - 1));
      } else {
        const next: ProjectStatus = type === "publish" ? "Published" : "Draft";
        setItems((prev) => prev.map((item) => (item.id === id ? { ...item, status: next } : item)));
      }
    }

    setPendingAction(null);
  }

  const modal = pendingAction ? MODAL_CONFIG[pendingAction.type] : null;

  return (
    <div className="flex mt-3 h-full min-h-0 flex-col">
      <div className="flex shrink-0 items-start justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-[600] text-black">Projects</h1>
          <p className="mt-1 text-[15px] font-[400] text-black">
            Manage the projects and initiatives listed on the website.
          </p>
        </div>
        {source === "mock" && loadError && (
          <span className="max-w-[220px] shrink-0 text-right text-[10px] font-light text-neutral-500">
            API error: {loadError}
          </span>
        )}
      </div>

      {actionError && <p className="mt-2 text-[12px] font-medium text-red-600">{actionError}</p>}

      <div className="mt-5 flex min-h-0 flex-1 flex-col rounded-[10px] border border-neutral-200/80 bg-white shadow-sm">
        <div className={cn("grid shrink-0 items-center border-b border-neutral-200/80 bg-[#F9F9F9] px-6 py-3.5", COL_GRID)}>
          {COLUMNS.map((col) => (
            <span key={col} className="text-[13px] font-semibold text-black">
              {col}
            </span>
          ))}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {loading ? (
            <p className="py-12 text-center text-[13px] text-neutral-400">Loading projects...</p>
          ) : items.length === 0 ? (
            <p className="py-12 text-center text-[13px] text-neutral-400">No projects yet.</p>
          ) : (
            items.map((project) => (
              <div key={project.id} className={cn("grid items-center border-b border-neutral-100 px-6 py-3.5 last:border-0 hover:bg-neutral-50/60", COL_GRID)}>
                <span className="truncate pr-4 text-[13px] font-[500] text-black">{project.title}</span>
                <span className="text-[13px] font-[400] text-black">{project.focusArea}</span>
                <span className="truncate pr-2 text-[13px] font-[400] text-neutral-500">/{project.slug}</span>
                <span className="text-[13px] font-[400] text-black">{project.updatedDate}</span>
                <div>
                  <StatusBadge status={project.status} />
                </div>
                <ActionMenu
                  ariaLabel="Project actions"
                  items={[
                    {
                      label: project.status === "Published" ? "Unpublish" : "Publish",
                      onClick: () => setPendingAction({ type: project.status === "Published" ? "unpublish" : "publish", id: project.id }),
                    },
                    { label: "Delete", onClick: () => setPendingAction({ type: "delete", id: project.id }) },
                  ]}
                />
              </div>
            ))
          )}
        </div>

        <div className="flex shrink-0 items-center justify-between border-t border-neutral-200/80 px-6 py-3.5">
          <span className="text-[13px] font-[400] text-black">
            Showing {items.length} of {total.toLocaleString()} projects
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || loading}
              className="h-9 rounded-lg border border-neutral-300 px-5 text-[14px] font-[400] text-neutral-700 transition-colors hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Prev
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages || loading}
              className="h-9 rounded-lg bg-neutral-900 px-5 text-[14px] font-[400] text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {modal && (
        <ConfirmModal
          open
          onClose={() => setPendingAction(null)}
          onConfirm={handleConfirm}
          title={modal.title}
          description={modal.description}
          confirmLabel={modal.confirmLabel}
          cancelLabel="Cancel"
        />
      )}
    </div>
  );
}
