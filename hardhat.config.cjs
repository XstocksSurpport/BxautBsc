const path = require("path");

require("dotenv").config({ path: path.join(__dirname, ".env") });
require("dotenv").config({ path: path.join(__dirname, "contracts", ".env") });

require("@nomicfoundation/hardhat-toolbox");

/** Prefer ETHERSCAN_API_KEY from https://etherscan.io/myapikey (Etherscan API V2 — one key, multichain via chainid). */
const etherscanUnifiedKey = (process.env.ETHERSCAN_API_KEY || "").trim();
const bscscanLegacyKey = (process.env.BSCSCAN_API_KEY || "").trim();

/** @type import("hardhat/config").HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: { enabled: true, runs: 200 },
    },
  },
  paths: {
    sources: "./contracts",
    cache: "./contracts/cache",
    artifacts: "./contracts/artifacts",
  },
  networks: {
    hardhat: {},
    bscTestnet: {
      url: process.env.BSC_TESTNET_RPC || "https://data-seed-prebsc-1-s1.binance.org:8545/",
      chainId: 97,
      accounts: process.env.DEPLOYER_PRIVATE_KEY
        ? [process.env.DEPLOYER_PRIVATE_KEY]
        : [],
    },
    bsc: {
      url: process.env.BSC_RPC_URL || "https://bsc-dataseed.binance.org/",
      chainId: 56,
      accounts: process.env.DEPLOYER_PRIVATE_KEY
        ? [process.env.DEPLOYER_PRIVATE_KEY]
        : [],
    },
  },
  etherscan: {
    apiKey: etherscanUnifiedKey
      ? etherscanUnifiedKey
      : {
          bsc: bscscanLegacyKey,
          bscTestnet: bscscanLegacyKey,
        },
  },
};
