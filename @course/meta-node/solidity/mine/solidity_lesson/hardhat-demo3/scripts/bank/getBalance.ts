import { network } from "hardhat";

const connection = await network.connect({
  network: "sepolia",
  chainType: "l1",
});
// BankModule#Bank - 0xE76ED07F44a34dAB03730B65584156b19ed279e5
const [signer] = await connection.ethers.getSigners();
const bankContract = await connection.ethers.getContractAt("Bank", '0x01fC441BeFb115906e3D27d39C2155fF106e80B2', signer);

const data = await bankContract.getBalance()
console.log(data)