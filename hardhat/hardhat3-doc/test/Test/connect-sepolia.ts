import {network} from 'hardhat'
import {expect, use} from 'chai'
import {
  ContractFactory,
  ethers,
  JsonRpcProvider,
  Wallet,
  Contract,
  FetchRequest,
  ContractTransactionResponse, EventLog, Log
} from "ethers";
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const counterArtifact = require("../../artifacts/contracts/Counter.sol/Counter.json");

async function checkEvent(tx: ContractTransactionResponse, contract: Contract, eventName: string) {
  const receipt = await tx.wait();

  if (receipt) {
    // 手动遍历日志
    const event = receipt.logs.find((log: any) =>
        log?.fragment?.name === eventName
    );

    // 手动断言
    expect(event).is.not.undefined;
    return event;
  }
}

const provider = new ethers.JsonRpcProvider(`https://sepolia.infura.io/v3/e13648d8a1f64b839a17533b1bd2d981`)

describe('connect-sepolia', function (){
  const PRIVATE_KEY = '925eddbd83b71706148ba1799ce40eca3ea9d581e848ca87f01a0f46ae6b98df'
  const ADDRESS = '0x5d4d603Aa216122a3dbbA1413bC0C16515fBE0d2'

  let wallet: Wallet;

  // 连接和登录
  before(async function () {
    let blockNumber;
    try {
      blockNumber = await provider.getBlockNumber();
      wallet = new ethers.Wallet(PRIVATE_KEY, provider)
    } catch (error) {
    }

    expect(blockNumber, 'Failed to connect to local node. Run "npx hardhat node" first').to.be.a('number');
  })

/*  it('部署合约', async () => {
    // const owner = await wallet.getAddress()
    // const signer = await provider.getSigner() // Error: no such account 真实的连接测试网或者主网应该使用 wallet, 而不是 Signer
    const factory = new ContractFactory(counterArtifact.abi, counterArtifact.bytecode, wallet)
    const contract = await factory.deploy(0)
    const addr = await contract.getAddress()
    console.log(addr) // 0x5d4d603Aa216122a3dbbA1413bC0C16515fBE0d2
    expect(ethers.isAddress(addr)).is.true
    // 部署成功后不要重复部署了, 我暂时注释掉部署函数
  });*/

  it('获取合约', async function () {
    const contract = new Contract(ADDRESS, counterArtifact.abi, wallet)
    const address = await contract.getAddress()
    console.log(address)
    expect(ethers.isAddress(address)).is.true
    expect(address).is.equal(ADDRESS)
  })

  it('获取x的值', async function () {

    const contract = new Contract(ADDRESS, counterArtifact.abi, wallet)
    const x = await contract.x()
    expect(x).is.a('bigint');
  })

  it('x增量', async function () {
    // this.timeout(3000);
    // Error: Timeout of 3000ms exceeded. For async tests and hooks, ensure "done()" is called; if returning a Promise, ensure it resolves. (D:\Program Files Project\web3\@course\meta-node\solidity\mine\solidity_lesson\my-hardhat3-project\test\Test\connect-sepolia.ts)
    //     at listOnTimeout (node:internal/timers:588:17)
    //     at process.processTimers (node:internal/timers:523:7)
    // 这个报错是测试框架导致的, 可以临时加长超时时间
    // 也可以通过 .mocharc.json 增加超时时间

    const contract = new Contract(ADDRESS, counterArtifact.abi, wallet)
    const xBefore = await contract.x()
    const tx = await contract.inc()
    await tx.wait()
    const xAfter = await contract.x()
    expect(xAfter).is.equal(xBefore + 1n)
  })

  it('由于原生ethers的chai不支持emit, 封装自定义的测试看看', async () => {
    const contract = new Contract(ADDRESS, counterArtifact.abi, wallet)
    const tx = await contract.inc()
    await checkEvent(tx, contract, 'Increment')
    // await checkEvent(tx, contract, 'Increment2') // 验证方法 checkEvent 可行与否
  })

  it('验证连接', async () => {
    const network = await provider.getNetwork()
    console.table([
      {
        name: network.name,
        chainId: network.chainId,
        blockNumber: await provider.getBlockNumber(),
      }
    ])

    // v6
    const block = await provider.getBlock('latest', true)

    // v5
    // const blockWithTxs = await provider.getBlockWithTransactions('latest');
    // console.log('区块中的交易:', blockWithTxs.transactions);
    if (block) {
      console.table([
        {
          hash: block.hash,
          number: block.number,
          timestamp: new Date(block.timestamp * 1000),
        }
      ]);
    }
    console.log(block?.prefetchedTransactions)

  })
})