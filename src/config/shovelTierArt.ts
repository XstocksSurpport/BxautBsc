import type { ShovelTier } from "./constants";
import { shovelTokenIdToTier } from "./constants";
import { publicAsset } from "./publicPath";

const TIER_FILES: Record<ShovelTier, readonly [string, string]> = {
  0: ["nft/iron-shovel.jpg", "images/iron-shovel.png"],
  1: ["nft/silver-shovel.jpg", "images/silver-shovel.png"],
  2: ["nft/gold-shovel.jpg", "images/gold-shovel.png"],
};

/** Local art URLs for a tier (JPEG first, PNG backup under `public/images/`). */
export function shovelTierImageSources(tier: ShovelTier): string[] {
  return [...TIER_FILES[tier].map((p) => publicAsset(p))];
}

/** Same as tier art from on-chain token id (used when remote metadata image fails). */
export function shovelSourcesForTokenId(tokenId: number): string[] {
  const t = shovelTokenIdToTier(tokenId);
  const tier: ShovelTier = t ?? 2;
  return shovelTierImageSources(tier);
}
