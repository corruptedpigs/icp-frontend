"use client";

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { BrowserProvider } from 'ethers';

const WalletContext = createContext();

const POLYGON_MAINNET = {
  chainId: '0x89', // 137 in decimal
  chainName: 'Polygon Mainnet',
  nativeCurrency: {
    name: 'MATIC',
    symbol: 'MATIC',
    decimals: 18
  },
  rpcUrls: ['https://polygon-rpc.com/'],
  blockExplorerUrls: ['https://polygonscan.com/']
};

const POLYGON_MUMBAI = {
  chainId: '0x13881', // 80001 in decimal
  chainName: 'Polygon Mumbai Testnet',
  nativeCurrency: {
    name: 'MATIC',
    symbol: 'MATIC',
    decimals: 18
  },
  rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
  blockExplorerUrls: ['https://mumbai.polygonscan.com/']
};

export function WalletProvider({ children }) {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const disconnectWallet = useCallback(() => {
    setAccount(null);
    setProvider(null);
    setChainId(null);
  }, []);

  const connectWallet = useCallback(async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      alert('Please install MetaMask or another Web3 wallet to use this feature.');
      return;
    }

    try {
      setIsConnecting(true);
      
      // Request account access
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      const browserProvider = new BrowserProvider(window.ethereum);
      const network = await browserProvider.getNetwork();
      
      setAccount(accounts[0]);
      setProvider(browserProvider);
      setChainId(Number(network.chainId));

      // Check if on Polygon network
      const polygonMainnetId = 137;
      const polygonMumbaiId = 80001;
      
      if (network.chainId !== BigInt(polygonMainnetId) && network.chainId !== BigInt(polygonMumbaiId)) {
        // Try to switch to Polygon Mainnet
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: POLYGON_MAINNET.chainId }],
          });
        } catch (switchError) {
          // This error code indicates that the chain has not been added to MetaMask
          if (switchError.code === 4902) {
            try {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [POLYGON_MAINNET],
              });
            } catch (addError) {
              console.error('Error adding Polygon network:', addError);
            }
          } else {
            console.error('Error switching to Polygon network:', switchError);
          }
        }
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert('Failed to connect wallet. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const handleAccountsChanged = useCallback((accounts) => {
    if (accounts.length === 0) {
      disconnectWallet();
    } else if (accounts[0] !== account) {
      setAccount(accounts[0]);
    }
  }, [account, disconnectWallet]);

  const handleChainChanged = useCallback((newChainId) => {
    setChainId(parseInt(newChainId, 16));
    window.location.reload();
  }, []);

  // Check if wallet is already connected on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' })
        .then(accounts => {
          if (accounts.length > 0) {
            connectWallet();
          }
        });

      // Listen for account changes
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        if (window.ethereum.removeListener) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('chainChanged', handleChainChanged);
        }
      };
    }
  }, [connectWallet, handleAccountsChanged, handleChainChanged]);

  const switchToPolygon = async (testnet = false) => {
    if (!window.ethereum) return;

    const network = testnet ? POLYGON_MUMBAI : POLYGON_MAINNET;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: network.chainId }],
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [network],
          });
        } catch (addError) {
          console.error('Error adding network:', addError);
        }
      }
    }
  };

  const isPolygonNetwork = () => {
    return chainId === 137 || chainId === 80001;
  };

  const value = {
    account,
    provider,
    chainId,
    isConnecting,
    connectWallet,
    disconnectWallet,
    switchToPolygon,
    isPolygonNetwork
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
