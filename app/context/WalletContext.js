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

const POLYGON_AMOY = {
  chainId: '0x13882', // 80002 in decimal
  chainName: 'Polygon Amoy Testnet',
  nativeCurrency: {
    name: 'MATIC',
    symbol: 'MATIC',
    decimals: 18
  },
  rpcUrls: ['https://rpc-amoy.polygon.technology/'],
  blockExplorerUrls: ['https://amoy.polygonscan.com/']
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
      console.error('Web3 wallet not found. Please install MetaMask or another Web3 wallet.');
      return false;
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
      const polygonAmoyId = 80002;
      
      if (network.chainId !== BigInt(polygonMainnetId) && network.chainId !== BigInt(polygonAmoyId)) {
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
      return true;
    } catch (error) {
      console.error('Error connecting wallet:', error);
      return false;
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
  }, []);

  // Check if wallet is already connected on mount
  useEffect(() => {
    const initWallet = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            // Initialize wallet connection without calling connectWallet to avoid infinite loop
            const browserProvider = new BrowserProvider(window.ethereum);
            const network = await browserProvider.getNetwork();
            
            setAccount(accounts[0]);
            setProvider(browserProvider);
            setChainId(Number(network.chainId));
          }
        } catch (error) {
          console.error('Error checking wallet connection:', error);
        }

        // Listen for account changes
        window.ethereum.on('accountsChanged', handleAccountsChanged);
        window.ethereum.on('chainChanged', handleChainChanged);
      }
    };

    initWallet();

    return () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        window.ethereum.removeEventListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeEventListener('chainChanged', handleChainChanged);
      }
    };
  }, [handleAccountsChanged, handleChainChanged]);

  const switchToPolygon = async (testnet = false) => {
    if (!window.ethereum) return;

    const network = testnet ? POLYGON_AMOY : POLYGON_MAINNET;

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
    return chainId === 137 || chainId === 80002;
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
