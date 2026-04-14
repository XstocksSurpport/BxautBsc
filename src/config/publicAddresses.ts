import { getAddress, isAddress } from "ethers";
import { TREASURY_ADDRESS } from "./constants";

/** Defaults when env is unset (BSC mainnet product addresses). */
export const PUBLIC_BSC_BXAUT =
  "0x7CEC027078C6783C675277159290CDDc43Aa2e47" as const;
export const PUBLIC_BSC_XAUT =
  "0x21cAef8A43163Eea865baeE23b9C2E327696A3bf" as const;
export const PUBLIC_BSC_SHOVEL_NFT =
  "0x37047c26bc06E29A5bD09b006e44D402Cb87290c" as const;

/** Placeholder distributor on BSC (pendingReward 0; claim no-op). Override via env when upgraded. */
export const PUBLIC_BSC_DIVIDEND_DISTRIBUTOR =
  "0x32e94d1945F0521934c813B11133689149f118C4" as const;

function checksumOrSelf(addr: string): string {
  if (!isAddress(addr)) return addr;
  try {
    return getAddress(addr);
  } catch {
    return addr;
  }
}

export function displayBxautAddress(): string {
  const raw = import.meta.env.VITE_BXAUT_TOKEN_ADDRESS?.trim() ?? "";
  return raw && isAddress(raw) ? checksumOrSelf(raw) : checksumOrSelf(PUBLIC_BSC_BXAUT);
}

export function displayXautAddress(): string {
  const raw = import.meta.env.VITE_XAUT_TOKEN_ADDRESS?.trim() ?? "";
  return raw && isAddress(raw) ? checksumOrSelf(raw) : checksumOrSelf(PUBLIC_BSC_XAUT);
}

export function displayShovelNftAddress(): string {
  const raw = import.meta.env.VITE_SHOVEL_NFT_ADDRESS?.trim() ?? "";
  return raw && isAddress(raw)
    ? checksumOrSelf(raw)
    : checksumOrSelf(PUBLIC_BSC_SHOVEL_NFT);
}

export function displayTreasuryAddress(): string {
  return checksumOrSelf(TREASURY_ADDRESS);
}

export function displayDividendDistributorAddress(): string {
  const raw = import.meta.env.VITE_DIVIDEND_DISTRIBUTOR_ADDRESS?.trim() ?? "";
  return raw && isAddress(raw)
    ? checksumOrSelf(raw)
    : checksumOrSelf(PUBLIC_BSC_DIVIDEND_DISTRIBUTOR);
}
