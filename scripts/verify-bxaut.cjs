/**
 * Verify BXAUT ERC20 on BscScan (constructor: address treasury).
 *
 * Needs ETHERSCAN_API_KEY or BSCSCAN_API_KEY in .env or contracts/.env.
 *
 * PowerShell:
 *   $env:BXAUT_TOKEN_ADDRESS = "0x9674AB0C99eAfE7d20158d360cE13E4D671Aa09C"
 *   $env:BXAUT_VERIFY_TREASURY = "0x5AD2F3984258038Cfcb350CF30414FFF211428D8"
 *   npx hardhat run scripts/verify-bxaut.cjs --network bsc
 *
 * Treasury MUST be the exact address passed to the constructor at deploy
 * (default deploy uses BXAUT_TREASURY || TREASURY_ADDRESS || 0x5AD2…428D8).
 */
const hre = require("hardhat");

const DEFAULT_TREASURY = "0x5AD2F3984258038Cfcb350CF30414FFF211428D8";

async function main() {
  const rawAddr = (
    process.env.BXAUT_TOKEN_ADDRESS ||
    process.env.VITE_BXAUT_TOKEN_ADDRESS ||
    ""
  ).trim();
  if (!rawAddr) {
    console.error(
      "Set BXAUT_TOKEN_ADDRESS (or VITE_BXAUT_TOKEN_ADDRESS) to the deployed BXAUT contract.",
    );
    process.exit(1);
  }
  const address = hre.ethers.getAddress(rawAddr);

  const treasuryRaw = (
    process.env.BXAUT_VERIFY_TREASURY ||
    process.env.BXAUT_TREASURY ||
    process.env.TREASURY_ADDRESS ||
    DEFAULT_TREASURY
  ).trim();
  const treasury = hre.ethers.getAddress(treasuryRaw);

  const hasExplorerKey =
    process.env.ETHERSCAN_API_KEY?.trim() || process.env.BSCSCAN_API_KEY?.trim();
  if (!hasExplorerKey) {
    console.error(
      "Set ETHERSCAN_API_KEY (https://etherscan.io/myapikey) or BSCSCAN_API_KEY (https://bscscan.com/myapikey).",
    );
    process.exit(1);
  }

  console.log("Verifying BXAUT at", address);
  console.log("Constructor args: [treasury] =", treasury);

  await hre.run("verify:verify", {
    address,
    constructorArguments: [treasury],
  });

  console.log("Verification submitted. Check the contract page on BscScan.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
