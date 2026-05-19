[my-hardhat3-project](..%2F%40course%2Fmeta-node%2Fstudy%2Fsolidity%2Fsolidity_lesson%2Fmy-hardhat3-project%2Fnote.md)

# 使用指南

## 开启本地网络
````shell
npx hardhat node
````

## 连接网络
````ts
import hre from 'hardhat'
const {ethers, networkHelpers} = await hre.network.connect({
  network: 'localhost',
  chainType: 'l1'
})
````

## 首次编译
````shell
npx hardhat compile
````

## 定义快照
````ts
const crowdfundingCampaignFixture = async () => {
  const [owner, contributor1, contributor2, contributor3] = await ethers.getSigners()

  // const contract = await ethers.deployContract('CrowdfundingCampaign', [owner, 'test', ethers.parseEther('1'), 3n])
  const contractFactory = await ethers.getContractFactory('CrowdfundingCampaign')
  const contract = await contractFactory.deploy(owner, 'test', ethers.parseEther('1'), 3n)

  return {
    contract,
    owner,
    contributor1,
    contributor2,
    contributor3
  }
}
````

## 部署合约
````ts
describe('CrowdfundingCampaign', () => {
  it('部署合约', async () => {
    const {contract} = await networkHelpers.loadFixture(crowdfundingCampaignFixture)
    expect(ethers.isAddress(await contract.getAddress())).to.be.true
  })
})
````

# API参考
[hardhat3-doc](..%2F%40course%2Fmeta-node%2Fstudy%2Fsolidity%2Fsolidity_lesson%2Fmy-hardhat3-project%2Ftest%2Fhardhat3-doc)

# 注意事项
* import进来的依赖库需要npm安装,不使用到当前项目.dep 中的依赖(这个.dep应该是remix自动下载下来的)