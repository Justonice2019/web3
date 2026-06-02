import {network, artifacts,} from 'hardhat'
import {expect} from 'chai'
import {type Contract, formatEther, parseEther, AbstractSigner, ContractTransactionResponse} from "ethers";
import dayjs from 'dayjs'
import {type MetaNodeStake} from "../../../types/ethers-contracts/index.ts";

const {ethers, networkHelpers} = await network.connect({
    network: 'localhost',
    chainType: 'l1'
})

// 前置条件:
// npx hardhat compile (新合约需要先编译一下)
// npx hardhat node (启动本地网络)
// npm run MetaNodeStake:deploy-to-local-with-hardhat (先部署 MetaNode MetaNodeStake 到 本地环境)
// 使用 npm run MetaNodeStake:test 运行这个文件


// MetaNode部署成功: 0xB82008565FdC7e44609fA118A4a681E92581e680
// MetaNodeStake 部署成功: 0x2a810409872AfC346F9B5b26571Fd6eC42EA4849
// MetaNodeStake代理 部署成功: 0xb9bEECD1A582768711dE1EE7B0A1d582D9d72a6C
const metaNodeAddr = '0xB82008565FdC7e44609fA118A4a681E92581e680'
const proxyAddr = '0xb9bEECD1A582768711dE1EE7B0A1d582D9d72a6C'

const metaNodeStakeFixture = async () => {
    const MetaNode = await ethers.getContractFactory('MetaNode')
    const metaNode = await MetaNode.deploy('MetaNodeToken', 'MNT')
    await metaNode.waitForDeployment()
    const metaNodeAddr = await metaNode.getAddress()
    const startBlock = 1; // 替换为实际起始区块
    const endBlock = 999999999999; // 替换为实际结束区块
    const metaNodePerBlock = ethers.parseUnits("1", 18);
    const MetaNodeStake = await ethers.getContractFactory('MetaNodeStake')
    const metaNodeStake = await MetaNodeStake.deploy()
    await metaNodeStake.waitForDeployment()
    const metaNodeStakeAddr = await metaNodeStake.getAddress()
    const initData = MetaNodeStake.interface.encodeFunctionData('initialize', [
        metaNodeAddr,
        startBlock,
        endBlock,
        metaNodePerBlock
    ]);

    const ERC1967Proxy = await ethers.getContractFactory("@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol:ERC1967Proxy");

    const proxy = await ERC1967Proxy.deploy(metaNodeStakeAddr, initData)
    await proxy.waitForDeployment()
    const _proxyAddr = await proxy.getAddress()

    const metaNodeStakeProxy = await ethers.getContractAt('MetaNodeStake', _proxyAddr)
    return {
        metaNodeStakeProxyFixture: metaNodeStakeProxy
    }
}

describe('MetaNodeStake', () => {
    let metaNodeStakeProxy: MetaNodeStake;
    let metaNodeStakeProxyAddr: string;
    beforeEach(async () => {
        metaNodeStakeProxy = await ethers.getContractAt('MetaNodeStake', proxyAddr)
        metaNodeStakeProxyAddr = await metaNodeStakeProxy.getAddress()
    })

    describe('非快照', () => {

        it('查看基本信息', async () => {
            console.log('       startBlock: ', await metaNodeStakeProxy.startBlock())
            console.log('       endBlock:', await metaNodeStakeProxy.endBlock())
            console.log('       MetaNode:', await metaNodeStakeProxy.MetaNode())
            console.log('       MetaNodePerBlock:', await metaNodeStakeProxy.MetaNodePerBlock())
            console.log('       totalPoolWeight:', await metaNodeStakeProxy.totalPoolWeight())
            console.log('       poolLength:', await metaNodeStakeProxy.poolLength())
        });
    })



    describe('快照', () => {

        describe('创建池子', async () => {

            it('验证非以太币创建池子回滚', async () => {
                const {metaNodeStakeProxyFixture} = await networkHelpers.loadFixture(metaNodeStakeFixture)
                await expect(metaNodeStakeProxyFixture.addPool(
                    metaNodeAddr,
                    100n,
                    ethers.parseEther('1'),
                    10000,
                    true
                )).revertedWith('invalid staking token address')
            })

            it('验证已有池子情况下使用以太币创建池子回滚', async () => {
                const {metaNodeStakeProxyFixture} = await networkHelpers.loadFixture(metaNodeStakeFixture)
                await metaNodeStakeProxyFixture.addPool(
                    ethers.ZeroAddress,
                    100n,
                    ethers.parseEther('1'),
                    10000,
                    true
                )
                await expect(metaNodeStakeProxyFixture.addPool(
                    ethers.ZeroAddress,
                    100n,
                    ethers.parseEther('1'),
                    10000,
                    true
                )).revertedWith('invalid staking token address')
            })

            it('验证取消质押锁定块数为零回滚', async () => {
                const {metaNodeStakeProxyFixture} = await networkHelpers.loadFixture(metaNodeStakeFixture)
                await metaNodeStakeProxyFixture.addPool(
                    ethers.ZeroAddress,
                    100n,
                    ethers.parseEther('1'),
                    10000,
                    true
                )
                await expect(metaNodeStakeProxyFixture.addPool(
                    metaNodeAddr,
                    100n,
                    ethers.parseEther('1'),
                    0n,
                    true
                )).revertedWith('invalid withdraw locked blocks')
            })

            it('验证正确的创建以太币质押池子和ERC20代币质押池子', async () => {
                const {metaNodeStakeProxyFixture} = await networkHelpers.loadFixture(metaNodeStakeFixture)
                await metaNodeStakeProxyFixture.addPool(
                    ethers.ZeroAddress,
                    100n,
                    ethers.parseEther('1'),
                    10000n,
                    true
                )
                await metaNodeStakeProxyFixture.addPool(
                    metaNodeAddr,
                    100n,
                    ethers.parseEther('1'),
                    10000n,
                    true
                )
            })
        });

        describe('更新池子基本信息', async () => {

            it('验证正确的更新池子基本信息', async () => {
                const {metaNodeStakeProxyFixture} = await networkHelpers.loadFixture(metaNodeStakeFixture)
                await metaNodeStakeProxyFixture.addPool(
                    ethers.ZeroAddress,
                    100n,
                    ethers.parseEther('1'),
                    10000n,
                    true
                )
                await metaNodeStakeProxyFixture["updatePool(uint256,uint256,uint256)"](
                    0,
                    ethers.parseEther('0.5'),
                    5000n
                )
            })
        })
    })




})
