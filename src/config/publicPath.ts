/** Vite `base` (e.g. `/` or `/repository-name/`). Always ends with `/`. */
export function viteBase(): string {
  const b = import.meta.env.BASE_URL || "/";
  return b.endsWith("/") ? b : `${b}/`;
}

const IPFS_GATEWAYS = [
  "https://ipfs.io/ipfs/",
  "https://cloudflare-ipfs.com/ipfs/",
  "https://dweb.link/ipfs/",
] as const;

/** Extract `CID[/path]` from `ipfs://…` or `https://…/ipfs/…` URLs. */
function extractIpfsSubpath(uri: string): string | null {
  const s = uri.trim();
  if (!s) return null;
  if (s.toLowerCase().startsWith("ipfs://")) {
    const rest = s.slice("ipfs://".length).replace(/^ipfs\/?/i, "");
    return rest || null;
  }
  const lower = s.toLowerCase();
  const idx = lower.indexOf("/ipfs/");
  if (idx >= 0) {
    const sub = s.slice(idx + "/ipfs/".length);
    return sub || null;
  }
  return null;
}

/**
 * Ordered HTTP URLs for the same IPFS object (first is primary).
 * Non-IPFS URLs return a single-element array.
 */
export function mediaUrlFallbackChain(url: string): string[] {
  const sub = extractIpfsSubpath(url);
  if (sub) {
    return IPFS_GATEWAYS.map((g) => `${g}${sub}`);
  }
  const t = url.trim();
  return t ? [t] : [];
}

/** Absolute path for files under `public/` (GitHub Pages subpath-safe). */
export function publicAsset(path: string): string {
  const raw = path.trim().replace(/^\/+/, "");
  if (!raw || raw.includes("..") || /[\0\r\n]/.test(raw)) {
    if (import.meta.env.DEV) {
      console.warn("[publicAsset] invalid path, using favicon:", path);
    }
    return `${viteBase()}favicon.svg`;
  }
  return `${viteBase()}${raw}`;
}

/** Primary URL for metadata / media (IPFS uses first gateway). */
export function resolveMediaUri(uri: string): string {
  const chain = mediaUrlFallbackChain(uri);
  return chain[0] ?? "";
}
