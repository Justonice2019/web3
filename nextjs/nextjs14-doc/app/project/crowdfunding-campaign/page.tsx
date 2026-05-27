'use client';

import {useWeb3} from './components/Web3Provider'
import {useCallback, useContext, useEffect, useState} from "react";
import {ethers, Contract} from 'ethers'
import crowdfundingFactoryArtifact from '@/lib/artifacts/CrowdfundingFactory.json'
import crowdfundingCampaignArtifact from '@/lib/artifacts/CrowdfundingCampaign.json'
import './page.scss'
import dayjs from 'dayjs'

interface CampaignFactory {
  name?: string;
  goal?: number;
  durationInDays?: number;
}

interface Campaign {
  address: string;
  owner: string;
  name: string;
  goal: bigint;
  totalRaised: bigint;
  deadline: number;
  state: number;
  contributorCount: number;
  processPercent: number;
  contributeValue?: number;
  withdrawValue?: number;
}

enum State {
  就绪,
  活跃,
  成功,
  失败,
  关闭
}


const factoryAddress = '0xc5879212863c685A6efDeC4C0188a2622352FD9a'

export default function Page() {
  const {provider, signer, account, disconnect, isConnecting, connectWallet} = useWeb3()
  const [balance, setBalance] = useState<bigint | undefined>(undefined)

  const [userAddress, setUserAddress] = useState<string>('0xF1DC5Df8114fdd22B43a3925C8A0A768A776D885')

  const [params, setParams] = useState<CampaignFactory>({
    name: '测试活动1',
    goal: 10000,
    durationInDays: 1
  })

  const [campaigns, setCampaigns] = useState<Campaign[]>([])

  const onCreateCampaign = useCallback(async () => {
    const contract = new Contract(factoryAddress, crowdfundingFactoryArtifact.abi, signer)
    const tx = await contract.createCampaign(params.name, params.goal, params.durationInDays)
    const receipt = await tx.wait()
    console.log(receipt)

  }, [params, signer])


  const onViewCampaigns = useCallback(async () => {
    const contract = new Contract(factoryAddress, crowdfundingFactoryArtifact.abi, signer)
    const result = await contract.getCampaigns()
    console.log(result)
  }, [signer])

  const onViewUserCampaigns = useCallback(async () => {
    const contract = new Contract(factoryAddress, crowdfundingFactoryArtifact.abi, signer)
    const result = await contract.getUserCampaigns(userAddress)
    console.log(result)

  }, [signer, userAddress])

  const onViewCampaignCount = useCallback(async () => {
    const contract = new Contract(factoryAddress, crowdfundingFactoryArtifact.abi, signer)
    const result = await contract.getCampaignCount()
    console.log(result)

  }, [signer])

  const onChangeNewCampaign = useCallback((e: any) => {
    const name = e.target.dataset.name
    const value = e.target.value

    setParams({
      ...params,
      [name]: value
    })
  }, [params])

  const onChangeCampaign = useCallback((e: any) => {
    const {name, index} = e.target.dataset
    const value = e.target.value
    const nIndex = Number(index)
    const newCampaign = {
      ...campaigns[nIndex],
      [name]: value
    }
    campaigns.splice(nIndex, 1, newCampaign)
    setCampaigns([...campaigns])
  }, [campaigns])


  const fetchCampaigns = useCallback(async () => {
    if (!provider) {
      return
    }
    const factory = new Contract(factoryAddress, crowdfundingFactoryArtifact.abi, provider);

    const addresses = await factory.getCampaigns()

    const _campaigns: Campaign[] = []
    for (let i = 0; i < addresses.length; i++) {
      const address = addresses[i]
      const campaign = new ethers.Contract(
          address,
          crowdfundingCampaignArtifact.abi,
          provider
      );
      const [owner, name, goal, deadline, totalRaised, state, contributorCount, processPercent] = await Promise.all([
        campaign.owner(),
        campaign.name(),
        campaign.goal(),
        campaign.deadline(),
        campaign.totalRaised(),
        campaign.state(),
        campaign.getContributorCount(),
        campaign.getProgress(),
      ]);
      _campaigns.push({
        address,
        owner,
        name,
        goal,
        totalRaised,
        deadline: Number(deadline),
        state: Number(state),
        contributorCount: Number(contributorCount),
        processPercent: Number(processPercent)
      })
    }
    console.log(_campaigns)
    setCampaigns(_campaigns)

  }, [provider])

  const onStartCampaign = useCallback(async (campaign: Campaign) => {
    try {
      const campaignContract = new Contract(campaign.address, crowdfundingCampaignArtifact.abi, signer)
      const result = await campaignContract.start()
      console.log(result)
    } catch (e: any) {
      console.dir(e)
      window.alert(`${e.code}: ${e.shortMessage}`)
    }
  }, [signer])

  const onContribute = useCallback(async (campaign: Campaign) => {
      const campaignContract = new Contract(campaign.address, crowdfundingCampaignArtifact.abi, signer)
      try {
        const tx = await campaignContract.contribute({
          value: campaign.contributeValue
        })
        const receipt = await tx.wait()
        console.log(receipt)
      } catch (e: any) {
        console.dir(e)
        window.alert(`${e.code}: ${e.shortMessage}`)
      }
  }, [signer])

  const onWithdraw = useCallback(async (campaign: Campaign) => {
      const campaignContract = new Contract(campaign.address, crowdfundingCampaignArtifact.abi, signer)
      try {
        const tx = await campaignContract.withdraw({
          value: campaign.withdrawValue
        })
        const receipt = await tx.wait()
        console.log(receipt)
      } catch (e: any) {
        console.dir(e)
        window.alert(`${e.code}: ${e.shortMessage}`)
      }
  }, [signer])

  const onStop = useCallback(async (campaign: Campaign) => {
      const campaignContract = new Contract(campaign.address, crowdfundingCampaignArtifact.abi, signer)
      try {
        const result = await campaignContract.finalize()
        console.log(result)
      } catch (e: any) {
        console.dir(e)
        window.alert(`${e.code}: ${e.shortMessage}`)
      }
  }, [signer])

  const onRefund = useCallback(async (campaign: Campaign) => {
      const campaignContract = new Contract(campaign.address, crowdfundingCampaignArtifact.abi, signer)
      try {
        const result = await campaignContract.refund()
        console.log(result)
      } catch (e: any) {
        console.dir(e)
        window.alert(`${e.code}: ${e.shortMessage}`)
      }
  }, [signer])

  const onLogContributors = useCallback(async (campaign: Campaign) => {
      const campaignContract = new Contract(campaign.address, crowdfundingCampaignArtifact.abi, signer)
      try {
        const result = await campaignContract.getContributors()
        console.log(result)
      } catch (e: any) {
        console.dir(e)
        window.alert(`${e.code}: ${e.shortMessage}`)
      }
  }, [signer])


  useEffect(() => {

    signer?.getAddress().then(async address => {
      if (address) {
        const _balance = await provider?.getBalance(address);
        setBalance(_balance)
      }
    })

    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCampaigns()

  }, [provider, signer, fetchCampaigns])

  return (<div>
    <div>
      {isConnecting && <div>
        <div>
          <span>账户: {account}</span>
          <button onClick={() => window.open(`https://sepolia.etherscan.io/address/${account}`, '_blank')}>
            在区块浏览器中查看账户交易信息
          </button>
          <button onClick={disconnect}>断开连接</button>
        </div>
        <div>余额: {balance ? `${ethers.formatEther(balance)}ETH` : null} | {balance}</div>
        <div>
          <span>合约地址: {factoryAddress}</span>
        </div>
        <div>
          <input type="text" value={params.name} placeholder="活动名称" data-name="name"
                 onChange={onChangeNewCampaign}/>

          <input type="number" value={params.goal} placeholder="目标" data-name="goal" onChange={onChangeNewCampaign}/>
          <input type="number" value={params.goal} placeholder="目标" data-name="goal" onChange={onChangeCampaign}/>

          <input type="number" value={params.durationInDays} data-name="durationInDays" placeholder="持续天数"
                 onChange={onChangeNewCampaign}/>
          <button onClick={onCreateCampaign}>创建活动</button>
        </div>
        <div>
          <button onClick={onViewCampaigns}>查看所有活动</button>
          <input type="text" value={userAddress} onChange={e => setUserAddress(e.target.value)}/>
          <button onClick={onViewUserCampaigns}>查看指定用户创建的活动</button>
          <button onClick={onViewCampaignCount}>查看活动数量</button>
        </div>
        <input type="number" value={params.name}  data-name="goal"
               onChange={onChangeCampaign}/>

        <div className="campaigns-list">
          {
            campaigns.map((campaign, index) => (<div key={index} className="campaigns-item">
              <div>进度: {campaign.processPercent}%</div>
              <div>地址: {campaign.address}</div>
              <div>拥有者: {campaign.owner}</div>
              <div>活动名: {campaign.name}</div>
              <div>目标: {campaign.goal}wei({ethers.formatEther(campaign.goal)}ETH)</div>
              <div>总筹款: {campaign.totalRaised}wei({ethers.formatEther(campaign.totalRaised)}ETH)</div>
              <div>结束时间: {dayjs(campaign.deadline * 1000).format('YYYY-MM-DD hh:mm:ss')}</div>
              <div>状态: {State[campaign.state]}</div>
              <div>贡献人数: {campaign.contributorCount}</div>
              <div className="opt">
                <div>
                  <button onClick={() => onStartCampaign(campaign)}>开始</button>
                  <button onClick={() => onStop(campaign)}>终止</button>
                  <button onClick={() => onRefund(campaign)}>退款</button>
                  <button onClick={() => onLogContributors(campaign)}>输出贡献者</button>
                </div>
                <div>
                  <input type="number" value={campaign.contributeValue} data-index={index} data-name="contributeValue"
                         onChange={onChangeCampaign}/>
                  wei
                  <button onClick={() => onContribute(campaign)}>捐献</button>
                </div>
                <div>
                  <input type="number" value={campaign.withdrawValue} data-index={index} data-name="withdrawValue" onChange={onChangeCampaign}/>
                  wei
                  <button onClick={() => onWithdraw(campaign)}>取款</button>
                </div>
              </div>
            </div>))
          }
        </div>
      </div>}
      {!isConnecting && <div>
        <button onClick={connectWallet}>连接钱包</button>
      </div>}
    </div>
  </div>)
};