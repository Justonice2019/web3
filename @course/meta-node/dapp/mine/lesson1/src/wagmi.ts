import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  arbitrum,
  base,
  mainnet,
  optimism,
  polygon,
  sepolia,
} from 'wagmi/chains';
import {http} from "@wagmi/core";

export const config = getDefaultConfig({
  appName: 'RainbowKit App',
  projectId: '7e484de4f705a3eeb3a1a6f9cf270174',
  chains: [
    mainnet,
    polygon,
    optimism,
    arbitrum,
    base,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [sepolia] : []),
  ],
  // transports: {
    // 使用公共 RPC 端点而不是 Infura
    // [mainnet.id]: http('https://ethereum.publicnode.com'),
    // [polygon.id]: http('https://polygon.publicnode.com'),
    // [optimism.id]: http('https://optimism.publicnode.com'),
    // [arbitrum.id]: http('https://arbitrum.publicnode.com'),
    // [base.id]: http('https://base.publicnode.com'),
    // [sepolia.id]: http('https://sepolia.publicnode.com'),
  // },
  ssr: true,
});
