// import { expect } from "chai";
// import { network } from "hardhat";
//
// const { ethers } = await network.connect();
//
// describe("Counter", function () {
//   it("Should emit the Increment event when calling the inc() function", async function () {
//     const counter = await ethers.deployContract("Counter");
//
//     await expect(counter.inc()).to.emit(counter, "Increment").withArgs(1n);
//   });
//
//   it("The sum of the Increment events should match the current value", async function () {
//     const counter = await ethers.deployContract("Counter");
//     const deploymentBlockNumber = await ethers.provider.getBlockNumber();
//
//     // run a series of increments
//     for (let i = 1; i <= 10; i++) {
//       await counter.incBy(i);
//     }
//
//     const events = await counter.queryFilter(
//       counter.filters.Increment(),
//       deploymentBlockNumber,
//       "latest",
//     );
//
//     // check that the aggregated events match the current value
//     let total = 0n;
//     for (const event of events) {
//       total += event.args.by;
//     }
//
//     expect(await counter.x()).to.equal(total);
//   });
// });


import {network} from 'hardhat'
import {expect} from "chai";

const {ethers} = await network.connect()

const {deployContract} = ethers

describe("Counter",  () => {
  it('应该触发 Increment 事件', async () => {
      const counterContract = await deployContract("Counter")
      // console.log(counterContract)
      // console.log(counterContract.inc())
      await expect(counterContract.inc()).to.emit(counterContract, "Increment").withArgs(2n);
  });
  it('应该正确的增加', async () => {
    const counter = await ethers.deployContract("Counter");
    await counter.incBy(6);
    expect(await counter.getX()).to.equal(6)
  })
})
