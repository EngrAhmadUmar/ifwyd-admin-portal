import { mockRegistrations, REGISTER_PER_PAGE, type Registration } from "@/lib/register-data";
import type { SubmissionStatus } from "@/lib/volunteer-data";
import { apiClient } from "./client";

export type RegistrationsListResult = {
  items: Registration[];
  total: number;
  page: number;
  limit: number;
  source: "api" | "mock";
  error?: string;
};

export async function fetchRegistrations(page = 1, limit = REGISTER_PER_PAGE): Promise<RegistrationsListResult> {
  try {
    const data = await apiClient<{ items: Registration[]; total: number; page: number; limit: number }>(
      `/api/admin/register?page=${page}&limit=${limit}`,
    );
    return { ...data, source: "api" };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Registrations API request failed";
    if (process.env.NODE_ENV === "development") console.error("[register] Using demo data:", message);
    const start = (page - 1) * limit;
    return {
      items: mockRegistrations.slice(start, start + limit),
      total: mockRegistrations.length,
      page,
      limit,
      source: "mock",
      error: message,
    };
  }
}

export async function updateRegistrationStatus(id: string, status: SubmissionStatus): Promise<void> {
  await apiClient(`/api/admin/register/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export async function deleteRegistration(id: string): Promise<void> {
  await apiClient(`/api/admin/register/${id}`, { method: "DELETE" });
}
