import {expect} from 'chai'
import {network  } from 'hardhat'

const {ethers, networkHelpers } = await network.connect({
    chainType: 'l1',
    network: 'localhost',
})
const {provider} = ethers

// TODO: 这个测试以后再写吧
describe("TestDelegatecall", () => {

    it('should', async () => {
        const TestDelegatecall = await ethers.getContractFactory("TestDelegatecall");
        const testDelegatecall = await TestDelegatecall.deploy()
        await testDelegatecall.waitForDeployment()

        const initializeInterface = new ethers.Interface([
            'function initialize ()'
        ])
        const initData = initializeInterface.encodeFunctionData('initialize')

        const result = await testDelegatecall.run(initData)

        await result.wait()

        console.log(result)

    });
});
