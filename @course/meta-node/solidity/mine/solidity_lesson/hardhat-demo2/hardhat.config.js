require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
require("@openzeppelin/hardhat-upgrades");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: '0.8.28',
  networks: {
    sepolia: {
      url: "https://sepolia.infura.io/v3/e13648d8a1f64b839a17533b1bd2d981",
      accounts: [process.env.PRIVATE_KEY]
    }
  }
}
