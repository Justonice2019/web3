import {network, artifacts, } from 'hardhat'
import {expect} from 'chai'
import dayjs from "dayjs";

const {ethers, networkHelpers} = await network.connect({
  network: 'localhost',
  chainType: 'l1'
})

// 前置条件:
// npx hardhat compile (新合约需要先编译一下)
// npx hardhat node (启动本地网络)

const exampleFixture = async () => {
  const [owner, addr1] = await ethers.getSigners()

  // const contract = await ethers.deployContract('Example', [owner, 'test', ethers.parseEther('1'), 3n])
  const exampleFactory = await ethers.getContractFactory('Example')
  const contract = await exampleFactory.deploy(1n)

  return {
    contract,
    owner,
    addr1
  }
}

const CAMPAIGN_NAME = "测试众筹活动";
const GOAL = ethers.parseEther("10");
const DURATION_DAYS = 7;
const crowdfundingCampaignFixture = async () => {
  const [owner, contributor1, contributor2, contributor3] = await ethers.getSigners()

  const contractFactory = await ethers.getContractFactory('CrowdfundingCampaign')
  const campaign = await contractFactory.deploy(owner, CAMPAIGN_NAME, GOAL, DURATION_DAYS)

  const timestamp = await networkHelpers.time.latest()

  return {
    campaign,
    timestamp,

    owner,
    contributor1,
    contributor2,
    contributor3
  }
}

describe('hardhat3-doc', () => {

  it('network.networkHelpers', async () => {
    const {contract} = await networkHelpers.loadFixture(exampleFixture)
    expect(ethers.isAddress(await contract.getAddress())).to.be.true

    const time = networkHelpers.time
    const latestTime = await time.latest()
    console.log(`    [状态] 最新时间: ${dayjs(latestTime * 1000).format('YYYY-MM-DD HH:mm:ss')}`);
    const block = await ethers.provider.getBlock('latest', true)

    if (block?.timestamp) {
      expect(latestTime).is.equal(block?.timestamp);
    }

    // 时间旅行 10分钟
    await time.increase(10 * 60)
    const latestTimeAfter = await time.latest()
    console.log(`    [状态] 最新时间: ${dayjs(latestTimeAfter * 1000).format('YYYY-MM-DD HH:mm:ss')}`);


  })

  describe('network.ethers.deployContract=>contract', async () => {

    it('contract/获取属性', async () => {
      const {contract} = await networkHelpers.loadFixture(exampleFixture)
      expect(await contract.count()).to.be.eq(1n)
    })

    it('contract/调用方法', async () => {
      const {contract} = await networkHelpers.loadFixture(exampleFixture)
      await contract.getCount()
      expect(await contract.count()).to.be.eq(1n)
    })

    it('contract/调用方法(重载)', async () => {
      const {contract} = await networkHelpers.loadFixture(exampleFixture)
      await contract['addCount()']()
      await contract['addCount(uint256)'](2n)
      expect(await contract.count()).to.be.eq(4n)
    })

    it('contract.connect()', async () => {
      const {campaign, contributor1} = await networkHelpers.loadFixture(crowdfundingCampaignFixture)
      await expect(campaign.connect(contributor1).start())
          .revertedWith('CrowdfundingCampaign: caller is not the owner')
    })
  })

  it('artifacts', async () => {
    const crowdfundingCampaignArtifact = await artifacts.readArtifact("Example");
    // console.log(crowdfundingCampaignArtifact)
    expect(crowdfundingCampaignArtifact).has.a.property('abi')
    expect(crowdfundingCampaignArtifact).has.a.property('bytecode')
  })
})


