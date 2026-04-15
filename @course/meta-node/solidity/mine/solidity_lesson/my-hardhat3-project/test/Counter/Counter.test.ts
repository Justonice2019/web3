import {expect} from 'chai'
import hre from 'hardhat'

const {ethers, networkHelpers} = await hre.network.connect({
  network: 'localhost',
  chainType: 'l1'
})

const deployCounterFixture = async () => {
  // const counter = await ethers.deployContract("contracts/counter.sol:counter")
  const [owner, addr1, addr2] = await ethers.getSigners()
  const counter = await ethers.deployContract("Counter", [0n])

  return {
    counter,
    owner,
    addr1,
    addr2
  }
}
describe('Counter', () => {
  describe('部署', async () => {
    it('x 初始值为 0', async () => {
      const {counter} = await networkHelpers.loadFixture(deployCounterFixture)
      console.log(await counter.getAddress())
      expect(await counter.x()).is.equal(0n)
    })
    it('验证部署的合约地址', async () => {
      const {counter} = await networkHelpers.loadFixture(deployCounterFixture)
      const address = await counter.getAddress()

      expect(address).is.a('string')
      expect(address).has.length(42)
      expect(address).is.match(/^0x[a-fA-F0-9]{40}$/)
    })
  })
  describe('增量测试', async () => {
    it('基本增量', async () => {
      const {counter} = await networkHelpers.loadFixture(deployCounterFixture)
      console.log(await counter.getAddress())

      await counter.inc()
      expect(await counter.x()).is.equal(1)
      await counter.inc()
      expect(await counter.x()).is.equal(2)
    })
    it('指定增量', async () => {
      const {counter} = await networkHelpers.loadFixture(deployCounterFixture)
      console.log(await counter.getAddress())

      console.log(await counter.x())
    })
    it('事件触发', async () => {
      const {counter} = await networkHelpers.loadFixture(deployCounterFixture)
      console.log(await counter.getAddress())

      const r = await counter.inc()
      await expect(r)
          .to.emit(counter, "Increment")
          .withArgs(2n)

      // 错误写法:
      // expect(await counter.inc())
      //     .to.emit(counter, "Increment")
      //     .withArgs(4n)
      // expect(counter.inc())
      //     .to.emit(counter, "Increment")
      //     .withArgs(4n)


      await expect(counter.incBy(5n))
          .to.emit(counter, "Increment")
          .withArgs(5n)
    })

    it('增量为0应该回滚', async () => {
      const {counter} = await networkHelpers.loadFixture(deployCounterFixture)
      console.log(await counter.getAddress())

      await expect(counter.incBy(0))
          .to.revertedWith('incBy: increment should be positive')
    })
  })

  describe('状态隔离测试', () => {
    it('状态隔离测试', async () => {
      const {counter} = await networkHelpers.loadFixture(deployCounterFixture)
      console.log(await counter.getAddress())
      expect(await counter.x()).is.equal(0n)
    })
  })

  describe('构造函数测试', () => {
    it('状态隔离测试', async () => {
      const counter = await ethers.deployContract("Counter", [5n])
      expect(await counter.x()).is.equal(5n)
    })
  })

  describe('历史记录', () => {
    it('查询历史事件', async () => {
      const {counter} = await networkHelpers.loadFixture(deployCounterFixture)
      const deployBlock = await ethers.provider.getBlockNumber()
      console.log(deployBlock)

      await counter.inc();
      await counter.incBy(5);

      const filter = counter.filters.Increment()
      // const events = await counter.queryFilter(filter, 0)
      const events = await counter.queryFilter(filter, 0)
      console.log(events)

      expect(events).to.have.length(2);
      expect(events[0].args[0]).to.equal(1n);
      expect(events[1].args[0]).to.equal(5n);
    });
  })

  describe('错误测试', () => {
    it('自定义错误', async () => {
      const {counter} = await networkHelpers.loadFixture(deployCounterFixture)
      await expect(counter.incBy(101))
          .to.revertedWithCustomError(counter, 'TooLarge')

    });
  })
})

