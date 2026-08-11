import { mockContactMessages, CONTACT_PER_PAGE, type ContactMessage, type MessageStatus } from "@/lib/contact-data";
import { apiClient } from "./client";

export type ContactListResult = {
  items: ContactMessage[];
  total: number;
  page: number;
  limit: number;
  source: "api" | "mock";
  error?: string;
};

export async function fetchContactMessages(page = 1, limit = CONTACT_PER_PAGE): Promise<ContactListResult> {
  try {
    const data = await apiClient<{ items: ContactMessage[]; total: number; page: number; limit: number }>(
      `/api/admin/contact?page=${page}&limit=${limit}`,
    );
    return { ...data, source: "api" };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Contact API request failed";
    if (process.env.NODE_ENV === "development") console.error("[contact] Using demo data:", message);
    const start = (page - 1) * limit;
    return {
      items: mockContactMessages.slice(start, start + limit),
      total: mockContactMessages.length,
      page,
      limit,
      source: "mock",
      error: message,
    };
  }
}

export async function updateContactStatus(id: string, status: MessageStatus): Promise<void> {
  await apiClient(`/api/admin/contact/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export async function deleteContactMessage(id: string): Promise<void> {
  await apiClient(`/api/admin/contact/${id}`, { method: "DELETE" });
}
