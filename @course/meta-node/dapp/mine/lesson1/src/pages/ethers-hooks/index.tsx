import useContract from '../../hooks/useContract'
import {useEthersSigner} from "../../hooks/useEthersSigner";
import {sepolia} from "wagmi/chains";
import {useCallback, useEffect, useState} from 'react'
import {useAccount} from "wagmi";
import Header from "../../components/Header";
import * as constants from "../../constants";

export default function Page () {
  const signer = useEthersSigner({ chainId: sepolia.id })
  const bankContract = useContract(constants.bankContractAddress, signer);
  const {address} = useAccount()

  const [balance, setBalance] = useState<bigint>()
  const [depositAmount, setDepositAmount] = useState<string>()
  const [withdrawAmount, setWithdrawAmount] = useState<string>()

  const onGetBalance = useCallback(async () => {
    const balance = await bankContract.getBalance();
    setBalance(balance)
  }, [bankContract])

  const onClickDeposit = useCallback(async () => {
    if (!depositAmount) {
      return
    }
    const tx = await bankContract.deposit({
      value: BigInt(depositAmount), // 存入金额需要转换为 wei
    });
    console.log(tx)
    const receipt = await tx.wait();
    console.log(receipt)
    await onGetBalance()
  }, [bankContract, depositAmount, onGetBalance])
  const onClickWithdraw = useCallback(async () => {
    if (!withdrawAmount) {
      return
    }
    console.log(bankContract)
    const tx = await bankContract.withdraw(BigInt(withdrawAmount));
    console.log(tx)
    const receipt = await tx.wait();
    console.log(receipt)
    await onGetBalance()
  }, [bankContract, onGetBalance, withdrawAmount])

  return (<div>
    <Header />
    {
      address && <div>
            <div>
                <span>余额: {balance}</span>
                <button onClick={onGetBalance}>获取余额</button>
            </div>
            <div>
                <span>存入金额: <input placeholder="请输入存入金额" value={depositAmount}
                                       onChange={e => setDepositAmount(e.target.value)}/></span>
                <span>wei</span>
                <button onClick={onClickDeposit}>存入</button>
            </div>
            <div>
                <span>取出金额: <input placeholder="请输入取出金额" value={withdrawAmount}
                                       onChange={e => setWithdrawAmount(e.target.value)}/></span>
                <span>wei</span>
                <button onClick={onClickWithdraw}>取出</button>
            </div>
        </div>
    }
  </div>)
};