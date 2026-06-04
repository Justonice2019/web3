import {network, artifacts,} from 'hardhat'
import {expect} from 'chai'
import {type Signer, formatEther, parseEther, AbstractSigner, ContractTransactionResponse} from "ethers";
import dayjs from 'dayjs'
import {type MetaNodeStake, type MetaNode} from "../../../types/ethers-contracts/index.ts";

const {ethers, networkHelpers, provider} = await network.connect({
    network: 'localhost',
    chainType: 'l1'
})

// 前置条件:
// npx hardhat compile (新合约需要先编译一下)
// npx hardhat node (启动本地网络)
// npm run MetaNodeStake:deploy-to-local-with-hardhat (先部署 MetaNode MetaNodeStake 到 本地环境)
// 使用 npm run MetaNodeStake:test 运行这个文件


// MetaNode部署成功: 0x5FbDB2315678afecb367f032d93F642f64180aa3
// MetaNodeStake 部署成功: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
// MetaNodeStake代理 部署成功: 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
const META_NODE_ADDR = '0x5FbDB2315678afecb367f032d93F642f64180aa3'
const PROXY_ADDR = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0'

// 快照1: 合约初始化
const metaNodeStakeFixture = async () => {
    const [admin, a1, a2, a3] = await ethers.getSigners()

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
        metaNodePerBlock,
    ]);

    const ERC1967Proxy = await ethers.getContractFactory("@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol:ERC1967Proxy");

    const proxy = await ERC1967Proxy.deploy(metaNodeStakeAddr, initData)
    await proxy.waitForDeployment()
    const proxyAddr = await proxy.getAddress()

    await metaNode.connect(admin).transfer(proxyAddr, ethers.parseEther("1000000"));

    const metaNodeStakeProxy = await ethers.getContractAt('MetaNodeStake', proxyAddr)
    return {
        metaNodeStakeProxyFixture: metaNodeStakeProxy,
        metaNodeFixture: metaNode,
        proxyAddr,
        admin,
        adminAddr: await admin.getAddress(),
        a1,
        a1Addr: await a1.getAddress(),
        a2,
        a2Addr: await a2.getAddress(),
        a3,
        a3Addr: await a3.getAddress(),
    }
}

interface IMetaNodeStakeProxyFixture {
    metaNodeStakeProxyFixture: MetaNodeStake,
    metaNodeFixture: MetaNode,
    proxyAddr: string,
    admin: Signer,
    adminAddr: string,
    a1: Signer,
    a1Addr: string,
    a2: Signer,
    a2Addr: string,
    a3: Signer,
    a3Addr: string,
}
// 快照2: 合约初始化-增加ETH和ERC20池子
const addPoolFixture = async ({metaNodeStakeProxyFixture, ...rest} : IMetaNodeStakeProxyFixture) => {
    await metaNodeStakeProxyFixture.addPool(
        ethers.ZeroAddress,
        100n,
        ethers.parseEther('1'),
        10000n,
        true
    )
    await metaNodeStakeProxyFixture.addPool(
        META_NODE_ADDR,
        100n,
        ethers.parseEther('1'),
        10000n,
        true
    )
    return {
        metaNodeStakeProxyFixture,
        ...rest
    }
}
// 快照3: 合约初始化-第一次存入1ETH-第二次存入1ETH
const depositETHFixture = async ({metaNodeStakeProxyFixture, ...rest} : IMetaNodeStakeProxyFixture) => {
    const tx = await metaNodeStakeProxyFixture.connect(rest.a1).depositETH({
        value: ethers.parseEther('1'),
    })
    await tx.wait()
    await networkHelpers.mine(100);
    const tx2 = await metaNodeStakeProxyFixture.connect(rest.a1).depositETH({
        value: ethers.parseEther('1'),
    })
    await tx2.wait()
    return {
        metaNodeStakeProxyFixture,
        ...rest
    }
}

const logPoolInfo = async (metaNodeStakeProxyFixture: any, _id: BigInt) => {
    const p = await metaNodeStakeProxyFixture.pool(_id)
    console.log(`池子: ${_id}`)
    console.table([
        {
            stTokenAddress: p[0],
            poolWeight: p[1],
            lastRewardBlock: p[2],
            accMetaNodePerST: p[3],
            stTokenAmount: p[4],
            ...(p.stTokenAddress === ethers.ZeroAddress ? {'stTokenAmount(formatted)': `${ethers.formatEther(p[4])}ETH`} : {}),
            minDepositAmount: p[5],
            unstakeLockedBlocks: p[6],
        }
    ])
}
const logUserInfo = async (metaNodeStakeProxyFixture: any, _id: BigInt, _userAddr: string) => {
    const p = await metaNodeStakeProxyFixture.pool(_id)
    const u = await metaNodeStakeProxyFixture.user(0n, _userAddr)

    console.log(`用户: ${_id}-${_userAddr}`)
    console.table([
        {
            stAmount: u[0],
            ...(p.stTokenAddress === ethers.ZeroAddress ? {'stAmount(formatted)': `${ethers.formatEther(u[0])}ETH`} : {}),
            finishedMetaNode: u[1],
            pendingMetaNode: u[2],
        }
    ])
}

describe('MetaNodeStake', () => {
    let metaNodeStakeProxy: MetaNodeStake;
    let metaNodeStakeProxyAddr: string;
    beforeEach(async () => {
        metaNodeStakeProxy = await ethers.getContractAt('MetaNodeStake', PROXY_ADDR)
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
                    META_NODE_ADDR,
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
                    META_NODE_ADDR,
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
                    META_NODE_ADDR,
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

        describe('质押', async () => {

            it('质押ETH', async () => {
                const fixture = async () => addPoolFixture(await metaNodeStakeFixture())
                const {metaNodeStakeProxyFixture, proxyAddr, adminAddr, a1, a1Addr} = await networkHelpers.loadFixture(fixture)
                console.log('       poolLength(): ', await metaNodeStakeProxyFixture.poolLength())

                console.log('       getBlockNumber(): ', await ethers.provider.getBlockNumber())
                await expect(metaNodeStakeProxyFixture.depositETH({
                    value: ethers.parseEther('0.5'),
                })).revertedWith('deposit amount is too small')

                await logPoolInfo(metaNodeStakeProxyFixture, 0n)

                const tx = await metaNodeStakeProxyFixture.connect(a1).depositETH({
                    value: ethers.parseEther('1'),
                })
                const receipt = await tx.wait()
                expect(receipt?.status === 1).is.true

                const balance = await ethers.provider.getBalance(proxyAddr)
                console.log('       balance: ', ethers.formatEther(balance), 'ETH')

                await logPoolInfo(metaNodeStakeProxyFixture, 0n)
                await logUserInfo(metaNodeStakeProxyFixture, 0n, a1Addr)


                await networkHelpers.mine(300)

                console.log('       getBlockNumber(): ', await ethers.provider.getBlockNumber())
                const tx2 = await metaNodeStakeProxyFixture.connect(a1).depositETH({
                    value: ethers.parseEther('1'),
                })
                const receipt2 = await tx2.wait()
                expect(receipt2?.status === 1).is.true

                await logPoolInfo(metaNodeStakeProxyFixture, 0n)
                await logUserInfo(metaNodeStakeProxyFixture, 0n, a1Addr)

            })

            it('领取奖励', async () => {
                const fixture = async () => depositETHFixture(await addPoolFixture(await metaNodeStakeFixture()))

                const {metaNodeStakeProxyFixture, adminAddr, a1, a1Addr, metaNodeFixture} = await networkHelpers.loadFixture(fixture)

                await logUserInfo(metaNodeStakeProxyFixture, 0n, a1Addr)

                console.log('       MNT: ', await metaNodeFixture.balanceOf(adminAddr))
                console.log('       MNT: ', await metaNodeFixture.balanceOf(a1Addr))

                const tx = await metaNodeStakeProxyFixture.connect(a1).claim(0n)

                const receipt = await tx.wait()

                expect(receipt?.status === 1).is.true

                await logUserInfo(metaNodeStakeProxyFixture, 0n, a1Addr)

                console.log('       MNT: ', await metaNodeFixture.balanceOf(a1Addr))

            })
        })
    })




})
