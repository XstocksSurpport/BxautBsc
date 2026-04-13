/**
 * Export Standard JSON Input for BscScan manual verification (includes @openzeppelin sources).
 *
 *   npm run export:bscscan-shovel
 *
 * BscScan requires each source as literal { "content": "..." } only — no `urls` / ipfs fields.
 * Writes pretty-printed JSON for easier upload.
 *
 * Output:
 *   - contracts/bscscan-ShovelNFT-standard-input.json
 *   - bscscan-ShovelNFT-standard-input.json (repo root, easier to find in Explorer)
 */
const fs = require("fs");
const path = require("path");

const buildInfoDir = path.join(__dirname, "..", "contracts", "artifacts", "build-info");
const outFileContracts = path.join(
  __dirname,
  "..",
  "contracts",
  "bscscan-ShovelNFT-standard-input.json",
);
const outFileRoot = path.join(__dirname, "..", "bscscan-ShovelNFT-standard-input.json");

/** BscScan: sources must be literal content only, not URL references. */
function sanitizeCompilerInput(input) {
  const sources = {};
  for (const [key, val] of Object.entries(input.sources || {})) {
    if (!val || typeof val.content !== "string") {
      throw new Error(
        `Source "${key}" has no "content" string. Re-run: npx hardhat compile`,
      );
    }
    sources[key] = { content: val.content };
  }
  const settings = JSON.parse(JSON.stringify(input.settings));
  // Hardhat adds outputSelection["*"][""] for project-wide AST; some explorers
  // mis-parse empty contract keys. Removing it does not change compiled bytecode.
  const star = settings.outputSelection?.["*"];
  if (star && Object.prototype.hasOwnProperty.call(star, "")) {
    delete star[""];
    if (Object.keys(star).length === 0) {
      delete settings.outputSelection["*"];
    }
    if (Object.keys(settings.outputSelection).length === 0) {
      delete settings.outputSelection;
    }
  }
  return {
    language: input.language,
    sources,
    settings,
  };
}

function main() {
  if (!fs.existsSync(buildInfoDir)) {
    console.error("No build-info; run: npx hardhat compile");
    process.exit(1);
  }
  const files = fs.readdirSync(buildInfoDir).filter((f) => f.endsWith(".json"));
  /** Prefer Hardhat config compiler (0.8.20) so BscScan compiler dropdown matches. */
  const candidates = [];
  for (const f of files) {
    const full = path.join(buildInfoDir, f);
    const j = JSON.parse(fs.readFileSync(full, "utf8"));
    const hasShovel =
      j.input?.sources && Object.keys(j.input.sources).includes("contracts/ShovelNFT.sol");
    if (!hasShovel) continue;
    const stat = fs.statSync(full);
    candidates.push({ f, j, mtime: stat.mtimeMs });
  }
  candidates.sort((a, b) => b.mtime - a.mtime);
  const preferred = candidates.filter((c) => c.j.solcVersion === "0.8.20");
  const best = (preferred[0] || candidates[0]) ?? null;
  if (!best) {
    console.error("No build artifact for contracts/ShovelNFT.sol. Run: npx hardhat compile");
    process.exit(1);
  }

  const sanitized = sanitizeCompilerInput(best.j.input);
  const body = JSON.stringify(sanitized, null, 2);
  fs.writeFileSync(outFileContracts, body);
  fs.writeFileSync(outFileRoot, body);
  console.log("Wrote:", outFileContracts);
  console.log("Wrote:", outFileRoot, "(项目根目录，资源管理器里和 package.json 同级)");
  console.log("(from build-info", best.f + ")");
  console.log("Compiler (use exact match on BscScan):", best.j.solcLongVersion || best.j.solcVersion);
  console.log("Optimizer: enabled, 200 runs (from Hardhat config)");
  console.log(
    "\nBscScan: Solidity (Standard JSON Input) → upload ONE of the files above (not the whole build-info JSON).",
  );
  console.log("Do NOT paste JSON into a text field as a quoted string — upload the .json file directly.");
}

main();
