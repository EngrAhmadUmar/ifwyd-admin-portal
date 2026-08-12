export type MediaItem = {
  id: string;
  filename: string;
  url: string;
  uploadedDate: string;
  sizeLabel: string;
};

export const MEDIA_PER_PAGE = 12;

function formatToday(): string {
  return new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/** Adds a media item to the in-memory mock library (dev-only, no backend yet). */
export function createMockMediaItem(input: { filename: string; url: string; sizeLabel: string }): MediaItem {
  const item: MediaItem = {
    id: `local-${Date.now()}`,
    filename: input.filename,
    url: input.url,
    uploadedDate: formatToday(),
    sizeLabel: input.sizeLabel,
  };
  mockMedia.unshift(item);
  return item;
}

export const mockMedia: MediaItem[] = [
  { id: "1", filename: "skill-acquisition-cohort.jpg", url: "https://picsum.photos/seed/ifwyd-media-1/400/400", uploadedDate: "Aug 5, 2026", sizeLabel: "240 KB" },
  { id: "2", filename: "food-drive-bauchi.jpg", url: "https://picsum.photos/seed/ifwyd-media-2/400/400", uploadedDate: "Aug 2, 2026", sizeLabel: "310 KB" },
  { id: "3", filename: "16-days-activism-rally.jpg", url: "https://picsum.photos/seed/ifwyd-media-3/400/400", uploadedDate: "Jul 28, 2026", sizeLabel: "198 KB" },
  { id: "4", filename: "classroom-digital-literacy.jpg", url: "https://picsum.photos/seed/ifwyd-media-4/400/400", uploadedDate: "Jul 20, 2026", sizeLabel: "275 KB" },
  { id: "5", filename: "vapp-bill-stakeholders.jpg", url: "https://picsum.photos/seed/ifwyd-media-5/400/400", uploadedDate: "Jul 12, 2026", sizeLabel: "212 KB" },
  { id: "6", filename: "girls-in-stem-club.jpg", url: "https://picsum.photos/seed/ifwyd-media-6/400/400", uploadedDate: "Jun 30, 2026", sizeLabel: "260 KB" },
];
