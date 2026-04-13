/**
 * Verify ShovelNFT on BscScan (needs ETHERSCAN_API_KEY or BSCSCAN_API_KEY in .env or contracts/.env).
 *
 * Constructor args MUST match the deployment transaction exactly:
 *   (usdt, treasury, initialOwner, baseURI)
 *
 * PowerShell example (replace address + base if yours differ):
 *   $env:SHOVEL_NFT_ADDRESS = "0x37047c26bc06E29A5bD09b006e44D402Cb87290c"
 *   $env:NFT_METADATA_BASE_URI = "http://127.0.0.1:5173/nft-metadata/"
 *   $env:SHOVEL_OWNER = "0x19bb5bD05776082808E8487F8d642ba2d726a7b9"
 *   npx hardhat run scripts/verify-shovel-nft.cjs --network bsc
 *
 * cmd.exe:
 *   set SHOVEL_NFT_ADDRESS=0x...
 *   set NFT_METADATA_BASE_URI=http://127.0.0.1:5173/nft-metadata/
 *   npx hardhat run scripts/verify-shovel-nft.cjs --network bsc
 */
const hre = require("hardhat");

const DEFAULT_USDT = "0x55d398326f99059fF775485246999027B3197955";
const DEFAULT_TREASURY = "0x5AD2F3984258038Cfcb350CF30414FFF211428D8";

async function main() {
  const rawAddr = (process.env.SHOVEL_NFT_ADDRESS || "").trim();
  if (!rawAddr) {
    console.error("Set SHOVEL_NFT_ADDRESS to the deployed ShovelNFT contract.");
    process.exit(1);
  }
  const address = hre.ethers.getAddress(rawAddr);

  const usdt = hre.ethers.getAddress(
    (process.env.BSC_USDT_ADDRESS || DEFAULT_USDT).trim(),
  );
  const treasury = hre.ethers.getAddress(
    (process.env.SHOVEL_TREASURY || process.env.TREASURY_ADDRESS || DEFAULT_TREASURY).trim(),
  );

  const signers = await hre.ethers.getSigners();
  const deployer = signers[0]?.address;
  const ownerRaw = (process.env.SHOVEL_OWNER || deployer || "").trim();
  if (!ownerRaw) {
    console.error("Could not determine initialOwner; set SHOVEL_OWNER=0x...");
    process.exit(1);
  }
  const initialOwner = hre.ethers.getAddress(ownerRaw);

  let baseURI = (process.env.NFT_METADATA_BASE_URI || "").trim();
  if (!baseURI) {
    const site = (process.env.NFT_SITE_BASE || "").trim().replace(/\/$/, "");
    baseURI = site ? `${site}/nft-metadata/` : "";
  }
  if (!baseURI) {
    console.error(
      "Set NFT_METADATA_BASE_URI (exact string passed to constructor, trailing / recommended) or NFT_SITE_BASE.",
    );
    process.exit(1);
  }
  if (!baseURI.endsWith("/")) {
    baseURI += "/";
  }

  const hasExplorerKey =
    process.env.ETHERSCAN_API_KEY?.trim() || process.env.BSCSCAN_API_KEY?.trim();
  if (!hasExplorerKey) {
    console.error(
      "Set ETHERSCAN_API_KEY (unified key from https://etherscan.io/myapikey) or BSCSCAN_API_KEY (legacy https://bscscan.com/myapikey) in .env or contracts/.env.",
    );
    process.exit(1);
  }

  console.log("Verifying ShovelNFT at", address);
  console.log("Constructor args:", { usdt, treasury, initialOwner, baseURI });

  await hre.run("verify:verify", {
    address,
    constructorArguments: [usdt, treasury, initialOwner, baseURI],
  });

  console.log("Verification submitted. Check the contract page on BscScan.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
