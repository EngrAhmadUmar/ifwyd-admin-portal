import {
  createMockProject,
  getMockProject,
  mockProjects,
  PROJECTS_PER_PAGE,
  updateMockProject,
  type Project,
  type ProjectFocusArea,
  type ProjectStatus,
} from "@/lib/projects-data";
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

export type CreateProjectInput = {
  title: string;
  summary: string;
  focusArea: ProjectFocusArea;
  tags: string[];
  thumbnailUrl: string | null;
  body: string;
  status: ProjectStatus;
};

export type CreateProjectResult = { project: Project; source: "api" | "mock"; error?: string };

export async function createProject(input: CreateProjectInput): Promise<CreateProjectResult> {
  try {
    const project = await apiClient<Project>("/api/admin/projects", {
      method: "POST",
      body: JSON.stringify(input),
    });
    return { project, source: "api" };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Projects API request failed";
    if (process.env.NODE_ENV === "development") console.error("[projects] Saving locally:", message);
    return { project: createMockProject(input), source: "mock", error: message };
  }
}

export type ProjectFetchResult = { project: Project | null; source: "api" | "mock"; error?: string };

export async function getProject(id: string): Promise<ProjectFetchResult> {
  try {
    const project = await apiClient<Project>(`/api/admin/projects/${id}`);
    return { project, source: "api" };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Projects API request failed";
    if (process.env.NODE_ENV === "development") console.error("[projects] Using demo data:", message);
    return { project: getMockProject(id), source: "mock", error: message };
  }
}

export type UpdateProjectInput = Partial<CreateProjectInput>;

export async function updateProject(id: string, input: UpdateProjectInput): Promise<ProjectFetchResult> {
  try {
    const project = await apiClient<Project>(`/api/admin/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(input),
    });
    return { project, source: "api" };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Projects API request failed";
    if (process.env.NODE_ENV === "development") console.error("[projects] Saving locally:", message);
    return { project: updateMockProject(id, input), source: "mock", error: message };
  }
}
