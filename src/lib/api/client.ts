import { clearTokens, getAccessToken, getRefreshToken, saveTokens } from "@/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

async function refreshAccessToken(): Promise<string | null> {
  const refresh = getRefreshToken();
  if (!refresh) return null;
  try {
    const res = await fetch(`${API_URL}/api/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refresh }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const tokens = data.tokens ?? data;
    const accessToken = tokens.access_token;
    const refreshToken = tokens.refresh_token ?? refresh;
    if (!accessToken) return null;
    saveTokens(accessToken, refreshToken);
    return accessToken;
  } catch {
    return null;
  }
}

/**
 * Thin fetch wrapper: attaches the bearer token, retries once after a
 * refresh on 401, and unwraps the `{ success, data }` envelope used by the
 * backend. Domain modules in `lib/api/*` call this and fall back to mock
 * data (see `lib/*-data.ts`) whenever it throws.
 */
export async function apiClient<T>(path: string, options: RequestInit = {}): Promise<T> {
  let token = getAccessToken();

  const makeRequest = async (t: string | null) => {
    if (!API_URL) {
      throw new Error("NEXT_PUBLIC_API_URL is not set. Add it to .env.local once the backend exists.");
    }
    try {
      return await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...(t ? { Authorization: `Bearer ${t}` } : {}),
          ...(options.headers ?? {}),
        },
      });
    } catch {
      throw new Error(`Cannot reach API at ${API_URL}. Is the backend running?`);
    }
  };

  let res = await makeRequest(token);

  // Token expired — try once with a refreshed token
  if (res.status === 401 && token) {
    token = await refreshAccessToken();
    if (!token) {
      clearTokens();
      if (typeof window !== "undefined") window.location.href = "/login";
      throw new Error("Session expired");
    }
    res = await makeRequest(token);
  }

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    const message =
      (json && typeof json === "object" && "error" in json &&
        json.error &&
        typeof json.error === "object" &&
        "message" in json.error &&
        typeof json.error.message === "string"
        ? json.error.message
        : null) ??
      (json && typeof json === "object" && "message" in json && typeof json.message === "string"
        ? json.message
        : null) ??
      `API error: ${res.status}`;
    throw new Error(message);
  }

  if (json && typeof json === "object" && "success" in json && json.success && "data" in json) {
    return json.data as T;
  }
  return json as T;
}
