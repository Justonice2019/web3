import {useAccount, useChains, useSwitchChain} from 'wagmi'

const Switcher = () => {
  // console.log(useAccount())
  // console.log(useChains())
  // console.log(useSwitchChain())

  const {chain}: {chain: any} = useAccount()
  const chains = useChains()
  const {switchChain} = useSwitchChain()

  return (
    <div className="switcher-container">
      {chain && <div>当前: chain: {chain.name} - {chain.id}</div>}
      <div>
        {chains.filter(c => c.id !== chain?.id).map((chain) => (
          <div key={chain.id}>
            {chain.name} - {chain.id} - <button onClick={() => switchChain({chainId: chain.id})}>switch to {chain.name}</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Switcher;
