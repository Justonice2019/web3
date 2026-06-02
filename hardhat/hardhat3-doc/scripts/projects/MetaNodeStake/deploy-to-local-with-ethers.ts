import {ethers, ContractFactory} from 'ethers'
import {createRequire} from 'module'
const require = createRequire(import.meta.url)
const MetaNodeArtifact = require('../../../artifacts/contracts/projects/MetaNodeStake/MetaNode.sol/MetaNode.json')

// 运行前提
// npx hardhat node 获取 Private Key

const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545/')

const PRIVATE_KEY = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'

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
