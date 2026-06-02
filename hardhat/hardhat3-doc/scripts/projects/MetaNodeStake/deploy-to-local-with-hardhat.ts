import {network} from 'hardhat'

const {ethers} = await network.connect({
    chainType: 'l1',
    network: 'localhost'
})

const MetaNode = await ethers.getContractFactory('MetaNode')
const metaNode = await MetaNode.deploy('MetaNodeToken', 'MNT')
await metaNode.waitForDeployment()
const metaNodeAddr = await metaNode.getAddress()

if (ethers.isAddress(metaNodeAddr)) {
    console.log('MetaNode部署成功:', metaNodeAddr);
}

const startBlock = 1; // 替换为实际起始区块
const endBlock = 999999999999; // 替换为实际结束区块
const metaNodePerBlock = ethers.parseUnits("1", 18);
const MetaNodeStake = await ethers.getContractFactory('MetaNodeStake')
const metaNodeStake = await MetaNodeStake.deploy()
await metaNodeStake.waitForDeployment()
const metaNodeStakeAddr = await metaNodeStake.getAddress()
console.log('MetaNodeStake 部署成功:', metaNodeStakeAddr);

// const ERC1967ProxyInterface = new ethers.Interface([
//     'function initialize(address, uint256, uint256, uint256)'
//     // 'function initialize(IERC20, uint256, uint256, uint256)' // 不能使用 IERC20
// ])
// const initData = ERC1967ProxyInterface.encodeFunctionData('initialize', [metaNodeAddr, startBlock, endBlock, metaNodePerBlock])
const initData = MetaNodeStake.interface.encodeFunctionData('initialize', [
    metaNodeAddr,
    startBlock,
    endBlock,
    metaNodePerBlock
]);

const ERC1967Proxy = await ethers.getContractFactory("@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol:ERC1967Proxy");

const proxy = await ERC1967Proxy.deploy(metaNodeStakeAddr, initData)
await proxy.waitForDeployment()
const proxyAddr = await proxy.getAddress()
if (ethers.isAddress(proxyAddr)) {
    console.log('MetaNodeStake 部署代理成功:', proxyAddr);
}
