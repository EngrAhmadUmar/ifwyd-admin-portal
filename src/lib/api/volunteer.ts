import {
  mockVolunteerApplications,
  VOLUNTEER_PER_PAGE,
  type SubmissionStatus,
  type VolunteerApplication,
} from "@/lib/volunteer-data";
import { apiClient } from "./client";

export type VolunteerListResult = {
  items: VolunteerApplication[];
  total: number;
  page: number;
  limit: number;
  source: "api" | "mock";
  error?: string;
};

export async function fetchVolunteerApplications(
  page = 1,
  limit = VOLUNTEER_PER_PAGE,
): Promise<VolunteerListResult> {
  try {
    const data = await apiClient<{ items: VolunteerApplication[]; total: number; page: number; limit: number }>(
      `/api/admin/volunteer?page=${page}&limit=${limit}`,
    );
    return { ...data, source: "api" };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Volunteer API request failed";
    if (process.env.NODE_ENV === "development") console.error("[volunteer] Using demo data:", message);
    const start = (page - 1) * limit;
    return {
      items: mockVolunteerApplications.slice(start, start + limit),
      total: mockVolunteerApplications.length,
      page,
      limit,
      source: "mock",
      error: message,
    };
  }
}

export async function updateVolunteerStatus(id: string, status: SubmissionStatus): Promise<void> {
  await apiClient(`/api/admin/volunteer/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export async function deleteVolunteerApplication(id: string): Promise<void> {
  await apiClient(`/api/admin/volunteer/${id}`, { method: "DELETE" });
}
