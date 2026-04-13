/**
 * Deploy BXAUT — full 21M minted to one treasury (default: product treasury).
 *
 *   npx hardhat run scripts/deploy-bxaut.cjs --network bscTestnet
 *
 * Override recipient: BXAUT_TREASURY=0x... (optional)
 */
const hre = require("hardhat");

/** Default treasury — same as mint site treasury; all BXAUT minted here for manual split later. */
const DEFAULT_TREASURY = "0x5AD2F3984258038Cfcb350CF30414FFF211428D8";

async function main() {
  const signers = await hre.ethers.getSigners();
  if (!signers.length) {
    console.error(
      "No deployer wallet: Hardhat has no accounts for this network.",
    );
    console.error(
      "PowerShell (current session):  $env:DEPLOYER_PRIVATE_KEY = '0x...'",
    );
    console.error("cmd.exe:  set DEPLOYER_PRIVATE_KEY=0x...");
    console.error(
      "Or put DEPLOYER_PRIVATE_KEY=... in project root .env (see contracts/.env.example).",
    );
    process.exit(1);
  }
  const deployer = signers[0];

  const raw =
    process.env.BXAUT_TREASURY ||
    process.env.TREASURY_ADDRESS ||
    DEFAULT_TREASURY;
  const treasury = hre.ethers.getAddress(raw);

  console.log("Deployer:", deployer.address);
  console.log("Treasury (full supply mint):", treasury);

  const BXAUT = await hre.ethers.getContractFactory("BXAUT");
  const bxaut = await BXAUT.deploy(treasury);
  await bxaut.waitForDeployment();
  const addr = await bxaut.getAddress();
  console.log("BXAUT deployed to:", addr);
  console.log("MAX_SUPPLY wei:", (await bxaut.MAX_SUPPLY()).toString());
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
