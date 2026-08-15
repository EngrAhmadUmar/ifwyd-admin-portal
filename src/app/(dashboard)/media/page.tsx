"use client";

import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { deleteMedia, fetchMedia } from "@/lib/api/media";
import { MEDIA_PER_PAGE, type MediaItem } from "@/lib/media-data";
import { ImageOff, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export default function MediaLibraryPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<"api" | "mock" | null>(null);
  const [loadError, setLoadError] = useState<string | undefined>();
  const [pendingDelete, setPendingDelete] = useState<MediaItem | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const result = await fetchMedia(1, MEDIA_PER_PAGE);
    setItems(result.items);
    setSource(result.source);
    setLoadError(result.error);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleConfirmDelete() {
    if (!pendingDelete) return;
    setActionError(null);

    if (source === "api") {
      try {
        await deleteMedia(pendingDelete.id);
      } catch (error) {
        setActionError(error instanceof Error ? error.message : "Delete failed");
        setPendingDelete(null);
        return;
      }
    }

    setItems((prev) => prev.filter((item) => item.id !== pendingDelete.id));
    setPendingDelete(null);
  }

  return (
    <div className="mt-3 flex h-full min-h-0 flex-col">
      <div>
        <h1 className="text-[22px] font-[600] text-black">Media library</h1>
        <p className="mt-1 text-[15px] font-[400] text-black">Images used across projects and news posts.</p>
        {source === "mock" && loadError && (
          <p className="mt-1 text-[10px] font-light text-neutral-400">API error: {loadError}</p>
        )}
      </div>

      {actionError && <p className="mt-2 shrink-0 text-[12px] font-medium text-red-600">{actionError}</p>}

      <div className="mt-6 min-h-0 flex-1 overflow-y-auto">
        {loading ? (
          <p className="py-12 text-center text-[13px] text-neutral-400">Loading media...</p>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-center text-neutral-400">
            <ImageOff className="h-8 w-8" strokeWidth={1.5} />
            <p className="text-[13px]">No images yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,256px)] gap-5">
            {items.map((item) => (
              <div key={item.id} className="group relative h-[158px] w-[256px] overflow-hidden rounded-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.url} alt="" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => setPendingDelete(item)}
                  className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-neutral-700 opacity-0 shadow-sm transition-opacity hover:bg-red-50 hover:text-red-600 group-hover:opacity-100"
                  aria-label={`Delete ${item.filename}`}
                >
                  <Trash2 className="h-4 w-4" strokeWidth={2} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmModal
        open={pendingDelete !== null}
        onClose={() => setPendingDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete this file?"
        description={`"${pendingDelete?.filename ?? ""}" will be removed from the media library. This action can't be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
      />
    </div>
  );
}
