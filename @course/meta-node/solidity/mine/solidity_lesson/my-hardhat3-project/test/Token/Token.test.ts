import { expect } from "chai";
import hre from 'hardhat'

const {ethers, networkHelpers} = await hre.network.connect({
  network: 'localhost',
  chainType: 'l1'
})

const deployTokenFixture = async () => {
  const [owner, addr1, addr2] = await ethers.getSigners()
  const token = await ethers.deployContract('Token', [1000n])

  return {
    token,
    owner,
    addr1,
    addr2,
  }
}

describe('Token', () => {
  describe('事件测试', () => {
    it('多事件触发', async () => {
      const {token, owner, addr1} = await networkHelpers.loadFixture(deployTokenFixture)

      // const p = token.transfer(addr1, 100n)
      // await expect(p)
      //     .to.emit(token, 'Transfer')
      //     .withArgs(owner, addr1, 100n)

      const oldBalance = await token.balanceOf(owner)

      const tx = await token.transfer(addr1, 100n)

      const newBalance = await token.balanceOf(owner)

      await expect(tx)
          .to.emit(token, 'Transfer')
          .withArgs(owner, addr1, 100n)
      console.log(owner, oldBalance, newBalance)
      await expect(tx)
          .to.emit(token, 'ChangedBalance')
          .withArgs(owner, oldBalance, newBalance)

      // console.log(await token.balanceOf(owner))
      // console.log(await token.balanceOf(addr1))
    })
  })
})