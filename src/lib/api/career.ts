import {
  createMockJob,
  getMockJob,
  mockJobs,
  CAREER_PER_PAGE,
  updateMockJob,
  type JobPosting,
  type JobStatus,
  type JobType,
} from "@/lib/career-data";
import { apiClient } from "./client";

export type JobsListResult = {
  items: JobPosting[];
  total: number;
  page: number;
  limit: number;
  source: "api" | "mock";
  error?: string;
};

export async function fetchJobs(page = 1, limit = CAREER_PER_PAGE): Promise<JobsListResult> {
  try {
    const data = await apiClient<{ items: JobPosting[]; total: number; page: number; limit: number }>(
      `/api/admin/career?page=${page}&limit=${limit}`,
    );
    return { ...data, source: "api" };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Career API request failed";
    if (process.env.NODE_ENV === "development") console.error("[career] Using demo data:", message);
    const start = (page - 1) * limit;
    return {
      items: mockJobs.slice(start, start + limit),
      total: mockJobs.length,
      page,
      limit,
      source: "mock",
      error: message,
    };
  }
}

export async function updateJobStatus(id: string, status: JobStatus): Promise<void> {
  await apiClient(`/api/admin/career/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export async function deleteJob(id: string): Promise<void> {
  await apiClient(`/api/admin/career/${id}`, { method: "DELETE" });
}

export type JobInput = {
  title: string;
  department: string;
  location: string;
  description: string;
  type: JobType;
  status: JobStatus;
};

export type JobResult = { job: JobPosting | null; source: "api" | "mock"; error?: string };

export async function createJob(input: JobInput): Promise<JobResult> {
  try {
    const job = await apiClient<JobPosting>("/api/admin/career", {
      method: "POST",
      body: JSON.stringify(input),
    });
    return { job, source: "api" };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Career API request failed";
    if (process.env.NODE_ENV === "development") console.error("[career] Saving locally:", message);
    return { job: createMockJob(input), source: "mock", error: message };
  }
}

export async function getJob(id: string): Promise<JobResult> {
  try {
    const job = await apiClient<JobPosting>(`/api/admin/career/${id}`);
    return { job, source: "api" };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Career API request failed";
    if (process.env.NODE_ENV === "development") console.error("[career] Using demo data:", message);
    return { job: getMockJob(id), source: "mock", error: message };
  }
}

export async function updateJob(id: string, input: Partial<JobInput>): Promise<JobResult> {
  try {
    const job = await apiClient<JobPosting>(`/api/admin/career/${id}`, {
      method: "PUT",
      body: JSON.stringify(input),
    });
    return { job, source: "api" };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Career API request failed";
    if (process.env.NODE_ENV === "development") console.error("[career] Saving locally:", message);
    return { job: updateMockJob(id, input), source: "mock", error: message };
  }
}
