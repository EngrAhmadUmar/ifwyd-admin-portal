import { getDefaultContentSections, type ContentSection } from "@/lib/content-data";
import { apiClient } from "./client";

export type ContentSectionsResult = {
  sections: ContentSection[];
  source: "api" | "mock";
  error?: string;
};

export async function fetchContentSections(): Promise<ContentSectionsResult> {
  try {
    const data = await apiClient<{ items: ContentSection[] }>("/api/admin/content");
    return { sections: data.items, source: "api" };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Content API request failed";
    if (process.env.NODE_ENV === "development") console.error("[content] Using demo data:", message);
    return { sections: getDefaultContentSections(), source: "mock", error: message };
  }
}

export async function saveContentSection(section: ContentSection): Promise<void> {
  await apiClient(`/api/admin/content/${section.id}`, {
    method: "PUT",
    body: JSON.stringify({ body: section.body }),
  });
}
