/**
 * Export Standard JSON Input for BscScan manual verification of BXAUT (includes @openzeppelin).
 *
 *   npm run compile:contracts
 *   npm run export:bscscan-bxaut
 *
 * Writes:
 *   - contracts/bscscan-BXAUT-standard-input.json
 *   - bscscan-BXAUT-standard-input.json (repo root)
 */
const fs = require("fs");
const path = require("path");

const buildInfoDir = path.join(__dirname, "..", "contracts", "artifacts", "build-info");
const outFileContracts = path.join(
  __dirname,
  "..",
  "contracts",
  "bscscan-BXAUT-standard-input.json",
);
const outFileRoot = path.join(__dirname, "..", "bscscan-BXAUT-standard-input.json");

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
  const candidates = [];
  for (const f of files) {
    const full = path.join(buildInfoDir, f);
    const j = JSON.parse(fs.readFileSync(full, "utf8"));
    const hasBxaut =
      j.input?.sources && Object.keys(j.input.sources).includes("contracts/BXAUT.sol");
    if (!hasBxaut) continue;
    const stat = fs.statSync(full);
    candidates.push({ f, j, mtime: stat.mtimeMs });
  }
  candidates.sort((a, b) => b.mtime - a.mtime);
  const preferred = candidates.filter((c) => c.j.solcVersion === "0.8.20");
  const best = (preferred[0] || candidates[0]) ?? null;
  if (!best) {
    console.error("No build artifact for contracts/BXAUT.sol. Run: npx hardhat compile");
    process.exit(1);
  }

  const sanitized = sanitizeCompilerInput(best.j.input);
  const body = JSON.stringify(sanitized, null, 2);
  fs.writeFileSync(outFileContracts, body);
  fs.writeFileSync(outFileRoot, body);
  console.log("Wrote:", outFileContracts);
  console.log("Wrote:", outFileRoot);
  console.log("(from build-info", best.f + ")");
  console.log("Compiler (BscScan dropdown):", best.j.solcLongVersion || best.j.solcVersion);
  console.log("Optimizer: enabled, 200 runs");
  console.log(
    "\nBscScan → Contract → Verify → Solidity (Standard JSON Input) → upload ONE of the JSON files above.",
  );
}

main();
