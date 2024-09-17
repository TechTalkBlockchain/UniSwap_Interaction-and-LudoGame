import "@nomicfoundation/hardhat-toolbox";
require("dotenv").config({ path: ".env" });

//const ALCHEMY_MAINNET_API_KEY_URL = process.env.ALCHEMY_MAINNET_API_KEY_URL;
const ACCOUNT_PRIVATE_KEY = process.env.ACCOUNT_PRIVATE_KEY;

module.exports = {
  solidity: "0.8.24",
  networks: {
    sepolia: {
      url: process.env.ALCHEMY_TEST_URL,
      accounts: [process.env.TESTNET_PRIVATE_KEY]
    },
    hardhat: {
      forking: {
        url: ALCHEMY_MAINNET_API_KEY_URL,
      }
    }
  },
  lockGasLimit: 200000000000,
  gasPrice: 10000000000,
};