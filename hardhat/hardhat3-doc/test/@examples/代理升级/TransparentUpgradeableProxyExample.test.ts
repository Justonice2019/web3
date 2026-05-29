import {network} from 'hardhat'


const {ethers, networkHelpers} = await network.connect({
    chainType: 'l1',
    network: 'localhost'
})


describe('TransparentUpgradeableProxyExample', async () => {

    it('代理合约升级V1->V2', async () => {
        console.log(`
测试步骤:
1. 代理V1时候观察count的值, 再 addCount 再继续观察
2. 代理V2时候, 查看version观察count的值, 再 addCount minusCount  再继续观察

疑惑点: await ethers.getContractAt 和 ProxyAdminExample.attach(actualProxyAdminAddress) 
        getContractFactory 没有合约工厂就可以, attach: 必须先有合约工厂才行 本质上一样的
        `)

        const ERC1967_ADMIN_STORAGE_SLOT = "0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103";
        const ERC1967_PROXY_STORAGE_SLOT = "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc";

        const [admin, a2, a3] = await ethers.getSigners()
        const adminAddr = admin.address;

        // 1. 部署 ImplV1Example
        const ImplV1Example = await ethers.getContractFactory('ImplV1Example')
        const implV1Example = await ImplV1Example.deploy()
        await implV1Example.waitForDeployment()
        const implV1ExampleAddr = await implV1Example.getAddress()

        // 2. 准备初始化数据
        const initialData = implV1Example.interface.encodeFunctionData('initialize', [
            1n
        ])

        // 3. 部署代理ProxyExample
        const ProxyExample = await ethers.getContractFactory('ProxyExample')
        const proxyExample = await ProxyExample.deploy(
            implV1ExampleAddr,
            adminAddr,
            initialData
        )
        await proxyExample.waitForDeployment()
        const proxyExampleAddr = await proxyExample.getAddress()
        const adminStorage = await ethers.provider.getStorage(
            proxyExampleAddr,
            ERC1967_ADMIN_STORAGE_SLOT
        );

        // 4. 获取真实的 ProxyAdminAddress (是ProxyExample在部署的时候根据adminAddr生成到链上的)
        const adminStorageHex = adminStorage.startsWith("0x") ? adminStorage.slice(2) : adminStorage;
        const actualProxyAdminAddress = ethers.getAddress("0x" + adminStorageHex.slice(-40).padStart(40, '0'));
        console.log('adminAddr: ', adminAddr)
        console.log('actualProxyAdminAddress: ', actualProxyAdminAddress)

        // 5. 获取 管理员合约实例
        const ProxyAdminExample = await ethers.getContractFactory("ProxyAdminExample");
        const proxyAdminExample = ProxyAdminExample.attach(actualProxyAdminAddress)
        console.log('proxyAdminExample.owner():', await proxyAdminExample.owner())

        // 6. 获取代理实现
        const implV1ExampleProxy = await ethers.getContractAt('ImplV1Example', proxyExampleAddr)
        // const implV1ExampleProxy = ImplV1Example.attach(proxyExampleAddr) // 等同

        console.log('count: ', await implV1ExampleProxy.count())
        console.log('+1n +1n')
        await implV1ExampleProxy.addCount()
        await implV1ExampleProxy.addCount()
        console.log('count: ', await implV1ExampleProxy.count())

        // 7. 部署 ImplV2Example
        const ImplV2Example = await ethers.getContractFactory('ImplV2Example')
        const implV2Example = await ImplV2Example.deploy()
        const implV2ExampleAddr = await implV2Example.getAddress()
        console.log('implV2ExampleAddr: ', implV2ExampleAddr)

        const initialDataV2 = implV2Example.interface.encodeFunctionData('initializeV2', [
            2n,
            2n
        ])

        const upgradeTx = await proxyAdminExample.upgradeAndCall(
            proxyExampleAddr,
            implV2ExampleAddr,
            '0x'
        )
        await upgradeTx.wait()
        const newImplStorage = await ethers.provider.getStorage(
            proxyExampleAddr,
            ERC1967_PROXY_STORAGE_SLOT
        );
        const newImplStorageHex = newImplStorage.startsWith("0x")
            ? newImplStorage.slice(2)
            : newImplStorage;
        const verifiedNewImpl = ethers.getAddress("0x" + newImplStorageHex.slice(-40).padStart(40, '0'));
        console.log('verifiedNewImpl: ', verifiedNewImpl)

        // 8. 获取 ImplV2Example 代理
        const implV2ExampleProxy = await ethers.getContractAt('ImplV2Example', proxyExampleAddr)
        await implV2ExampleProxy.initializeV2(2n, 2n)
        console.log('version: ', await implV2ExampleProxy.version())

        // 9. 尝试 调用方法测试
        console.log(await implV2ExampleProxy.count())
        console.log('+3n')
        await implV2ExampleProxy.addCount()
        console.log(await implV2ExampleProxy.count())
        console.log('-1n')
        await implV2ExampleProxy.minusCount()
        console.log(await implV2ExampleProxy.count())


    })

})