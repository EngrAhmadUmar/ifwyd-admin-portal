import { createMockMediaItem, mockMedia, MEDIA_PER_PAGE, type MediaItem } from "@/lib/media-data";
import { apiClient } from "./client";

export type MediaListResult = {
  items: MediaItem[];
  total: number;
  page: number;
  limit: number;
  source: "api" | "mock";
  error?: string;
};

export async function fetchMedia(page = 1, limit = MEDIA_PER_PAGE): Promise<MediaListResult> {
  try {
    const data = await apiClient<{ items: MediaItem[]; total: number; page: number; limit: number }>(
      `/api/admin/media?page=${page}&limit=${limit}`,
    );
    return { ...data, source: "api" };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Media API request failed";
    if (process.env.NODE_ENV === "development") console.error("[media] Using demo data:", message);
    const start = (page - 1) * limit;
    return {
      items: mockMedia.slice(start, start + limit),
      total: mockMedia.length,
      page,
      limit,
      source: "mock",
      error: message,
    };
  }
}

export async function deleteMedia(id: string): Promise<void> {
  await apiClient(`/api/admin/media/${id}`, { method: "DELETE" });
}

export type UploadMediaInput = { filename: string; dataUrl: string; sizeLabel: string };
export type UploadMediaResult = { item: MediaItem; source: "api" | "mock"; error?: string };

export async function uploadMedia(input: UploadMediaInput): Promise<UploadMediaResult> {
  try {
    const item = await apiClient<MediaItem>("/api/admin/media", {
      method: "POST",
      body: JSON.stringify(input),
    });
    return { item, source: "api" };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Media API request failed";
    if (process.env.NODE_ENV === "development") console.error("[media] Saving locally:", message);
    return {
      item: createMockMediaItem({ filename: input.filename, url: input.dataUrl, sizeLabel: input.sizeLabel }),
      source: "mock",
      error: message,
    };
  }
}
