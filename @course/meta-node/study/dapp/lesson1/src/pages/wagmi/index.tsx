import {useCallback, useState} from 'react'
import {
  useReadContract,
  useAccount,
  usePublicClient,
  useSignMessage,
  useReadContracts,
  useWriteContract,
  useWaitForTransactionReceipt
} from 'wagmi'
import {bankAbi} from '../../abis/bankAbi'
import * as constants from '../../constants'
import {formatEther, parseEther, parseUnits} from "viem";
import Header from "../../components/Header";

export default function Page() {
  const [balance, setBalance] = useState<bigint | null>(null)
  const [balances, setBalances] = useState<Array<bigint | null>>([])
  const [signData, setSignData] = useState<string>()
  const [depositAmount, setDepositAmount] = useState<string>()
  const [withdrawAmount, setWithdrawAmount] = useState<string>()

  const account = useAccount()
  const publicClient = usePublicClient()
  const writeContractObj = useWriteContract()
  const transResult = useWaitForTransactionReceipt({
    hash: writeContractObj?.data,
  })
  const { signMessage } = useSignMessage()


  const result = useReadContract({
    abi: bankAbi,
    address: constants.bankContractAddress,
    functionName: 'getBalance',
    account: account.address as `0x${string}`,
    query: {
      enabled: Boolean(account.address),
    }
  })

  const onGetBalance = useCallback(async () => {
    const data = await publicClient?.readContract({
      address: constants.bankContractAddress,
      abi: bankAbi,
      functionName: 'getBalance',
      account: account.address as `0x${string}`,
    })
    setBalance(data as bigint);
  }, [account.address, publicClient])

  const onGetMultiBalance = useCallback(async () => {
    const data = await publicClient?.multicall({
      contracts: [
        {
          address: constants.bankContractAddress,
          abi: bankAbi,
          functionName: 'getBalance',
        }
      ],
      account: account.address as `0x${string}`,
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
    // writeContractObj.writeContract({
    const hash = await writeContractObj.writeContractAsync({
      address: constants.bankContractAddress,
      abi: bankAbi,
      functionName: 'deposit',
      account: account.address as `0x${string}`,
      // value: parseEther(depositAmount), // 存入金额需要转换为 ether
      value: BigInt(depositAmount), // 存入金额需要转换为 wei
    })
    const receipt = await publicClient?.waitForTransactionReceipt({
      hash,
    })
    if (receipt?.status === 'success') {
      await onGetBalance()
    }
    console.log(receipt);
  }, [account.address, publicClient, depositAmount])

  const onClickWithdraw = useCallback(async () => {
    if (!withdrawAmount) {
      return
    }
    // writeContractObj.writeContract({
    const hash = await writeContractObj.writeContractAsync({
      address: constants.bankContractAddress,
      abi: bankAbi,
      functionName: 'withdraw',
      account: account.address as `0x${string}`,
      args: [
          BigInt(withdrawAmount),
      ]
    })
    const receipt = await publicClient?.waitForTransactionReceipt({
      hash,
    })
    if (receipt?.status === 'success') {
      await onGetBalance()
    }
    console.log(receipt);
  }, [account.address, publicClient, withdrawAmount, onGetBalance])

  return (
      <div>
        <Header />
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
                <span>交易状态: {transResult?.status}</span>
            </div>
            <div>
                <span>取出金额: <input placeholder="请输入取出金额" value={withdrawAmount} onChange={e => setWithdrawAmount(e.target.value)} /></span>
                <span>wei</span>
                <button onClick={onClickWithdraw}>取出</button>
            </div>
        </div>}
      </div>
  )
}
