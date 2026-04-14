import { parseUnits } from "ethers";

/** BSC Mainnet */
export const BSC_CHAIN_ID = 56;
export const BSC_CHAIN_ID_HEX = "0x38";

/** BEP-20 USDT on BSC (18 decimals) */
export const BSC_USDT_ADDRESS =
  "0x55d398326f99059fF775485246999027B3197955" as const;

/** Treasury — mint proceeds destination (per product spec) */
export const TREASURY_ADDRESS =
  "0x5AD2F3984258038Cfcb350CF30414FFF211428D8" as const;

export type ShovelTier = 0 | 1 | 2;

/**
 * Frontend-only mint meter: at this UTC instant, simulated % equals tier base
 * (iron 54%, silver 28%, gold 11%). After that, sim increases per product rules
 * until 60%, then the bar follows on-chain mint % only.
 */
export const SHOVEL_MINT_DISPLAY_PROGRESS_ANCHOR_MS = Date.UTC(2026, 3, 14, 0, 0, 0, 0);

export const SHOVEL_TIERS: Record<
  ShovelTier,
  {
    priceUsdt: string;
    supply: number;
    key: "iron" | "silver" | "gold";
    /** Per-NFT share of total dividend / fee pool (display %, product spec) */
    feeSharePercent: string;
  }
> = {
  0: { priceUsdt: "8.88", supply: 666, key: "iron", feeSharePercent: "0.0695" },
  1: { priceUsdt: "44.44", supply: 111, key: "silver", feeSharePercent: "0.2777" },
  2: { priceUsdt: "111.11", supply: 22, key: "gold", feeSharePercent: "1.041" },
};

export function tierPriceWei(tier: ShovelTier) {
  const { priceUsdt } = SHOVEL_TIERS[tier];
  return parseUnits(priceUsdt, 18);
}

/**
 * Display-only: implied XAUT per mint scales with the card’s fee-share ratio
 * (`feeSharePercent` as decimal, e.g. 0.0695 → 6.95% weight in the model).
 * Not enforced on-chain.
 */
export const SHOVEL_TIER_XAUT_MODEL_MULTIPLIER = 31500;

export function estimatedXautPerMintFromFeeShare(feeSharePercent: string): number {
  const p = Number.parseFloat(feeSharePercent);
  if (!Number.isFinite(p) || p < 0) return 0;
  return Math.floor(SHOVEL_TIER_XAUT_MODEL_MULTIPLIER * p);
}

/** On-chain ShovelNFT token ID bands (iron / silver / gold). */
export function shovelTokenIdToTier(tokenId: number): ShovelTier | null {
  if (!Number.isFinite(tokenId)) return null;
  const id = Math.trunc(tokenId);
  if (id < 1 || id > 799) return null;
  if (id <= 666) return 0;
  if (id <= 777) return 1;
  return 2;
}

/** Sum of per-shovel Bxaut model weights for the given on-chain token IDs. */
export function sumEstimatedBxautForOwnedShovelIds(
  tokenIds: readonly number[],
): number {
  let sum = 0;
  for (const raw of tokenIds) {
    const tier = shovelTokenIdToTier(raw);
    if (tier === null) continue;
    sum += estimatedXautPerMintFromFeeShare(SHOVEL_TIERS[tier].feeSharePercent);
  }
  return sum;
}

export const BSC_NETWORK_PARAMS = {
  chainId: BSC_CHAIN_ID_HEX,
  chainName: "BNB Smart Chain Mainnet",
  nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
  rpcUrls: ["https://bsc-dataseed.binance.org/"],
  blockExplorerUrls: ["https://bscscan.com"],
} as const;
