import {network} from 'hardhat'
import {expect} from 'chai'
import assert from 'assert'
import { createRequire } from 'module';
import {Contract} from "ethers";

const require = createRequire(import.meta.url);
const addresses = require("../../ignition/deployments/chain-31337/deployed_addresses.json");

const {ethers, networkHelpers} = await network.connect({
  network: 'localhost',
  chainType: 'l1',
})
const deployTestFixture = async () => {
  const test = await ethers.deployContract('Test')
  return {
    test
  }
}

describe('Test', () => {
  let testContract: Contract, accounts: any, account0;

  before(async () => {
    accounts = await ethers.getSigners();
    account0 = accounts[0]
    const testAddress = addresses['TestModule#Test'];
    testContract = await ethers.getContractAt("contracts/Test.sol:Test", testAddress, account0);
    // console.table([
    //   { Name: 'Test', Address: testAddress },
    //   { Name: 'account1', Address: account0.address },
    // ]);
  })

  it('function getFlag() public returns (bool)', async () => {
    const flag = await testContract.getFlag()
    // console.log(`flag: ${flag}`)
    expect(flag).to.be.a('boolean')
  });

  it('function getArr() public view returns (uint256[] memory)', async () => {
    const arr = await testContract.getArr()
    // console.log(arr)
    // expect(arr).to.be.a('array').to.be.not.length(0)
  });

  it('function pushToArr(uint256 val) public', async () => {
    const tx = await testContract.pushToArr(100)
    const receipt = await tx.wait()
    // console.log(receipt.status)
    expect(receipt.status).to.be.equal(1);
  });

  it('获取所有账户余额', async () => {
    const accountsBalanceList = []
    for (let i = 0; i < accounts.length; i++) {
      const account = accounts[i]
      const balance = await ethers.provider.getBalance(account.address)
      accountsBalanceList.push({
        address: account.address,
        // balance: ethers.formatEther(await ethers.provider.getBalance(account.address)),
        balance,
        balanceFormatted: ethers.formatEther(balance),
      })
    }
    // console.table(accountsBalanceList)
  });

  it('相等性断言', async () => {
    const integer = await testContract.integer()
    // console.log(integer) // 10n

    expect(integer).to.equal(10n)
    expect(integer).to.equal(10) // 10 == 10n 为 true 10; 10 === 10n 为 false

    expect(integer).to.eq(10n)
    expect(integer).to.eq(10)

    expect(integer).to.be.a('bigint')
    // expect(integer).to.be.a('number') // err

    assert.strictEqual(integer, 10n)
    // assert.strictEqual(integer, 10) // err

    expect(integer).to.not.equal(11n)
    expect(integer).to.not.equal(11)
  })

  it('数值比较', async () => {
    const integer = await testContract.integer()
    // console.log(integer) // 10n

    expect(integer).to.be.above(5)
    expect(integer).to.be.below(12)

    expect(integer).to.be.least(9)
    expect(integer).to.be.at.least(8)
    expect(integer).to.be.most(12)
    expect(integer).to.be.at.most(13)
  })

  it('布尔值断言', async () => {
    const boolean = await testContract.boolean()
    // console.log(boolean) // true

    expect(boolean).to.be.true
    expect(!boolean).to.be.false
  })

  it('地址类型断言', async () => {
    const addr = await testContract.addr()
    // console.log(addr) // true

    expect(ethers.isAddress(addr)).to.be.true
    expect(ethers.isAddress(addr + 'xxx')).to.be.false
  })

  it('数组断言', async () => {
    // const arr = await testContract.arr() // err: sol 自动生成的是 获取数组指定下标值的 getter,  类似这样的 function arr(uint256 index) public view returns (uint256)

    const arr = await testContract.getArr()
    // console.log(arr) // Result(0) []
    // console.log(typeof arr)
    // console.log(Array.isArray(arr))
    expect(arr).to.be.a('array')
    // console.log(arr.length)
    // console.log(arr[10]) // RangeError: out of result range
  })

  it('类型检查', async () => {
    expect(testContract).to.be.an.instanceof(Contract);
  })

  it('链式断言', async () => {
    const arr = await testContract.getArr()
    // expect(arr).a('array')
    //     .length.above(2)
    //     .property('push')
    // expect(arr).to.be.a('array')
    //     .and.to.be.length.above(2)
    //     .and.has.property('push')
  })

  it('字符串断言', async () => {
    const str = await testContract.str()
    expect(str)
        .is.a('string')
        .equal("Hello world")
        .include('world')
        .has.property('substr')
  })

/*  it('事件断言', async () => {

    // 这个永远不报错 await 需要写在外面的
    // expect(await testContract.inc())
    //     .to.emit(testContract, 'Increase').withArgs(5n)

    await expect(await testContract.inc())
        .to.emit(testContract, 'Increase').withArgs(2n)

    await expect(testContract.dec())
        .to.emit(testContract, 'Decrease').withArgs(1n)

    // const decFilter = testContract.filters.Decrease()
    // await expect(testContract.dec()) // TODO: key.indexOf is not a function 不知道为啥报错, 好像不支持这个形式, 有空再研究
    //     .to.emit(testContract, decFilter).withArgs(1n)
  })*/

  it('余额变化断言', async () => {
    // const value = ethers.parseEther('1')
    // const tx = await accounts[0].sendTransaction({
    //   to: accounts[1].address,
    //   // value: 1
    //   value
    // })
    // const receipt = await tx.wait()
    // expect(receipt.status).is.eq(1)

    const owner = accounts[0]
    const addr1 = accounts[1]
    owner.sendTransaction({ to: addr1.address, value: ethers.parseEther("1") })
    await expect(
        owner.sendTransaction({ to: addr1.address, value: ethers.parseEther("1") })
    ).to.changeEtherBalance(ethers, addr1.address, ethers.parseEther("1"));
  })

  it('回退断言', async () => {
    // const value = ethers.parseEther('1')
    // const tx = await accounts[0].sendTransaction({
    //   to: accounts[1].address,
    //   // value: 1
    //   value
    // })
    // const receipt = await tx.wait()
    // expect(receipt.status).is.eq(1)

    await expect(testContract.incBy(0))
        .to.be.revertedWith('incBy: increment should be positive')

    await expect(testContract.incBy(102))
        .to.be.revert(ethers)
  })

  describe('错误测试', () => {
    it('Panic错误测试', async () => {
      const {test} = await networkHelpers.loadFixture(deployTestFixture)
      // console.log(await test.getAddress())
      // await expect(test.arr(0))
      await expect(test.getAtIndex(0))
          .to.be.revertedWithPanic(0x32)
    })
  })

})