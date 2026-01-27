import {useEthersProvider} from './useEthersProvider'
import {mainnet, sepolia} from "wagmi/chains";
import {Contract, JsonRpcSigner, Signer} from "ethers";
import {abiBank} from "../abis/abi-bank";


const useBankContract = (contractAddress: string, signer?: JsonRpcSigner | undefined,) => {
  const provider = useEthersProvider({
    chainId: sepolia.id,
  })
  return new Contract(contractAddress, abiBank, signer || provider)
}

export default useBankContract