import {ethers, ContractFactory} from 'ethers'
import {createRequire} from 'module'
const require = createRequire(import.meta.url)
const MetaNodeArtifact = require('../../../artifacts/contracts/projects/MetaNodeStake/MetaNode.sol/MetaNode.json')

// 运行前提
// npx hardhat node 获取 Private Key

const provider = new ethers.JsonRpcProvider('https://sepolia.infura.io/v3/e13648d8a1f64b839a17533b1bd2d981')

// 私钥 (0xF1DC5Df8114fdd22B43a3925C8A0A768A776D885 的私钥, 危险不可暴露出去)
const PRIVATE_KEY = '925eddbd83b71706148ba1799ce40eca3ea9d581e848ca87f01a0f46ae6b98df'

const wallet = new ethers.Wallet(PRIVATE_KEY, provider)

const network = await provider.getNetwork()

const walletAddr = await wallet.getAddress()

console.table([
    {
        'getBlockNumber()': await provider.getBlockNumber(),
        'network.name': network.name,
        'network.chainId': network.chainId,
        'wallet.getAddress()': walletAddr,
        'provider.getBalance(addressAccount)': await provider.getBalance(walletAddr),
    }
])

const metaNodeFactory = new ContractFactory(MetaNodeArtifact.abi, MetaNodeArtifact.bytecode, wallet)

const metaNode = await metaNodeFactory.deploy('MetaNodeToken', 'MMT')

await metaNode.waitForDeployment()

const metaNodeAddr = await metaNode.getAddress()

console.log(metaNodeAddr)

console.log(`https://sepolia.etherscan.io/address/${metaNodeAddr}`)
