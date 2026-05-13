import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  arbitrum,
  base,
  mainnet,
  optimism,
  polygon,
  sepolia,
} from 'wagmi/chains';

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
    // [sepolia.id]: http('https://sepolia.infura.io/v3/e13648d8a1f64b839a17533b1bd2d981')
    // [sepolia.id]: http('https://api.zan.top/eth-sepolia')
  // },
  ssr: true,
});
