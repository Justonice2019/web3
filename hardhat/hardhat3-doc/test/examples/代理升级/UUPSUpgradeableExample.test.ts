import {network, } from 'hardhat'


const {ethers, networkHelpers} = await network.connect({
    chainType: 'l1',
    network: 'localhost'
})

describe('TransparentUpgradeableProxyExample', async () => {

    it('代理合约升级V1->V2', async () => {


        // 1. 部署 V1
        const UUPSUpgradeableExampleV1 = await ethers.getContractFactory('UUPSUpgradeableExampleV1')
        const uupsUpgradeableExampleV1 = await UUPSUpgradeableExampleV1.deploy()
        await uupsUpgradeableExampleV1.waitForDeployment()
        const uupsUpgradeableExampleV1Addr = await uupsUpgradeableExampleV1.getAddress()

        // 2. 初始化初始数据
        const initData = uupsUpgradeableExampleV1.interface.encodeFunctionData("initialize", [1n]);

        // 3. 部署代理合约
        const ERC1967Proxy = await ethers.getContractFactory("@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol:ERC1967Proxy");
        const proxy = await ERC1967Proxy.deploy(
            uupsUpgradeableExampleV1Addr,
            initData
        )
        const proxyAddr = await proxy.getAddress()

        // 4. 获取 v1 代理
        console.log('测试代理V1')
        const uupsUpgradeableExampleV1Proxy = await ethers.getContractAt('UUPSUpgradeableExampleV1', proxyAddr)
        console.log('count: ', await uupsUpgradeableExampleV1Proxy.count())
        console.log('+1n')
        await uupsUpgradeableExampleV1Proxy.addCount()
        console.log('+1n')
        await uupsUpgradeableExampleV1Proxy.addCount()
        console.log('count: ', await uupsUpgradeableExampleV1Proxy.count())

        // 5. 部署 V2
        const UUPSUpgradeableExampleV2 = await ethers.getContractFactory('UUPSUpgradeableExampleV2')
        const uupsUpgradeableExampleV2 = await UUPSUpgradeableExampleV2.deploy()
        await uupsUpgradeableExampleV2.waitForDeployment()
        // await uupsUpgradeableExampleV2.reinitializeV2(2n) // 为了验证  constructor() { _disableInitializers(); }
        const uupsUpgradeableExampleV2Addr = await uupsUpgradeableExampleV2.getAddress()

        // 6. 升级合约, 获取 v2 代理
        // 6.1 自动初始化
        const initializeV2 = uupsUpgradeableExampleV2.interface.encodeFunctionData('reinitializeV2', [2n])
        const upgradeTx  = await uupsUpgradeableExampleV1Proxy.upgradeToAndCall(
            uupsUpgradeableExampleV2Addr,
            initializeV2
        )
        await upgradeTx.wait()
        const uupsUpgradeableExampleV2Proxy = await ethers.getContractAt('UUPSUpgradeableExampleV2', proxyAddr);

        // 6.2 手动初始化
        // const upgradeTx  = await uupsUpgradeableExampleV1Proxy.upgradeToAndCall(
        //     uupsUpgradeableExampleV2Addr,
        //     '0x'
        // )
        // await upgradeTx.wait()
        // const uupsUpgradeableExampleV2Proxy = await ethers.getContractAt('UUPSUpgradeableExampleV2', proxyAddr);
        // const reinitTx = await uupsUpgradeableExampleV2Proxy.reinitializeV2(2n);
        // await reinitTx.wait();


        console.log('测试代理V2')
        console.log(await  uupsUpgradeableExampleV2Proxy.version())
        console.log('count: ', await uupsUpgradeableExampleV2Proxy.count())
        console.log('+2n')
        await uupsUpgradeableExampleV2Proxy.addCount()
        console.log('+2n')
        await uupsUpgradeableExampleV2Proxy.addCount()
        console.log('count: ', await uupsUpgradeableExampleV2Proxy.count())
    })

})
