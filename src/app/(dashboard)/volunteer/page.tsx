"use client";

import { ActionMenu } from "@/components/ui/ActionMenu";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { deleteVolunteerApplication, fetchVolunteerApplications, updateVolunteerStatus } from "@/lib/api/volunteer";
import { VOLUNTEER_PER_PAGE, type SubmissionStatus, type VolunteerApplication } from "@/lib/volunteer-data";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useState } from "react";

type PendingAction = { type: "contacted" | "archive" | "delete"; id: string; title: string };

function getModalConfig(action: PendingAction) {
  switch (action.type) {
    case "contacted":
      return {
        title: "Mark as Contacted",
        description: `Mark "${action.title}"'s application as contacted?`,
        confirmLabel: "Mark Contacted",
        danger: false,
      };
    case "archive":
      return {
        title: "Archive Application",
        description: `Archive "${action.title}"'s application? It will be moved out of the active list.`,
        confirmLabel: "Archive",
        danger: false,
      };
    case "delete":
      return {
        title: "Delete this application?",
        description: `"${action.title}"'s application will be permanently removed. This action can't be undone.`,
        confirmLabel: "Delete",
        danger: true,
      };
  }
}

const STATUS_STYLES: Record<SubmissionStatus, string> = {
  New: "bg-[#E8F5E9] text-[#13BE00]",
  Contacted: "bg-[#FFF7E0] text-[#B7791F]",
  Archived: "border border-neutral-300 bg-white text-neutral-400",
};

function StatusBadge({ status }: { status: SubmissionStatus }) {
  return (
    <span className={cn("inline-flex w-[92px] items-center justify-center rounded-[9px] py-1 text-[11px] font-[500]", STATUS_STYLES[status])}>
      {status}
    </span>
  );
}

const COLUMNS = ["Name", "Contact", "Interests", "Submitted", "Status", "Action"] as const;
const COL_GRID = "grid-cols-[1.3fr_1.5fr_1.8fr_1fr_1fr_68px]";

export default function VolunteerPage() {
  const [items, setItems] = useState<VolunteerApplication[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<"api" | "mock" | null>(null);
  const [loadError, setLoadError] = useState<string | undefined>();
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const load = useCallback(async (pageNum: number) => {
    setLoading(true);
    const result = await fetchVolunteerApplications(pageNum, VOLUNTEER_PER_PAGE);
    setItems(result.items);
    setTotal(result.total);
    setSource(result.source);
    setLoadError(result.error);
    setLoading(false);
  }, []);

  useEffect(() => {
    load(page);
  }, [page, load]);

  const totalPages = Math.max(1, Math.ceil(total / VOLUNTEER_PER_PAGE));

  async function handleConfirm() {
    if (!pendingAction) return;
    const { type, id } = pendingAction;
    setActionError(null);
    const nextStatus: SubmissionStatus = type === "contacted" ? "Contacted" : "Archived";

    if (source === "api") {
      try {
        if (type === "delete") {
          await deleteVolunteerApplication(id);
        } else {
          await updateVolunteerStatus(id, nextStatus);
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
        setItems((prev) => prev.map((item) => (item.id === id ? { ...item, status: nextStatus } : item)));
      }
    }

    setPendingAction(null);
  }

  const modal = pendingAction ? getModalConfig(pendingAction) : null;

  return (
    <div className="flex mt-3 h-full min-h-0 flex-col">
      <div className="flex shrink-0 items-start justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-[600] text-black">Volunteer Applications</h1>
          <p className="mt-1 text-[15px] font-[400] text-black">
            Review and follow up on volunteer sign-ups from the website.
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
            <p className="py-12 text-center text-[13px] text-neutral-400">Loading applications...</p>
          ) : items.length === 0 ? (
            <p className="py-12 text-center text-[13px] text-neutral-400">No volunteer applications yet.</p>
          ) : (
            items.map((app) => (
              <div key={app.id} className={cn("grid items-center border-b border-neutral-100 px-6 py-3.5 last:border-0 hover:bg-neutral-50/60", COL_GRID)}>
                <span className="truncate pr-4 text-[13px] font-[500] text-black">{app.name}</span>
                <div className="min-w-0 pr-4">
                  <p className="truncate text-[13px] text-black">{app.email}</p>
                  <p className="truncate text-[11px] text-neutral-500">{app.phone}</p>
                </div>
                <span className="truncate pr-4 text-[13px] font-[400] text-black">{app.interests}</span>
                <span className="text-[13px] font-[400] text-black">{app.submittedDate}</span>
                <div>
                  <StatusBadge status={app.status} />
                </div>
                <ActionMenu
                  ariaLabel="Application actions"
                  items={[
                    { label: "Mark Contacted", onClick: () => setPendingAction({ type: "contacted", id: app.id, title: app.name }) },
                    { label: "Archive", onClick: () => setPendingAction({ type: "archive", id: app.id, title: app.name }) },
                    { label: "Delete", onClick: () => setPendingAction({ type: "delete", id: app.id, title: app.name }) },
                  ]}
                />
              </div>
            ))
          )}
        </div>

        <div className="flex shrink-0 items-center justify-between border-t border-neutral-200/80 px-6 py-3.5">
          <span className="text-[13px] font-[400] text-black">
            Showing {items.length} of {total.toLocaleString()} applications
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
          variant={modal.danger ? "danger" : "default"}
        />
      )}
    </div>
  );
}
