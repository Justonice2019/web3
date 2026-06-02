import {expect} from 'chai'
import {network  } from 'hardhat'
import * as utils from '../../utils/index.ts'

const {ethers, networkHelpers } = await network.connect({
    chainType: 'l1',
    network: 'localhost',
})
const {provider} = ethers
describe("TestPausableUpgradeable", () => {

    it('should', async () => {
        const TestPausableUpgradeable = await ethers.getContractFactory("TestPausableUpgradeable");
        const testPausableUpgradeable = await TestPausableUpgradeable.deploy()
        const tx = await testPausableUpgradeable.initialize()
        await tx.wait()
        const result = await testPausableUpgradeable.doSomething()
        console.log('result: ', result)

        const tx2 = await testPausableUpgradeable.pauseContract()
        await tx2.wait()

        const p = testPausableUpgradeable.doSomething()
        await expect(p).revertedWithCustomError(testPausableUpgradeable, 'EnforcedPause')

    });
});
