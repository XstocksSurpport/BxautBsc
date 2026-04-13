/**
 * Vercel build: generate NFT JSON with public HTTPS URLs, then Vite build.
 * Uses VERCEL_PROJECT_PRODUCTION_URL or VERCEL_URL (see https://vercel.com/docs/projects/environment-variables).
 */
const { execSync } = require("child_process");

function siteBase() {
  const raw =
    process.env.NFT_SITE_BASE?.trim() ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim() ||
    process.env.VERCEL_URL?.trim() ||
    "";
  if (!raw) {
    console.warn(
      "[vercel-build] No VERCEL_URL / VERCEL_PROJECT_PRODUCTION_URL — skipping gen:nft-metadata (run locally with NFT_SITE_BASE if needed).",
    );
    return null;
  }
  if (raw.startsWith("http://") || raw.startsWith("https://")) {
    return raw.replace(/\/$/, "");
  }
  return `https://${raw.replace(/\/$/, "")}`;
}

const base = siteBase();
const env = { ...process.env };
if (base) {
  env.NFT_SITE_BASE = base;
  console.log("[vercel-build] NFT_SITE_BASE =", base);
  execSync("npm run gen:nft-metadata", { stdio: "inherit", env });
}

execSync("npm run build", { stdio: "inherit", env });
