import {
  createMockNewsPost,
  getMockNewsPost,
  mockNews,
  NEWS_PER_PAGE,
  updateMockNewsPost,
  type NewsPost,
  type NewsStatus,
} from "@/lib/news-data";
import { apiClient } from "./client";

export type NewsListResult = {
  items: NewsPost[];
  total: number;
  page: number;
  limit: number;
  source: "api" | "mock";
  error?: string;
};

export async function fetchNews(page = 1, limit = NEWS_PER_PAGE): Promise<NewsListResult> {
  try {
    const data = await apiClient<{ items: NewsPost[]; total: number; page: number; limit: number }>(
      `/api/admin/news?page=${page}&limit=${limit}`,
    );
    return { ...data, source: "api" };
  } catch (error) {
    const message = error instanceof Error ? error.message : "News API request failed";
    if (process.env.NODE_ENV === "development") console.error("[news] Using demo data:", message);
    const start = (page - 1) * limit;
    return {
      items: mockNews.slice(start, start + limit),
      total: mockNews.length,
      page,
      limit,
      source: "mock",
      error: message,
    };
  }
}

export async function updateNewsStatus(id: string, status: NewsStatus): Promise<void> {
  await apiClient(`/api/admin/news/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export async function deleteNews(id: string): Promise<void> {
  await apiClient(`/api/admin/news/${id}`, { method: "DELETE" });
}

export type CreateNewsInput = {
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  thumbnailUrl: string | null;
  body: string;
  status: NewsStatus;
};

export type CreateNewsResult = { post: NewsPost; source: "api" | "mock"; error?: string };

export async function createNews(input: CreateNewsInput): Promise<CreateNewsResult> {
  try {
    const post = await apiClient<NewsPost>("/api/admin/news", {
      method: "POST",
      body: JSON.stringify(input),
    });
    return { post, source: "api" };
  } catch (error) {
    const message = error instanceof Error ? error.message : "News API request failed";
    if (process.env.NODE_ENV === "development") console.error("[news] Saving locally:", message);
    return { post: createMockNewsPost(input), source: "mock", error: message };
  }
}

export type NewsFetchResult = { post: NewsPost | null; source: "api" | "mock"; error?: string };

export async function getNews(id: string): Promise<NewsFetchResult> {
  try {
    const post = await apiClient<NewsPost>(`/api/admin/news/${id}`);
    return { post, source: "api" };
  } catch (error) {
    const message = error instanceof Error ? error.message : "News API request failed";
    if (process.env.NODE_ENV === "development") console.error("[news] Using demo data:", message);
    return { post: getMockNewsPost(id), source: "mock", error: message };
  }
}

export type UpdateNewsInput = Partial<CreateNewsInput>;

export async function updateNews(id: string, input: UpdateNewsInput): Promise<NewsFetchResult> {
  try {
    const post = await apiClient<NewsPost>(`/api/admin/news/${id}`, {
      method: "PUT",
      body: JSON.stringify(input),
    });
    return { post, source: "api" };
  } catch (error) {
    const message = error instanceof Error ? error.message : "News API request failed";
    if (process.env.NODE_ENV === "development") console.error("[news] Saving locally:", message);
    return { post: updateMockNewsPost(id, input), source: "mock", error: message };
  }
}
