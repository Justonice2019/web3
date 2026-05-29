import {network} from 'hardhat'
import {expect} from 'chai'
import {ContractFactory, ethers, JsonRpcProvider} from "ethers";
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const counterArtifact = require("../../artifacts/contracts/Counter.sol/Counter.json");

// 方式一: 使用 hardhat 自带的去连接
const {ethers: ethersHre, networkHelpers} = await network.connect({
  network: 'localhost',
  chainType: 'l1',
})

// 方式二: 使用 Provider 自行连接
const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545')

const deployEthersFixture = async () => {
  const signer = await provider.getSigner()
  const factory = new ContractFactory(counterArtifact.abi, counterArtifact.bytecode, signer)

  // 部署合约
  const ethersContract = await factory.deploy(0n)
  return {
    ethersContract
  }
}


describe('ethers-vs-ethers-of-hardhat', () => {

  before(async () => {
    let blockNumber;
    try {
      blockNumber = await provider.getBlockNumber();
    } catch (error) {
      // 连接失败，blockNumber 保持 undefined
    }

    expect(blockNumber, 'Failed to connect to local node. Run "npx hardhat node" first').to.be.a('number');
  })

  it('应该正确获取账户地址(自行连接)', async () => {
    const signer = await provider.getSigner()
    // console.log(provider)
    expect(signer.address).is.match(/^0x[0-9a-fA-F]{40}$/)
    console.log(await provider.getBlockNumber())
  });

  it('应该正确获取账户地址(hardhat连接)', async () => {
    const [signer] = await ethersHre.getSigners()
    // console.log(ethersHre)
    expect(signer.address).is.match(/^0x[0-9a-fA-F]{40}$/)
  });

  it('应该正确部署Test合约', async () => {
    const signer = await provider.getSigner()
    const factory = new ContractFactory(counterArtifact.abi, counterArtifact.bytecode, signer)
    const contract = await factory.deploy(0n)
    expect(ethers.isAddress(await contract.getAddress())).is.true
  })

  it('应该读取部署的Test合约', async () => {
    const signer = await provider.getSigner()
    const factory = new ContractFactory(counterArtifact.abi, counterArtifact.bytecode, signer)

    // 部署合约
    const contractOutput = await factory.deploy(0n)
    const address = await contractOutput.getAddress()

    // 获取合约
    const contract = new ethers.Contract(address, counterArtifact.abi, signer)

    // 比较
    expect(address === (await contract.getAddress())).is.true

  })


  it('应该正确部署Test合约(fixture)-1', async () => {
    const {ethersContract} = await networkHelpers.loadFixture(deployEthersFixture)
    console.log(await ethersContract.getAddress())
  })

  it('应该正确部署Test合约(fixture)-2', async () => {
    const {ethersContract} = await networkHelpers.loadFixture(deployEthersFixture)
    console.log(await ethersContract.getAddress())
  })



})