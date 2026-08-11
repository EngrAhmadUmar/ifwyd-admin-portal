import { getContentStats, getMockContentItems, type ContentItem, type ContentStat } from "@/lib/dashboard-data";
import { apiClient } from "./client";

export type DashboardView = {
  stats: ContentStat[];
  items: ContentItem[];
};

export type DashboardFetchResult = {
  data: DashboardView;
  source: "api" | "mock";
  error?: string;
};

export async function fetchDashboard(): Promise<DashboardFetchResult> {
  try {
    const data = await apiClient<DashboardView>("/api/admin/dashboard/overview");
    return { data, source: "api" };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Dashboard API request failed";
    if (process.env.NODE_ENV === "development") console.error("[dashboard] Using demo data:", message);
    const items = getMockContentItems();
    return { data: { stats: getContentStats(items), items }, source: "mock", error: message };
  }
}
