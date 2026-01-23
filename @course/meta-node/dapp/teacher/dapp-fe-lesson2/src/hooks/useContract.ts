import { Contract, Signer, Provider, JsonRpcProvider } from 'ethers'
import { RccStakeContract } from '../utils'
import { stakeAbi } from '../abis/stakeAbi'
import { useEthersProvider } from './useEthersProvider'
import { sepolia } from 'viem/chains'

const useStakeContract = (signer?: Signer) => {
  const provider = useEthersProvider({ chainId: sepolia.id })
  console.log(provider, 'p')
  return new Contract(RccStakeContract, stakeAbi, signer || provider)
}
// 0x6b175474e89094c44da98b954eedeac495271d0f
export {
  useStakeContract
}