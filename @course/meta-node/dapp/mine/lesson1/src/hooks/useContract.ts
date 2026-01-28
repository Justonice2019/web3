import {useEthersProvider} from './useEthersProvider'
import {mainnet, sepolia} from "wagmi/chains";
import {Contract, JsonRpcSigner, Signer} from "ethers";
import {bankAbi} from "../abis/bankAbi";

const useBankContract = (contractAddress: string, signer?: JsonRpcSigner | undefined,) => {
  const provider = useEthersProvider({
    chainId: sepolia.id,
  })
  return new Contract(contractAddress, bankAbi, signer || provider)
}

export default useBankContract