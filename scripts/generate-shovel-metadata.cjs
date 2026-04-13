/**
 * Writes `public/nft-metadata/{1..799}.json` for ShovelNFT tokenURI.
 *
 *   Iron   token IDs 1–666   → image …/nft/iron-shovel.jpg
 *   Silver token IDs 667–777 → …/nft/silver-shovel.jpg
 *   Gold   token IDs 778–799 → …/nft/gold-shovel.jpg
 *
 * Requires NFT_SITE_BASE (HTTPS origin, no trailing slash), e.g. https://myapp.vercel.app
 */
const fs = require("fs");
const path = require("path");

const site = (process.env.NFT_SITE_BASE || "").trim().replace(/\/$/, "");
if (!site) {
  console.error(
    "Set NFT_SITE_BASE to your deployed site origin (e.g. https://example.com).",
  );
  process.exit(1);
}

const outDir = path.join(__dirname, "..", "public", "nft-metadata");
fs.mkdirSync(outDir, { recursive: true });

const image = {
  iron: `${site}/nft/iron-shovel.jpg`,
  silver: `${site}/nft/silver-shovel.jpg`,
  gold: `${site}/nft/gold-shovel.jpg`,
};

function tierForId(id) {
  if (id >= 1 && id <= 666) {
    return {
      key: "iron",
      label: "Iron Shovel",
      desc: "Iron shovel tier — 666 supply.",
    };
  }
  if (id >= 667 && id <= 777) {
    return {
      key: "silver",
      label: "Silver Shovel",
      desc: "Silver shovel tier — 111 supply.",
    };
  }
  if (id >= 778 && id <= 799) {
    return {
      key: "gold",
      label: "Gold Shovel",
      desc: "Gold shovel tier — 22 supply.",
    };
  }
  throw new Error(`token id out of range: ${id}`);
}

for (let id = 1; id <= 799; id++) {
  const t = tierForId(id);
  const meta = {
    name: `Bxaut Shovel #${id}`,
    description: t.desc,
    image: image[t.key],
    attributes: [
      { trait_type: "Tier", value: t.label },
      { trait_type: "Token ID", value: id },
    ],
  };
  fs.writeFileSync(
    path.join(outDir, `${id}.json`),
    JSON.stringify(meta, null, 2) + "\n",
    "utf8",
  );
}

console.log("Wrote 799 metadata files to public/nft-metadata/");
console.log("Images:", image.iron, image.silver, image.gold);
