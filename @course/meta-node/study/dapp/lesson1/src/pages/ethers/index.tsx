import {useEthersSigner} from "../../hooks/useEthersSigner";
import {sepolia} from "wagmi/chains";
import {useCallback, useEffect, useState, useRef} from 'react'
import {useAccount} from "wagmi";
import Header from "../../components/Header";
import {getBankContract} from "../../contracts/bankContract/bankContract";
import {Contract} from "ethers";

export default function Page () {
  const [bankContract, setBankContract] = useState<Contract | null>(null)
  const {address} = useAccount()

  const [balance, setBalance] = useState<bigint>()
  const [depositAmount, setDepositAmount] = useState<string>()
  const [withdrawAmount, setWithdrawAmount] = useState<string>()

  useEffect(() => {
    ;(async () => {
      if (address) {
        const _bankContract = await getBankContract()
        setBankContract(_bankContract)
      }
    })()
  }, [address])

  const onGetBalance = useCallback(async () => {
    const balance = await bankContract?.getBalance();
    setBalance(balance)
  }, [bankContract])

  const onClickDeposit = useCallback(async () => {
    if (!depositAmount) {
      return
    }
    try {
      console.log(bankContract)
      const tx = await bankContract?.deposit({
        value: BigInt(depositAmount), // 存入金额需要转换为 wei
      });
      console.log(tx)
      const receipt = await tx.wait();
      console.log(receipt)
      await onGetBalance()
    } catch (e) {
      console.log(e)
    }
  }, [bankContract, depositAmount, onGetBalance])
  const onClickWithdraw = useCallback(async () => {
    if (!withdrawAmount) {
      return
    }
    try {
      console.log(bankContract)
      const tx = await bankContract?.withdraw(BigInt(withdrawAmount));
      console.log(tx)
      const receipt = await tx.wait();
      console.log(receipt)
      await onGetBalance()
    } catch (e) {
      console.log(e)
    }
  }, [bankContract, onGetBalance, withdrawAmount])
  console.log(address , bankContract)
  return (<div>
    <Header />

    {
      address && bankContract && <div>
            <div>
                <span>contract address: {bankContract.target.toString()}</span>
            </div>
            <div>
                <span>account address: {address}</span>
            </div>
            <div>
            <span>balance: {balance}wei</span>
                <button onClick={onGetBalance}>getBalance</button>
            </div>
            <div>
                <span>deposit: <input placeholder="please input deposit amount" value={depositAmount}
                                       onChange={e => setDepositAmount(e.target.value)}/></span>
                <span>wei</span>
                <button onClick={onClickDeposit}>deposit()</button>
            </div>
            <div>
                <span>withdraw: <input placeholder="please input withdraw amount" value={withdrawAmount}
                                       onChange={e => setWithdrawAmount(e.target.value)}/></span>
                <span>wei</span>
                <button onClick={onClickWithdraw}>withdraw(unit256)</button>
            </div>
        </div>
    }
  </div>)
};