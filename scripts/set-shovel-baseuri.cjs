/**
 * Owner-only: ShovelNFT.setBaseURI after you host `public/nft-metadata/` and `public/nft/`.
 *
 *   SHOVEL_NFT_ADDRESS=0x... NFT_SITE_BASE=https://your-domain.com npx hardhat run scripts/set-shovel-baseuri.cjs --network bsc
 *
 * Or set NFT_METADATA_BASE_URI (with trailing slash).
 */
const hre = require("hardhat");

async function main() {
  const signers = await hre.ethers.getSigners();
  if (!signers.length) {
    console.error("No deployer wallet in Hardhat config.");
    process.exit(1);
  }
  const owner = signers[0];

  const addr = (process.env.SHOVEL_NFT_ADDRESS || "").trim();
  if (!addr) {
    console.error("Set SHOVEL_NFT_ADDRESS to the ShovelNFT proxy/implementation address.");
    process.exit(1);
  }

  const site = (process.env.NFT_SITE_BASE || "").trim().replace(/\/$/, "");
  let base = (process.env.NFT_METADATA_BASE_URI || "").trim();
  if (!base && site) {
    base = `${site}/nft-metadata/`;
  }
  if (!base) {
    console.error("Set NFT_METADATA_BASE_URI or NFT_SITE_BASE.");
    process.exit(1);
  }
  if (!base.endsWith("/")) {
    base += "/";
  }

  const c = await hre.ethers.getContractAt("ShovelNFT", addr, owner);
  const onchainOwner = await c.owner();
  if (onchainOwner.toLowerCase() !== owner.address.toLowerCase()) {
    console.error(
      "Connected signer is not contract owner. Owner:",
      onchainOwner,
      "Signer:",
      owner.address,
    );
    process.exit(1);
  }

  console.log("Setting base URI to:", base);
  const tx = await c.setBaseURI(base);
  await tx.wait();
  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
