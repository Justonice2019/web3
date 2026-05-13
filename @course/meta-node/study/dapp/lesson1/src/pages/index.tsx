import type { NextPage } from 'next';
import Header from '../components/Header';
import {formatUnits} from "viem";
import {useAccount, useBalance, useChains, useSwitchChain} from "wagmi";

const Home: NextPage = () => {
  const {address} = useAccount()
  const {data, error} = useBalance({address})
  const {data: myTokenData, error: mTokenError} = useBalance({address, token: '0xfF20675Fd1DFfbB767824b96108487ADd77988C0'})
  const {chain}: {chain: any} = useAccount()
  const chains = useChains()
  const {switchChain} = useSwitchChain()

  return (
      <>
        <Header/>
        <div>address: {address}</div>
        {
            data && <div>ETH Balance: {data?.formatted} ------- formatted{formatUnits(data?.value, data.decimals)}</div>
        }
        <div>MyToken Balance: {myTokenData?.formatted} ------- {myTokenData?.value}{myTokenData?.symbol}</div>

        {chain && <div>当前chain: {chain.name} - {chain.id}</div>}
        <div>
          {chains.filter(c => c.id !== chain?.id).map((chain) => (
              <div key={chain.id}>
                {chain.name} - {chain.id} - <button onClick={() => switchChain({chainId: chain.id})}>switch to {chain.name}</button>
              </div>
          ))}
        </div>
      </>

  );
};

export default Home;