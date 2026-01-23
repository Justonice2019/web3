import { useReadContract, useAccount } from 'wagmi'
import { abi } from '../../abis/abi'
// import {stakeAbi} from "../../abis/abi-stake";
import {stakeAbi} from "../../abis/stakeAbi2";

// console.log(stakeAbi.filter((s: any) => s.type === 'function'))

export default function Page() {
  const account = useAccount()
  const result = useReadContract({
    abi,
    // abi:stakeAbi,
    address: '0x01fC441BeFb115906e3D27d39C2155fF106e80B2',
    functionName: 'getBalance'
  })
  console.log(result)

  // const account = useAccount()
  // const result = useReadContract({
  //   abi: stakeAbi,
  //   address: '0x6b175474e89094c44da98b954eedeac495271d0f',
  //   functionName: 'stakingBalance',
  //   args: [BigInt(0), account.address!],
  //   query: { enabled: Boolean(account.address) }
  // })
  return (
    <div>

    </div>
  )
}