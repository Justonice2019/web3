import {network, artifacts,} from 'hardhat'
import {expect} from 'chai'
import {Contract, formatEther, parseEther, AbstractSigner, ContractTransactionResponse} from "ethers";
import dayjs from 'dayjs'

const State = {
  Preparing: 0,
  Active: 1,
  Success: 2,
  Failed: 3,
  Closed: 4
}

const {ethers, networkHelpers} = await network.connect({
  network: 'localhost',
  chainType: 'l1'
})

// 前置条件:
// npx hardhat compile (新合约需要先编译一下)
// npx hardhat node (启动本地网络)

const CAMPAIGN_NAME = "测试众筹活动";
const GOAL = ethers.parseEther("10");
const DURATION_DAYS = 7;

const formatTimestamp = (blockTimestamp: Number | BigInt) => {
  return dayjs(Number(blockTimestamp) * 1000).format('YYYY-MM-DD HH:mm:ss')
}

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

describe('CrowdfundingCampaign', () => {

  describe('Deployment', async () => {

    it('should deploy correct initial state', async () => {
      const {campaign, owner} = await networkHelpers.loadFixture(crowdfundingCampaignFixture)

      const state = await campaign.state();
      const contractOwner = await campaign.owner();
      const contractGoal = await campaign.goal();
      const totalRaised = await campaign.totalRaised();

      console.log(`    当前状态: ${state} (0=准备中)`);
      console.log(`    创建者: ${contractOwner}`);
      console.log(`    目标金额: ${formatEther(contractGoal)} ETH`);
      console.log(`    已筹集: ${formatEther(totalRaised)} ETH`);


      expect(state).to.equal(0); // Preparing
      expect(contractOwner).to.equal(owner.address);
      expect(contractGoal).to.equal(GOAL);
      expect(totalRaised).to.equal(0);
      console.log("✓ 初始状态验证成功");
    })

    it('should set correct deadline', async () => {

      const {campaign, timestamp} = await networkHelpers.loadFixture(crowdfundingCampaignFixture)

      const deadline = await campaign.deadline()

      console.log(`    当前时间: ${formatTimestamp(timestamp)}`);

      console.log(`    截止时间: ${formatTimestamp(deadline)}`);

      const expectDeadline = timestamp + DURATION_DAYS * 24 * 60 * 60

      console.log(`    预期截止时间: ${formatTimestamp(expectDeadline)}`);

      expect(deadline).is.equal(expectDeadline)

      console.log("✓ 截止时间验证成功");
    })

    it('should reject invalid constructor parameter', async () => {
      const campaignFactory = await ethers.getContractFactory('CrowdfundingCampaign')
      const [owner] = await ethers.getSigners()


      await expect(campaignFactory.deploy(ethers.ZeroAddress, CAMPAIGN_NAME, GOAL, DURATION_DAYS))
          .to.revertedWith('CrowdfundingCampaign: invalid owner')
      console.log("✓ 测试零地址成功");

      await expect(campaignFactory.deploy(owner, '', GOAL, DURATION_DAYS))
          .to.revertedWith('CrowdfundingCampaign: name cannot be empty')
      console.log("✓ 测试无活动名成功");

      await expect(campaignFactory.deploy(owner, CAMPAIGN_NAME, 0, DURATION_DAYS))
          .to.revertedWith("CrowdfundingCampaign: goal must be positive")
      console.log("✓ 测试无目标名成功");

      await expect(campaignFactory.deploy(owner, CAMPAIGN_NAME, 3, 0))
          .to.revertedWith("CrowdfundingCampaign: invalid duration")
      console.log("✓ 测试0持续时间不被允许成功");

      await expect(campaignFactory.deploy(owner, CAMPAIGN_NAME, 3, 100))
          .to.revertedWith("CrowdfundingCampaign: invalid duration")
      console.log("✓ 测试100天持续时间不被允许成功");
    })

  })

  describe('State transition', () => {
    it('should transition from preparing to active', async () => {
      const {campaign, contributor1} = await networkHelpers.loadFixture(crowdfundingCampaignFixture)

      expect(await campaign.state()).to.equal(State.Preparing);
      console.log(`    启动之前: ${State.Preparing}-(Preparing)`)

      await expect(campaign.start())
          .to.emit(campaign, 'StateChanged')
          .withArgs(State.Preparing, State.Active)
      expect(await campaign.state()).to.equal(State.Active);
      console.log(`    启动之后: ${State.Active}-(Active)`)
      console.log(`✓ 状态变更成功`)

      await expect(campaign.connect(contributor1).start())
          .revertedWith('CrowdfundingCampaign: caller is not the owner')
      console.log('    ')

      await expect(campaign.start())
          .revertedWith('CrowdfundingCampaign: invalid state')
      console.log('✓ [验证通过]')
    })


    it('should be start only owner', async () => {
      const {campaign, contributor1} = await networkHelpers.loadFixture(crowdfundingCampaignFixture)

      await expect(campaign.connect(contributor1).start())
          .to.revertedWith('CrowdfundingCampaign: caller is not the owner')
      console.log('✓ [验证通过] 不可以非owner启动')
    })

    it('should not be able to start multiple times', async () => {
      const {
        campaign,
        contributor1,
        contributor2,
        contributor3
      } = await networkHelpers.loadFixture(crowdfundingCampaignFixture)
      await campaign.start()

      await expect(campaign.start())
          .revertedWith('CrowdfundingCampaign: invalid state')
      console.log('✓ [验证通过] 不可以多次启动')
    })

    it('应该是达到目标且截止后转换为成功状态', async () => {
      const {
        campaign,
        contributor1,
        contributor2,
        contributor3
      } = await networkHelpers.loadFixture(crowdfundingCampaignFixture)

      const block = await ethers.provider.getBlock('latest')
      if (block) {
        console.log('    当前时间:', dayjs(Number(block.timestamp) * 1000).format('YYYY-MM-DD HH:mm:ss'))
      }
      await campaign.start()
      const result = campaign.connect(contributor1).contribute({
        value: GOAL,
      })
      await expect(result)
          .to.emit(campaign, 'Contribution')

      console.log('    截止时间:', dayjs(Number(await campaign.deadline()) * 1000).format('YYYY-MM-DD HH:mm:ss'))

      await expect(campaign.finalize())
          .to.revertedWith('CrowdfundingCampaign: campaign not ended')

      console.log('    时间旅行到截止时间以后...')

      await networkHelpers.time.increase(DURATION_DAYS * 24 * 60 * 60)

      const blockAfter = await ethers.provider.getBlock('latest')
      if (blockAfter) {
        console.log('    当前时间:', dayjs(Number(blockAfter.timestamp) * 1000).format('YYYY-MM-DD HH:mm:ss'));
      }

      await expect(campaign.finalize())
          .to.emit(campaign, 'StateChanged')
          .withArgs(State.Active, State.Success)
      console.log('✓ [验证通过] 达到目标且截止后转换为成功状态')

    })

    it('应该是达到目标且截止后转换为失败状态', async () => {
      const {
        campaign,
        contributor1,
        contributor2,
        contributor3
      } = await networkHelpers.loadFixture(crowdfundingCampaignFixture)

      const block = await ethers.provider.getBlock('latest')
      if (block) {
        console.log('    当前时间:', dayjs(Number(block.timestamp) * 1000).format('YYYY-MM-DD HH:mm:ss'))
      }
      await campaign.start()
      const result = campaign.connect(contributor1).contribute({
        value: parseEther('5'),
      })
      await expect(result)
          .to.emit(campaign, 'Contribution')

      console.log('    截止时间:', dayjs(Number(await campaign.deadline()) * 1000).format('YYYY-MM-DD HH:mm:ss'))

      await expect(campaign.finalize())
          .to.revertedWith('CrowdfundingCampaign: campaign not ended')

      console.log('    时间旅行到截止时间以后...')

      await networkHelpers.time.increase(DURATION_DAYS * 24 * 60 * 60)

      const blockAfter = await ethers.provider.getBlock('latest')
      if (blockAfter) {
        console.log('    当前时间:', dayjs(Number(blockAfter.timestamp) * 1000).format('YYYY-MM-DD HH:mm:ss'));
      }

      await expect(campaign.finalize())
          .to.emit(campaign, 'StateChanged')
          .withArgs(State.Active, State.Failed)
      console.log('✓ [验证通过] 达到目标且截止后转换为失败状态')

    })

    it('should not be able to stop the campaign when state is active', async () => {
      const {
        campaign,
        contributor1,
        contributor2,
        contributor3
      } = await networkHelpers.loadFixture(crowdfundingCampaignFixture)
      await campaign.start()

      await expect(campaign.finalize())
          .to.revertedWith('CrowdfundingCampaign: campaign not ended')
      console.log('✓ [验证通过] 当状态为active不可以被终止')
    })


  })

  describe('Contributions', () => {

    it('should be able to contribute correctly', async () => {
      const {
        campaign,
        contributor1,
        contributor2,
        contributor3
      } = await networkHelpers.loadFixture(crowdfundingCampaignFixture)
      await campaign.start()

      let totalRaised = await campaign.totalRaised()
      console.log(`   初始筹款 ${formatEther(totalRaised)} ETH`)


      const contribute = async (contract: any, signer: AbstractSigner, ethValue: string) => {
        console.log('   ----------')
        const address = await signer.getAddress()
        console.log(`   ${address} 贡献 ${ethValue} ETH`)
        const value = parseEther(ethValue)
        await expect(campaign.connect(signer).contribute({value})).to.emit(campaign, 'Contribution').withArgs(address, value)
        const totalRaised = await contract.totalRaised()
        console.log(`   实时筹款 ${formatEther(totalRaised)} ETH`)
        console.log(`   贡献者名单: ${await contract.getContributors()}`)
        console.log(`   贡献者数量: ${await contract.getContributorCount()}`)
      }

      await contribute(campaign, contributor1, '3')
      await contribute(campaign, contributor2, '4')
      await contribute(campaign, contributor1, '3')


    });

    it('it should reject when expired', async () => {
      const {
        campaign,
        contributor1,
        contributor2,
        contributor3
      } = await networkHelpers.loadFixture(crowdfundingCampaignFixture)
      await campaign.start()

      const time = networkHelpers.time
      await time.increase((DURATION_DAYS + 1) * 24 * 60 * 60)


      await expect(campaign.connect(contributor1).contribute({
        value: parseEther('1'),
      })).to.revertedWith('CrowdfundingCampaign: campaign has expired2')
    })


  })

  describe('Fund Management', () => {
    it('should be withdrawn successfully eth when state is successfully', async () => {
      const {
        campaign,
        owner,
        contributor1,
        contributor2,
        contributor3
      } = await networkHelpers.loadFixture(crowdfundingCampaignFixture)
      await campaign.start()

      await campaign.connect(contributor1).contribute({
        value: parseEther('10'),
      })
      await networkHelpers.time.increase(DURATION_DAYS * 24 * 60 * 60)
      await campaign.finalize()

      const totalRaised = await campaign.totalRaised()
      console.log(`    totalRaised: ${formatEther(totalRaised)}ETH`)

      const beforeBalance = await ethers.provider.getBalance(owner)
      console.log(`    之前余额: ${formatEther(beforeBalance)} ETH`)

      const tx = await campaign.withdraw({
        value: totalRaised,
      })
      const receipt = await tx.wait()

      if (receipt && receipt.status === 1) {
        console.log(`    gasUsed: ${receipt.gasUsed}`)
      }
      const balance = await ethers.provider.getBalance(owner);
      console.log(`    当前余额: ${formatEther(balance)} ETH`)
    })
    it('should be refund successfully eth when state is failed', async () => {
      const {
        campaign,
        owner,
        contributor1,
        contributor2,
        contributor3
      } = await networkHelpers.loadFixture(crowdfundingCampaignFixture)
      await campaign.start()

      await campaign.connect(contributor1).contribute({
        value: parseEther('5'),
      })
      await networkHelpers.time.increase(DURATION_DAYS * 24 * 60 * 60)

      await campaign.finalize()

      const totalRaised = await campaign.totalRaised()
      console.log(`    总筹金: ${formatEther(totalRaised)}ETH`)

      const userRaised = await campaign.contributions(await contributor1.getAddress())
      console.log(`    用户筹金: ${formatEther(userRaised)}ETH`)

      const beforeBalance = await ethers.provider.getBalance(contributor1);
      console.log(`    退款前余额: ${formatEther(beforeBalance)} ETH`)
      await campaign.connect(contributor1).refund()
      const afterBalance = await ethers.provider.getBalance(contributor1);
      console.log(`    退款后余额: ${formatEther(afterBalance)} ETH`)
    })
    it('should be refunded failed eth when state is failed and this is another account currently', async () => {
      const {
        campaign,
        owner,
        contributor1,
        contributor2,
        contributor3
      } = await networkHelpers.loadFixture(crowdfundingCampaignFixture)
      await campaign.start()

      await campaign.connect(contributor1).contribute({
        value: parseEther('5'),
      })
      await networkHelpers.time.increase(DURATION_DAYS * 24 * 60 * 60)

      await campaign.finalize()

      const totalRaised = await campaign.totalRaised()
      console.log(`    总筹金: ${formatEther(totalRaised)}ETH`)

      const userRaised = await campaign.contributions(await contributor2.getAddress())
      console.log(`    用户筹金: ${formatEther(userRaised)}ETH`)

      const beforeBalance = await ethers.provider.getBalance(contributor2);
      console.log(`    退款前余额: ${formatEther(beforeBalance)} ETH`)

      await expect(campaign.connect(contributor2).refund())
          .to.revertedWith('insufficient amount')

      const afterBalance = await ethers.provider.getBalance(contributor2);
      console.log(`    退款后余额: ${formatEther(afterBalance)} ETH`)
    })
  })
})