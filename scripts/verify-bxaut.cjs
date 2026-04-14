/**
 * Verify BXAUT ERC20 on BscScan (constructor: address treasury).
 *
 * Needs ETHERSCAN_API_KEY or BSCSCAN_API_KEY in .env or contracts/.env.
 *
 * PowerShell:
 *   $env:BXAUT_TOKEN_ADDRESS = "0x7CEC027078C6783C675277159290CDDc43Aa2e47"
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

  try {
    await hre.run("verify:verify", {
      address,
      constructorArguments: [treasury],
    });
    console.log("Verification submitted. Check the contract page on BscScan.");
  } catch (e) {
    const msg = String(e?.message || e);
    if (msg.includes("bytecode") || e?.name === "DeployedBytecodeMismatchError") {
      const encoded = new hre.ethers.AbiCoder().encode(["address"], [treasury]);
      console.error("\n--- API verify failed: on-chain bytecode ≠ this repo’s compile ---");
      console.error(
        "Deploy may have used different Solidity/OZ settings, or this source changed after deploy.",
      );
      console.error("\nManual verify on BscScan:");
      console.error("  1) npm run compile:contracts && npm run export:bscscan-bxaut");
      console.error("  2) BscScan → search contract address → Contract → Verify and Publish");
      console.error("     https://bscscan.com/address/" + address + "#code");
      console.error('  3) Compiler type: "Solidity (Standard JSON Input)"');
      console.error(
        "  4) Compiler: v0.8.20+commit.a1b79de6 (match export script output), Optimization: Yes, 200 runs",
      );
      console.error("  5) Upload: bscscan-BXAUT-standard-input.json (repo root or contracts/)");
      console.error("  6) Constructor args ABI-encoded (single address treasury):");
      console.error("     ", encoded);
      console.error("\nTreasury used above MUST match the deployment tx input.\n");
    }
    throw e;
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
