import { getDefaultDonateSettings, type DonateSettings } from "@/lib/donate-data";
import { apiClient } from "./client";

export type DonateSettingsResult = {
  settings: DonateSettings;
  source: "api" | "mock";
  error?: string;
};

export async function fetchDonateSettings(): Promise<DonateSettingsResult> {
  try {
    const settings = await apiClient<DonateSettings>("/api/admin/donate");
    return { settings, source: "api" };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Donate settings API request failed";
    if (process.env.NODE_ENV === "development") console.error("[donate] Using demo data:", message);
    return { settings: getDefaultDonateSettings(), source: "mock", error: message };
  }
}

export async function saveDonateSettings(settings: DonateSettings): Promise<DonateSettingsResult> {
  const saved = await apiClient<DonateSettings>("/api/admin/donate", {
    method: "PATCH",
    body: JSON.stringify(settings),
  });
  return { settings: saved, source: "api" };
}
