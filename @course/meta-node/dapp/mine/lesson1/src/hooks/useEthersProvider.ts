import { type Config, getClient } from '@wagmi/core'
import {FallbackProvider, JsonRpcProvider} from 'ethers'
import type { Client, Chain, Transport } from 'viem'

export function clientToProvider(client: Client<Transport, Chain>) {
  const { chain, transport } = client
  const netWork = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  }
  // if (transport.type === "fallback") {
  //
  // }
  return new JsonRpcProvider(transport.url, netWork)
}