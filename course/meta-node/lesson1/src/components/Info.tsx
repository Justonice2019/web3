import {useAccount, useBalance} from 'wagmi'
import { formatUnits, parseUnits } from "viem"
const Info = () => {
  const {address} = useAccount()

  // console.log(useAccount())
  // console.log(useBalance({address}))

  const {data, error} = useBalance({address})
  console.log(data)
  const {data: myTokenData, error: mTokenError} = useBalance({address, token: '0xfF20675Fd1DFfbB767824b96108487ADd77988C0'})
  console.log(myTokenData)
  return (
      <div className="info-container">
        <div>address: {address}</div>
        {
            data && <div>ETH Balance: {data?.formatted} ------- formatted{formatUnits(data?.value, data.decimals)}</div>
        }
        <div>MyToken Balance: {myTokenData?.formatted} ------- {myTokenData?.value}{myTokenData?.symbol}</div>
      </div>
  )
}


export default Info