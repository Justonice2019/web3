import {expect} from 'chai'
import {network  } from 'hardhat'
import * as utils from '../../utils/index.ts'

const {ethers, networkHelpers } = await network.connect({
    chainType: 'l1',
    network: 'localhost',
})
const {provider} = ethers
describe("TestInitializable", () => {

    it('should', async () => {
        const TestInitializable = await ethers.getContractFactory("TestInitializable");
        const testInitializable = await TestInitializable.deploy()
        const tx = await testInitializable.initialize()
        await tx.wait()
        const tx2Promise = testInitializable.initialize()
        await expect(tx2Promise).revertedWithCustomError(testInitializable, 'InvalidInitialization')

    });
});
