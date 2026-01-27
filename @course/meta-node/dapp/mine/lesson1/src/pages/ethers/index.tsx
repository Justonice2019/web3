import useContract from '../../hooks/useContract'
import {useEthersSigner} from "../../hooks/useEthersSigner";
import {sepolia} from "wagmi/chains";
import {useEffect} from 'react'
import {getBankContract} from "./demo";
import {useAccount} from "wagmi";
import Header from "../../components/Header";
import * as constants from "../../constants";

export default function Page () {
  const signer = useEthersSigner({ chainId: sepolia.id })
  const bankContract = useContract(constants.bankContractAddress, signer);
  const {address} = useAccount()

  useEffect(() => {
    ;(async () => {
      if (bankContract && address) {
        console.log(bankContract , address)
        const balance = await bankContract.getBalance();
        console.log(balance)
      }

    })()
  }, [address, bankContract])


  const onGetBalance2 = async () => {
    const bankContract = await getBankContract()
    console.log(bankContract.getBalance)
    console.log(bankContract.deposit)
    const balance = await bankContract.getBalance()
    console.log(balance)
  }

  return (<div>
    <Header />
    <button onClick={async () => {
      const res = await bankContract.getBalance()
      // const balance = await bankContract.getBalance()
      console.log(res)
    }}>获取余额</button>
    {
      address && <div>
            <div>当前地址: {address}</div>
            <button onClick={onGetBalance2}>获取余额22</button>
        </div>
    }
  </div>)
};