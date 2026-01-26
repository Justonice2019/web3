import {useCallback, useState} from 'react'
import {useReadContract, useAccount, usePublicClient, useSignMessage, useReadContracts, useWriteContract} from 'wagmi'
import {abiBank} from '../../abis/abi-bank'
import {bankContractAddress} from '../../utils'
import {formatEther, parseEther, parseUnits} from "viem";

export default function Page() {
  const [balance, setBalance] = useState<bigint | null>(null)
  const [balances, setBalances] = useState<Array<bigint | null>>([])
  const [signData, setSignData] = useState<string>()
  const [depositAmount, setDepositAmount] = useState<string>()

  const account = useAccount()
  const publicClient = usePublicClient()
  const writeContractObj = useWriteContract()
  const { signMessage } = useSignMessage()


  const result = useReadContract({
    abi: abiBank,
    address: bankContractAddress,
    functionName: 'getBalance',
    account: account.address as `0x${string}`,
    query: {
      enabled: Boolean(account.address),
    }
  })

  const onGetBalance = useCallback(async () => {
    const data = await publicClient?.readContract({
      address: bankContractAddress,
      abi: abiBank,
      functionName: 'getBalance',
      account: account.address as `0x${string}`,
    })
    setBalance(data as bigint);
  }, [account.address, publicClient])

  const onGetMultiBalance = useCallback(async () => {
    const data = await publicClient?.multicall({
      contracts: [
        {
          address: bankContractAddress,
          abi: abiBank,
          functionName: 'getBalance',
        }
      ],
      account: account.address,
    })
    const newBalances = [
        ...balances
    ]
    const balancesList = data?.map(d => d.result) as Array<bigint>
    newBalances.push(...balancesList)
    setBalances(newBalances)
  }, [account.address, publicClient])

  const onSignMessage = useCallback(() => {
    const res = signMessage({
      message: 'Hello',
    }, {
      onSuccess: (data) => {
        setSignData(data)
      }
    })
    console.log(res)
  }, [signMessage])

  const onClickDeposit = useCallback(async () => {
    if (!depositAmount) {
      return
    }
    const hash = writeContractObj.writeContract({
      address: bankContractAddress,
      abi: abiBank,
      functionName: 'deposit',
      account: account.address as `0x${string}`,
      // value: parseEther(depositAmount), // 存入金额需要转换为 ether
      value: BigInt(depositAmount), // 存入金额需要转换为 wei
    })
    console.log(hash)

  }, [account.address, publicClient, depositAmount])

  return (
      <div>
        {account.address && <div>
            <div>当前地址: {account.address}</div>
            <div>余额: {result.data as bigint}</div>
            <div>
                <span>获取余额: {balance};</span>
                <button onClick={onGetBalance}>获取余额(单个合约)</button>
            </div>
            <div>
                <span>获取余额: {balances?.join(', ')};</span>
                <button onClick={onGetMultiBalance}>获取余额(多个合约)</button>
            </div>
            <div>
                <span>签名消息: {signData ? `${signData.slice(0, 80)}...` : ''}</span>
                <button onClick={onSignMessage}>签名消息</button>
            </div>
            <div>
                <span>存入金额: <input placeholder="请输入存入金额" value={depositAmount} onChange={e => setDepositAmount(e.target.value)} /></span>
                <span>wei</span>
                <button onClick={onClickDeposit}>存入</button>
            </div>
        </div>}
      </div>
  )
}
