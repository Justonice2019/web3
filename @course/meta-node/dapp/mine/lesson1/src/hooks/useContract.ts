import {useEthersProvider} from './useEthersProvider'
import {mainnet, sepolia} from "wagmi/chains";
import { createConfig, http } from '@wagmi/core'
import {bankContractAddress} from "../utils";
import {Contract, Signer} from "ethers";
import {abiBank} from "../abis/abi-bank";



// console.log(getEthersProvider(config, {
//   chainId: sepolia.id,
// }))
const useBankContract = (signer?: Signer) => {
  const provider = useEthersProvider({
    chainId: sepolia.id,
  })
  return new Contract(bankContractAddress, abiBank, signer || provider)

}

export {
  useBankContract,
}