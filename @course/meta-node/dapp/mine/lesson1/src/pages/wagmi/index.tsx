import {useCallback, useState} from 'react'
import {useReadContract, useAccount, usePublicClient} from 'wagmi'
import {abiBank} from '../../abis/abi'

export default function Page() {
  const account = useAccount()
  const publicClient = usePublicClient()

  const result = useReadContract({
    abi: abiBank,
    address: '0x947a31dD8cff2F23C9D188079dD1a3E3471D8903',
    functionName: 'getBalance',
    account: account.address as `0x${string}`,
    query: {
      enabled: true, // 只有点击按钮后才启用
    }
  })
  const [balance, setBalance] = useState<bigint | null>(null)

  const onGetBalance = useCallback(async () => {
    const data = await publicClient?.readContract({
      address: '0x947a31dD8cff2F23C9D188079dD1a3E3471D8903',
      abi: abiBank,
      functionName: 'getBalance',
      account: account.address as `0x${string}`,
    })
    setBalance(data as bigint);
  }, [account.address, publicClient])

  return (
      <div>
        {account.address && <div>
            <div>当前地址: {account.address}</div>
            <div>余额: {result.data as bigint}</div>
            <span>余额: {balance};</span>
            <button onClick={onGetBalance}>获取余额</button>
        </div>}
      </div>
  )
}
