import { mockClassrooms, CLASSROOMS_PER_PAGE, type Classroom, type ClassroomStatus } from "@/lib/classrooms-data";
import { apiClient } from "./client";

export type ClassroomsListResult = {
  items: Classroom[];
  total: number;
  page: number;
  limit: number;
  source: "api" | "mock";
  error?: string;
};

export async function fetchClassrooms(page = 1, limit = CLASSROOMS_PER_PAGE): Promise<ClassroomsListResult> {
  try {
    const data = await apiClient<{ items: Classroom[]; total: number; page: number; limit: number }>(
      `/api/admin/classrooms?page=${page}&limit=${limit}`,
    );
    return { ...data, source: "api" };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Classrooms API request failed";
    if (process.env.NODE_ENV === "development") console.error("[classrooms] Using demo data:", message);
    const start = (page - 1) * limit;
    return {
      items: mockClassrooms.slice(start, start + limit),
      total: mockClassrooms.length,
      page,
      limit,
      source: "mock",
      error: message,
    };
  }
}

export async function updateClassroomStatus(id: string, status: ClassroomStatus): Promise<void> {
  await apiClient(`/api/admin/classrooms/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export async function deleteClassroom(id: string): Promise<void> {
  await apiClient(`/api/admin/classrooms/${id}`, { method: "DELETE" });
}
