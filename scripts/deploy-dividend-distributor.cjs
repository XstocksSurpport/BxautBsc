/**
 * Deploy minimal DividendDistributor (pendingReward defaults 0; claim no-op transfer).
 *
 *   npx hardhat run scripts/deploy-dividend-distributor.cjs --network bsc
 */
const hre = require("hardhat");

async function main() {
  const signers = await hre.ethers.getSigners();
  if (!signers.length) {
    console.error("No deployer wallet. Set DEPLOYER_PRIVATE_KEY in contracts/.env.");
    process.exit(1);
  }
  const deployer = signers[0];
  console.log("Deployer:", deployer.address);

  const F = await hre.ethers.getContractFactory("DividendDistributor");
  const c = await F.deploy();
  await c.waitForDeployment();
  const addr = await c.getAddress();
  console.log("DividendDistributor deployed to:", addr);
  console.log("Set VITE_DIVIDEND_DISTRIBUTOR_ADDRESS=" + addr + " in project root .env");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
