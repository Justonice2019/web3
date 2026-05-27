'use client';

import {createContext, useContext, useState, useEffect, ReactNode, useCallback} from 'react';
import {ethers} from 'ethers';

interface Web3ContextType {
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  account: string | null;
  disconnect: () => void;
  connectWallet: () => void;
  isConnecting: boolean;
}

const web3Context = createContext<Web3ContextType | undefined>(undefined);

export function Web3Provider({children}: { children: ReactNode }) {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const switchToSepolia = async () => {
    if (!window.ethereum) return;
    const sepoliaChainId = 11155111n; // const sepoliaChainId = 137n // 必须为未添加到自己账户的网络 或者 提前把它删除

    const hex = `0x${sepoliaChainId.toString(16)}`
    try {
      await window.ethereum?.request({
        method: 'wallet_switchEthereumChain',
        params: [{chainId: hex}]
      })
    } catch (switchError: any) {
      try {
        await window.ethereum?.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: hex,
              chainName: 'Sepolia',
              nativeCurrency: {
                name: 'ETH',
                symbol: 'ETH',
                decimals: 18,
              },
              rpcUrls: ['https://eth-sepolia.g.alchemy.com/v2/H4vxeR7OW504TIwbgxbthdqf0WyIkILu'],
              blockExplorerUrls: ['https://sepolia.etherscan.io'],
            },
          ],
        });
      } catch (addError) {
        console.error('Error adding Sepolia network:', addError);
        throw addError;
      }
    }
  };

  const disconnect = () => {
    setAccount(null);
    setSigner(null);
    setIsConnecting(false)
  };

  const connectWallet = useCallback(() => {
    if (!window.ethereum) {
      window.prompt('未检测到 ethereum')
      return
    }
    const _provider = new ethers.BrowserProvider(window.ethereum)
    _provider.getNetwork().then(async network => {
      const expectChainId = 11155111n
      if (network.chainId !== expectChainId) {
        await switchToSepolia()
      }
      setProvider(_provider)
      // const accounts= await _provider.send('eth_requestAccounts', [])
      const accounts= await _provider.send('eth_requestAccounts', [])
      // const accounts= await window.ethereum?.request({
      //   method: 'eth_requestAccounts',
      // })
      if (accounts.length > 0) {
        setAccount(accounts[0])
        setSigner(await _provider.getSigner())
      }
      setIsConnecting(true)
    })
  }, [])

  useEffect(() => {
    window.ethereum?.on('accountsChanged', accounts => {
      console.log(accounts)
    })
    connectWallet()


  }, [connectWallet]);

  return (<web3Context.Provider
      value={{
        provider,
        signer,
        account,
        disconnect,
        isConnecting,
        connectWallet
      }}>
    {children}
  </web3Context.Provider>)
}

export function useWeb3() {
  const context = useContext(web3Context)
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
}