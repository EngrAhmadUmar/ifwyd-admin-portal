"use client";

import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { deleteMedia, fetchMedia, uploadMedia } from "@/lib/api/media";
import { MEDIA_PER_PAGE, type MediaItem } from "@/lib/media-data";
import { ImagePlus, Trash2, Upload } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function MediaLibraryPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [source, setSource] = useState<"api" | "mock" | null>(null);
  const [loadError, setLoadError] = useState<string | undefined>();
  const [pendingDelete, setPendingDelete] = useState<MediaItem | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const result = await fetchMedia(1, MEDIA_PER_PAGE);
    setItems(result.items);
    setTotal(result.total);
    setSource(result.source);
    setLoadError(result.error);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function handleUploadClick() {
    fileInputRef.current?.click();
  }

  function handleFileSelected(file: File | null) {
    if (!file) return;
    setUploading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = typeof reader.result === "string" ? reader.result : "";
      const result = await uploadMedia({ filename: file.name, dataUrl, sizeLabel: formatFileSize(file.size) });
      setItems((prev) => [result.item, ...prev]);
      setTotal((t) => t + 1);
      setUploading(false);
    };
    reader.readAsDataURL(file);
  }

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
    setTotal((t) => Math.max(0, t - 1));
    setPendingDelete(null);
  }

  return (
    <div className="flex mt-3 h-full min-h-0 flex-col">
      <div className="flex shrink-0 items-start justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-[600] text-black">Media Library</h1>
          <p className="mt-1 text-[15px] font-[400] text-black">
            Images uploaded here can be used as cover images for posts and projects.
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <button
            type="button"
            onClick={handleUploadClick}
            disabled={uploading}
            className="flex h-10 items-center gap-1.5 rounded-full bg-ifwyd-brand px-4 text-[14px] font-semibold text-white transition-colors hover:bg-ifwyd-brand-dark disabled:opacity-60"
          >
            <Upload className="h-4 w-4" strokeWidth={2.5} />
            {uploading ? "Uploading..." : "Upload"}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(event) => handleFileSelected(event.target.files?.[0] ?? null)}
            className="hidden"
          />
          {source === "mock" && loadError && (
            <span className="max-w-[220px] text-right text-[10px] font-light text-neutral-500">
              API error: {loadError}
            </span>
          )}
        </div>
      </div>

      {actionError && <p className="mt-2 shrink-0 text-[12px] font-medium text-red-600">{actionError}</p>}

      <div className="mt-5 min-h-0 flex-1 overflow-y-auto rounded-[10px] border border-neutral-200/80 bg-white p-5 shadow-sm">
        {loading ? (
          <p className="py-12 text-center text-[13px] text-neutral-400">Loading media...</p>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-center text-neutral-400">
            <ImagePlus className="h-8 w-8" strokeWidth={1.5} />
            <p className="text-[13px]">No media uploaded yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-4">
            {items.map((item) => (
              <div key={item.id} className="group relative overflow-hidden rounded-xl border border-neutral-200/80">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.url} alt="" className="aspect-square w-full object-cover" />
                <div className="absolute inset-0 flex items-start justify-end bg-black/0 p-2 opacity-0 transition-opacity group-hover:bg-black/20 group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => setPendingDelete(item)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-neutral-700 shadow-sm transition-colors hover:bg-red-50 hover:text-red-600"
                    aria-label={`Delete ${item.filename}`}
                  >
                    <Trash2 className="h-4 w-4" strokeWidth={2} />
                  </button>
                </div>
                <div className="bg-white px-2.5 py-2">
                  <p className="truncate text-[12px] font-medium text-neutral-900">{item.filename}</p>
                  <p className="text-[11px] text-neutral-500">
                    {item.uploadedDate} · {item.sizeLabel}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="mt-3 shrink-0 text-[12px] text-neutral-500">{total.toLocaleString()} items</p>

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
