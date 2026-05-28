import {buildModule} from '@nomicfoundation/hardhat-ignition/modules'

export default buildModule('CrowdfundingFactoryModule', m => {
    const crowdfundingFactory = m.contract('CrowdfundingFactory')
    return {
        crowdfundingFactory
    }
})