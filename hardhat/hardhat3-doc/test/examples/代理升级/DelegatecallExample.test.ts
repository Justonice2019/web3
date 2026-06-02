import {network} from 'hardhat'


const {ethers, networkHelpers} = await network.connect({
    chainType: 'l1',
    network: 'localhost'
})


describe('DelegatecallExample', async () => {

    it('测试合约升级的原理', async () => {

        const logicAFactory = await ethers.getContractFactory('LogicA')

        const logicA = await logicAFactory.deploy()

        const logicAAddr = await logicA.getAddress()

        console.log(`LogicA: ${logicAAddr}`)

        const logicBFactory = await ethers.getContractFactory('LogicB')

        const logicB = await logicBFactory.deploy()

        const logicBAddr = await logicB.getAddress()

        console.log(`LogicB: ${logicBAddr}`)

        const proxyFactory = await ethers.getContractFactory('Proxy')

        const proxy = await proxyFactory.deploy(logicAAddr)

        const proxyAddr = await proxy.getAddress()

        console.log(`Proxy: ${proxyAddr}`)

        const proxyLogicA = await ethers.getContractAt('LogicA', proxyAddr)
        console.log(`proxyLogicA: ${await proxyLogicA.getAddress()}`)
        await proxyLogicA.setValue(123n)
        const resultA = await proxyLogicA.getValue()
        console.log(resultA)

        console.log('由LogicA升级到LogicB')
        await proxy.upgrade(logicBAddr)

        const proxyLogicB = await ethers.getContractAt('LogicB', proxyAddr)
        console.log(`proxyLogicB: ${await proxyLogicB.getAddress()}`)
        await proxyLogicB.setValue(123n)
        const resultB = await proxyLogicB.getValue()
        console.log(resultB)

    })




})