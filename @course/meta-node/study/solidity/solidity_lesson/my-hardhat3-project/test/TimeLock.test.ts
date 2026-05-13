import {expect} from 'chai'
import hre from 'hardhat'

const {ethers, networkHelpers} = await hre.network.connect({
  network: 'localhost',
  chainType: 'l1'
})

const deployTimeLockFixture = async () => {
  const timeLock = await ethers.deployContract("TimeLock")
  const [owner, addr1, addr2] = await ethers.getSigners()
  return {
    timeLock,
    owner
  }
}

describe('TimeLock', () => {
  it('存款', async () => {
    const {timeLock, owner} = await networkHelpers.loadFixture(deployTimeLockFixture)
    await expect(timeLock.deposit({
      value: ethers.parseEther('0.1')
    }))
        .to.be.changeEtherBalance(ethers, await timeLock.getAddress(), ethers.parseEther('0.1'))

    const balance = await timeLock.getBalance(await owner.getAddress())
    expect(balance).is.equal(ethers.parseEther('0.1'))
  })
  it('查询存款', async () => {
    const {timeLock, owner} = await networkHelpers.loadFixture(deployTimeLockFixture)
    await timeLock.deposit({
      value: ethers.parseEther('0.1')
    })
    const balance = await timeLock.getBalance(await owner.getAddress())
    expect(balance).is.equal(ethers.parseEther('0.1'))
  })
  it('应该不能取款', async () => {
    const {timeLock} = await networkHelpers.loadFixture(deployTimeLockFixture)
    // console.log(await ethers.provider.getBlockNumber())
    await timeLock.deposit({
      value: ethers.parseEther('0.1')
    })
    await expect(timeLock.withdraw(10n))
        .to.be.revertedWith("you can withdraw after one hour")
  })
  it('应该能取款(时间旅行)', async () => {
    const {timeLock, owner} = await networkHelpers.loadFixture(deployTimeLockFixture)
    // console.log(await ethers.provider.getBlockNumber())
    await timeLock.deposit({
      value: ethers.parseEther('0.1')
    })
    await networkHelpers.time.increase(60 * 60)
    await expect(timeLock.withdraw(ethers.parseEther('0.1')))
        .to.not.be.revert(ethers);
  })
})