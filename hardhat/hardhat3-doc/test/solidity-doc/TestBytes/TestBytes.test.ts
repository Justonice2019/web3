import {network} from 'hardhat'
import * as utils from '../../../utils/index.ts'

const {ethers, networkHelpers} = await network.connect({
    chainType: 'l1',
    network: 'localhost'
})

const testBytesFixture = async () => {
    const testBytesFactory = await ethers.getContractFactory('TestBytes')
    const testBytes = await testBytesFactory.deploy()
    return {
        testBytes
    }
}

describe('TestBytes', async () => {

    it('js环境下获取bytes', async () => {

        const str= 'hello'

        console.log(utils.toBytes(str)) // 0x68656c6c6f

        const hexStr = '68656c6c6f'
        const hexString2 = ethers.toBeHex('0x' + hexStr)
        console.log(hexString2) // 0x68656c6c6f

        console.log(utils.strToBytes(str)) // 0x68656c6c6f

    })

    it('获取bytes', async () => {

        const {testBytes} = await networkHelpers.loadFixture(testBytesFixture)
        const result = await testBytes.str2Bytes()
        console.log(result) // 0x68656c6c6f
    })


})