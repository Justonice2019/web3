import {useCallback, useState} from 'react'
import {useReadContract, useAccount, usePublicClient, useReadContracts} from 'wagmi'
import {abiBank1, abiBank2} from '../../abis/abi-bank'

export default function Page() {
  const [balance, setBalance] = useState<bigint | null>(null)
  const [balances, setBalances] = useState<Array<bigint | null>>([])

  const account = useAccount()
  const publicClient = usePublicClient()

  const result = useReadContract({
    abi: abiBank1,
    address: '0x947a31dD8cff2F23C9D188079dD1a3E3471D8903',
    functionName: 'getBalance',
    account: account.address as `0x${string}`,
    query: {
      enabled: Boolean(account.address),
    }
  })
  // const result2 = useReadContracts({
  //   contracts: [
  //     {
  //       abi: abiBank1,
  //       address: '0x947a31dD8cff2F23C9D188079dD1a3E3471D8903',
  //       functionName: 'getBalance',
  //     }
  //   ],
  //   account: account.address as `0x${string}`,
  // })
  // console.log(result2)

  const onGetBalance = useCallback(async () => {
    const data = await publicClient?.readContract({
      address: '0x947a31dD8cff2F23C9D188079dD1a3E3471D8903',
      abi: abiBank1,
      functionName: 'getBalance',
      account: account.address as `0x${string}`,
    })
    console.log(data)
    setBalance(data as bigint);
  }, [account.address, publicClient])

  const onGetMultiBalance = useCallback(async () => {
    const data = await publicClient?.multicall({
      contracts: [
        {
          address: '0x947a31dD8cff2F23C9D188079dD1a3E3471D8903',
          abi: abiBank1,
          functionName: 'getBalance',
        }
      ],
      account: account.address,
    })
    const newBalances = [
        ...balances
    ]
    const balancesList = data?.map(d => d.result as bigint) as Array<bigint>
    newBalances.push(...balancesList)
    setBalances(newBalances)
  }, [account.address, publicClient])

  return (
      <div>
        {account.address && <div>
            <div>当前地址: {account.address}</div>
            <div>余额: {result.data as bigint}</div>
            <div>
                <span>余额: {balance};</span>
                <button onClick={onGetBalance}>获取余额(单个合约)</button>
            </div>
            <div>
                <span>余额: {balances?.join(', ')};</span>
                <button onClick={onGetMultiBalance}>获取余额(多个合约)</button>
            </div>
        </div>}
      </div>
  )
}
