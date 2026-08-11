// Shared cross-domain types. Domain-specific types (NewsPost, Project, etc.)
// live next to their mock data in `src/lib/*-data.ts`.

export type ApiListResponse<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
};

export type FetchResult<T> = {
  data: T;
  source: "api" | "mock";
  error?: string;
};
