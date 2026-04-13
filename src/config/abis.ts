/** Minimal ERC-20 for USDT */
export const ERC20_ABI = [
  "function balanceOf(address account) view returns (uint256)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function decimals() view returns (uint8)",
] as const;

export const SHOVEL_NFT_ABI = [
  "function mint(uint8 tier) external",
  "function mintPrice(uint8 tier) view returns (uint256)",
  "function maxSupply(uint8 tier) view returns (uint256)",
  "function totalMinted(uint8 tier) view returns (uint256)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function tokenURI(uint256 tokenId) view returns (string)",
] as const;

export const DIVIDEND_ABI = [
  "function claim() external",
  "function pendingReward(address user) view returns (uint256)",
] as const;
