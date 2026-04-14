import { BrowserProvider, Contract } from "ethers";
import { SHOVEL_NFT_ABI } from "../config/abis";
import { mediaUrlFallbackChain } from "../config/publicPath";

export type OwnedNftDisplay = {
  tokenId: number;
  name: string;
  /** Resolved HTTP(S) image URL from metadata, if any. */
  image: string;
};

function candidateTokenIds(t0: bigint, t1: bigint, t2: bigint): number[] {
  const ids: number[] = [];
  const n0 = Number(t0);
  const n1 = Number(t1);
  const n2 = Number(t2);
  for (let i = 1; i <= n0; i++) ids.push(i);
  for (let i = 0; i < n1; i++) ids.push(667 + i);
  for (let j = 0; j < n2; j++) ids.push(778 + j);
  return ids;
}

/**
 * Lists owned shovel token IDs by scanning minted ID ranges (no metadata I/O).
 */
export async function loadOwnedShovelTokenIds(
  provider: BrowserProvider,
  nftAddress: string,
  ownerAddress: string,
): Promise<number[]> {
  const c = new Contract(nftAddress, SHOVEL_NFT_ABI, provider);
  const t0 = (await c.totalMinted(0)) as bigint;
  const t1 = (await c.totalMinted(1)) as bigint;
  const t2 = (await c.totalMinted(2)) as bigint;
  const candidates = candidateTokenIds(t0, t1, t2);
  const lc = ownerAddress.toLowerCase();
  const chunk = 48;
  const mine: number[] = [];
  for (let i = 0; i < candidates.length; i += chunk) {
    const slice = candidates.slice(i, i + chunk);
    const owners = await Promise.all(
      slice.map(async (id) => {
        try {
          const o = (await c.ownerOf(id)) as string;
          return o.toLowerCase() === lc ? id : null;
        } catch {
          return null;
        }
      }),
    );
    mine.push(...owners.filter((x): x is number => x !== null));
  }
  mine.sort((a, b) => a - b);
  return mine;
}

/**
 * Lists Shovel NFTs owned by `ownerAddress` by scanning minted ID ranges,
 * then loads metadata from each `tokenURI` (same path wallets use).
 */
export async function loadOwnedShovelNfts(
  provider: BrowserProvider,
  nftAddress: string,
  ownerAddress: string,
): Promise<OwnedNftDisplay[]> {
  const mine = await loadOwnedShovelTokenIds(provider, nftAddress, ownerAddress);
  const c = new Contract(nftAddress, SHOVEL_NFT_ABI, provider);
  const out: OwnedNftDisplay[] = [];
  for (const tokenId of mine) {
    let name = `Bxaut Shovel #${tokenId}`;
    let image = "";
    try {
      const uri = String(await c.tokenURI(tokenId)).trim();
      if (uri) {
        let json: { name?: string; image?: string } | null = null;
        for (const u of mediaUrlFallbackChain(uri)) {
          try {
            const res = await fetch(u);
            if (res.ok) {
              json = (await res.json()) as { name?: string; image?: string };
              break;
            }
          } catch {
            /* try next IPFS gateway / mirror */
          }
        }
        if (json) {
          if (typeof json.name === "string") name = json.name;
          if (typeof json.image === "string") image = json.image.trim();
        }
      }
    } catch {
      /* tokenURI or fetch failed */
    }
    out.push({ tokenId, name, image });
  }
  return out;
}
