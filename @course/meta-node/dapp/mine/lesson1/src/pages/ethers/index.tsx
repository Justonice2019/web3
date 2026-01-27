import {useBankContract} from '../../hooks/useContract'
import {useEthersSigner} from "../../hooks/useEthersSigner";
import {sepolia} from "wagmi/chains";
import {useEffect} from 'react'

export default function Page () {
  const signer = useEthersSigner({ chainId: sepolia.id })
  const bankContract = useBankContract(signer);

  return (<div>
    <button onClick={async () => {
      const res = await bankContract.getBalance()
      // const balance = await bankContract.getBalance()
      console.log(res)
    }}>获取余额</button>
  </div>)
};