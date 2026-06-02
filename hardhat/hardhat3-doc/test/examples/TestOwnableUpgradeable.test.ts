import {expect} from 'chai'
import {network  } from 'hardhat'
import * as utils from '../../utils/index.ts'

const {ethers, networkHelpers } = await network.connect({
    chainType: 'l1',
    network: 'localhost',
})
const {provider} = ethers
describe("TestOwnableUpgradeable", () => {

    it('should', async () => {

        const [admin, a2] = await ethers.getSigners()

        const TestOwnableUpgradeable = await ethers.getContractFactory("TestOwnableUpgradeable");
        const testOwnableUpgradeable = await TestOwnableUpgradeable.deploy()
        const tx = await testOwnableUpgradeable.initialize(admin)
        await tx.wait()

        const setValueResult = await testOwnableUpgradeable.setValue(2n)
        await setValueResult.wait()
        expect(await testOwnableUpgradeable.value()).to.eq(2n)

        await expect(testOwnableUpgradeable.connect(a2).setValue(3n)).revertedWithCustomError(testOwnableUpgradeable, 'OwnableUnauthorizedAccount')

    });
});
