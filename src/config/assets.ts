const ASSET_BASE = "/Asset";

/** Build a public URL for a file in `public/Asset/`. */
export function assetPath(filename: string): string {
  return `${ASSET_BASE}/${filename}`;
}

export const assets = {
  logo: assetPath("logo.png"),
} as const;
