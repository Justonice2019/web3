import {expect} from 'chai'
import {network  } from 'hardhat'
import * as utils from '../../utils/index.ts'

const {ethers, networkHelpers } = await network.connect({
    chainType: 'l1',
    network: 'localhost',
})
const {provider} = ethers
describe("TestAccessControlUpgradeable", () => {

    it('should', async () => {
        const [admin, operator] = await ethers.getSigners()

        const TestAccessControlUpgradeable = await ethers.getContractFactory("TestAccessControlUpgradeable");
        const testAccessControlUpgradeable = await TestAccessControlUpgradeable.deploy()
        const tx = await testAccessControlUpgradeable.initialize(admin.address)
        await tx.wait()

        const addOperatorTx = await testAccessControlUpgradeable.addOperator(operator.address)
        await addOperatorTx.wait()

        const doOperatorWorkPromise =  testAccessControlUpgradeable.doOperatorWork()
        await expect(doOperatorWorkPromise).revertedWithCustomError(testAccessControlUpgradeable, 'AccessControlUnauthorizedAccount')

        const doOperatorWorkResult = await testAccessControlUpgradeable.connect(operator).doOperatorWork()
        console.log('doOperatorWorkResult: ', doOperatorWorkResult)
    });
});
