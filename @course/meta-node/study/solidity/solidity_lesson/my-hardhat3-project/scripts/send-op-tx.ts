// import { network } from "hardhat";
//
// const { ethers } = await network.connect({
//   network: "hardhatOp",
//   chainType: "op",
// });
//
// console.log("Sending transaction using the OP chain type");
//
// const [sender] = await ethers.getSigners();
//
// console.log("Sending 1 wei from", sender.address, "to itself");
//
// console.log("Sending L2 transaction");
// const tx = await sender.sendTransaction({
//   to: sender.address,
//   value: 1n,
// });
//
// await tx.wait();
//
// console.log("Transaction sent successfully");


import hre from 'hardhat'

async function main() {
  const networkManager = hre.network
  const {ethers} = await networkManager.connect()
  const {provider, formatEther, deployContract} = ethers;
  const [...accounts] = await ethers.getSigners()

  // console.log(accounts)
  const [a1, a2] = accounts
  console.log(`a1: ${a1.address}`)
  console.log(`a2: ${a2.address}`)

  const balance = await provider.getBalance(a1.address);
  console.log(`balance: ${balance}`)
  console.log(`formatEther: ${formatEther(balance)} ETH`)

  const counterContract = await deployContract("Counter");
  await counterContract.waitForDeployment()

  const counterAddress = await counterContract.getAddress()
  console.log(`counterAddress: ${counterAddress}`)

  const tx = await a1.sendTransaction({
    to: a2.address,
    value: 100n
  })
  const result = await tx.wait()
  console.log(result)

}

main().then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });


