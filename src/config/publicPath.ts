/** Vite `base` (e.g. `/` or `/repo-name/`). Always ends with `/`. */
export function viteBase(): string {
  const b = import.meta.env.BASE_URL || "/";
  return b.endsWith("/") ? b : `${b}/`;
}

/** Absolute path for files under `public/` (works on GitHub Pages with subpath base). */
export function publicAsset(path: string): string {
  const p = path.replace(/^\//, "");
  return `${viteBase()}${p}`;
}

/** Resolve ipfs:// for browser fetch. */
export function resolveMediaUri(uri: string): string {
  const u = uri.trim();
  if (u.startsWith("ipfs://")) {
    const rest = u.slice("ipfs://".length).replace(/^ipfs\/?/, "");
    return `https://ipfs.io/ipfs/${rest}`;
  }
  return u;
}
