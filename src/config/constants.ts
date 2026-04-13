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
  0: { priceUsdt: "1", supply: 666, key: "iron", feeSharePercent: "0.0695" },
  1: { priceUsdt: "11", supply: 111, key: "silver", feeSharePercent: "0.2777" },
  2: { priceUsdt: "111", supply: 22, key: "gold", feeSharePercent: "1.041" },
};

export function tierPriceWei(tier: ShovelTier) {
  const { priceUsdt } = SHOVEL_TIERS[tier];
  return parseUnits(priceUsdt, 18);
}

export const BSC_NETWORK_PARAMS = {
  chainId: BSC_CHAIN_ID_HEX,
  chainName: "BNB Smart Chain Mainnet",
  nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
  rpcUrls: ["https://bsc-dataseed.binance.org/"],
  blockExplorerUrls: ["https://bscscan.com"],
} as const;
