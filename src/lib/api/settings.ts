import { getDefaultSettings, type SettingsState } from "@/lib/settings-data";
import { apiClient } from "./client";

export type SettingsResult = {
  settings: SettingsState;
  source: "api" | "mock";
  error?: string;
};

export async function fetchSettings(): Promise<SettingsResult> {
  try {
    const settings = await apiClient<SettingsState>("/api/admin/settings");
    return { settings, source: "api" };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Settings API request failed";
    if (process.env.NODE_ENV === "development") console.error("[settings] Using demo data:", message);
    return { settings: getDefaultSettings(), source: "mock", error: message };
  }
}

export async function saveSettings(settings: SettingsState): Promise<SettingsResult> {
  const saved = await apiClient<SettingsState>("/api/admin/settings", {
    method: "PATCH",
    body: JSON.stringify(settings),
  });
  return { settings: saved, source: "api" };
}

export async function resetSettings(): Promise<SettingsResult> {
  const settings = await apiClient<SettingsState>("/api/admin/settings/reset", { method: "POST" });
  return { settings, source: "api" };
}
