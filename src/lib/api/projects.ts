import { mockProjects, PROJECTS_PER_PAGE, type Project, type ProjectStatus } from "@/lib/projects-data";
import { apiClient } from "./client";

export type ProjectsListResult = {
  items: Project[];
  total: number;
  page: number;
  limit: number;
  source: "api" | "mock";
  error?: string;
};

export async function fetchProjects(page = 1, limit = PROJECTS_PER_PAGE): Promise<ProjectsListResult> {
  try {
    const data = await apiClient<{ items: Project[]; total: number; page: number; limit: number }>(
      `/api/admin/projects?page=${page}&limit=${limit}`,
    );
    return { ...data, source: "api" };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Projects API request failed";
    if (process.env.NODE_ENV === "development") console.error("[projects] Using demo data:", message);
    const start = (page - 1) * limit;
    return {
      items: mockProjects.slice(start, start + limit),
      total: mockProjects.length,
      page,
      limit,
      source: "mock",
      error: message,
    };
  }
}

export async function updateProjectStatus(id: string, status: ProjectStatus): Promise<void> {
  await apiClient(`/api/admin/projects/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export async function deleteProject(id: string): Promise<void> {
  await apiClient(`/api/admin/projects/${id}`, { method: "DELETE" });
}
