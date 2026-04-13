/**
 * Deploy ShovelNFT — USDT mints, all proceeds to treasury.
 *
 *   npx hardhat run scripts/deploy-shovel-nft.cjs --network bscTestnet
 *
 * Env:
 *   NFT_METADATA_BASE_URI — base for tokenURI (must end with / recommended), e.g. https://site.com/nft-metadata/
 *   OR NFT_SITE_BASE — origin only; base becomes `${NFT_SITE_BASE}/nft-metadata/`
 *
 * Optional: SHOVEL_TREASURY, BSC_USDT_ADDRESS (mainnet default BSC USDT)
 */
const hre = require("hardhat");

const DEFAULT_TREASURY = "0x5AD2F3984258038Cfcb350CF30414FFF211428D8";
const BSC_MAINNET_USDT = "0x55d398326f99059fF775485246999027B3197955";

async function main() {
  const signers = await hre.ethers.getSigners();
  if (!signers.length) {
    console.error(
      "No deployer wallet. Set DEPLOYER_PRIVATE_KEY in .env (see contracts/.env.example).",
    );
    process.exit(1);
  }
  const deployer = signers[0];

  const treasury = hre.ethers.getAddress(
    process.env.SHOVEL_TREASURY ||
      process.env.TREASURY_ADDRESS ||
      DEFAULT_TREASURY,
  );

  const net = hre.network.name;
  const usdt =
    process.env.BSC_USDT_ADDRESS?.trim() ||
    (net === "bscTestnet"
      ? process.env.BSC_TESTNET_USDT_ADDRESS?.trim() || ""
      : BSC_MAINNET_USDT);

  if (!usdt) {
    console.error(
      "Set BSC_TESTNET_USDT_ADDRESS for bscTestnet or use mainnet bsc (default USDT).",
    );
    process.exit(1);
  }

  const site = (process.env.NFT_SITE_BASE || "").trim().replace(/\/$/, "");
  let metaBase = (process.env.NFT_METADATA_BASE_URI || "").trim();
  if (!metaBase && site) {
    metaBase = `${site}/nft-metadata/`;
  }
  if (!metaBase) {
    console.error(
      "Set NFT_METADATA_BASE_URI (full base with trailing slash) or NFT_SITE_BASE (origin).",
    );
    console.error("Run: NFT_SITE_BASE=https://your-domain.com npm run gen:nft-metadata");
    process.exit(1);
  }
  if (!metaBase.endsWith("/")) {
    metaBase += "/";
  }

  console.log("Deployer:", deployer.address);
  console.log("Treasury (100% of mint USDT):", treasury);
  console.log("USDT:", usdt);
  console.log("tokenURI base:", metaBase);

  const ShovelNFT = await hre.ethers.getContractFactory("ShovelNFT");
  const nft = await ShovelNFT.deploy(
    usdt,
    treasury,
    deployer.address,
    metaBase,
  );
  await nft.waitForDeployment();
  const addr = await nft.getAddress();
  console.log("ShovelNFT deployed to:", addr);
  console.log(
    "Set VITE_SHOVEL_NFT_ADDRESS in root .env and rebuild the frontend.",
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
