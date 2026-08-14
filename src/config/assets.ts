const ASSET_BASE = "/Asset";

/** Build a public URL for a file in `public/Asset/`. */
export function assetPath(filename: string): string {
  return `${ASSET_BASE}/${filename}`;
}

export const assets = {
  logo: assetPath("logo.png"),
  logoHorizontal: assetPath("logo1.png"),
} as const;
