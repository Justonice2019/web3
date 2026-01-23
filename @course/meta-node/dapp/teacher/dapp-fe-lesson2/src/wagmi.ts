import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'viem';
import {
  mainnet,
  optimism,
  polygon,
  sepolia,
} from 'wagmi/chains';
console.log(process.env.WalletConnectId)
export const config = getDefaultConfig({
  appName: 'RainbowKit App',
  projectId: '94066ab3be2718981f226c7407038ba4',
  chains: [
    mainnet,
    sepolia,
  ],
  transports: {
    [mainnet.id]: http('https://mainnet.infura.io/v3/d8ed0bd1de8242d998a1405b6932ab33'),
    [sepolia.id]: http('https://sepolia.infura.io/v3/d8ed0bd1de8242d998a1405b6932ab33')
  },
  ssr: true,
});