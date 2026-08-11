const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");

/** Turn API file paths (uploaded images, documents) into browser-loadable URLs. */
export function resolveMediaUrl(url?: string | null): string | null {
  if (!url?.trim()) return null;
  const value = url.trim();

  if (/^https?:\/\//i.test(value) || value.startsWith("data:") || value.startsWith("blob:")) {
    return value;
  }

  // s3:// keys cannot load directly in the browser — backend should presign.
  if (value.startsWith("s3://")) return null;

  if (!API_URL) {
    return value.startsWith("/") ? value : `/${value}`;
  }

  return value.startsWith("/") ? `${API_URL}${value}` : `${API_URL}/${value}`;
}
