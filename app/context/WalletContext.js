"use client";

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { BrowserProvider, Contract, formatUnits } from 'ethers';

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

// const POLYGON_AMOY = {
//   chainId: '0x13882', // 80002 in decimal
//   chainName: 'Polygon Amoy Testnet',
//   nativeCurrency: {
//     name: 'MATIC',
//     symbol: 'MATIC',
//     decimals: 18
//   },
//   rpcUrls: ['https://rpc-amoy.polygon.technology/'],
//   blockExplorerUrls: ['https://amoy.polygonscan.com/']
// };

// Chain IDs as constants for reuse
const POLYGON_MAINNET_ID = 137;
const POLYGON_AMOY_ID = 80002;
const DEFAULT_TRACKED_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_TRACKED_TOKEN_ADDRESS || '0x1E60032C0b93b5A8A0F3eD485cb35DBfE86972a5';
const DEFAULT_TRACKED_TOKEN_SYMBOL = process.env.NEXT_PUBLIC_TRACKED_TOKEN_SYMBOL || 'TOKEN';
const DEFAULT_TRACKED_TOKEN_DECIMALS = Number(process.env.NEXT_PUBLIC_TRACKED_TOKEN_DECIMALS || 18);
const DEFAULT_NFT_ADDRESS = process.env.NEXT_PUBLIC_TRACKED_NFT_ADDRESS || '0xc03B2ed81Cfce282D5cd921D429262f7cca3651f';

const ERC20_ABI = [
  'function balanceOf(address) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function approve(address,uint256) returns (bool)',
  'function allowance(address,address) view returns (uint256)'
];

const NFT_ABI = [
  'function mintOne()',
  'function mintPacks(uint256)',
  'function name() view returns (string)',
  'function saleActive() view returns (bool)',
  'function ownerOf(uint256) view returns (address)',
  'function unityPrice() view returns (uint256)',
  'function packPrice() view returns (uint256)',
  'function PACK_SIZE() view returns (uint256)',
  'function totalMinted() view returns (uint256)'
];

export function WalletProvider({ children }) {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [trackedTokenAddress, setTrackedTokenAddress] = useState(DEFAULT_TRACKED_TOKEN_ADDRESS);
  const [trackedTokenDecimals, setTrackedTokenDecimals] = useState(Number.isFinite(DEFAULT_TRACKED_TOKEN_DECIMALS) ? DEFAULT_TRACKED_TOKEN_DECIMALS : 18);
  const [tokenBalance, setTokenBalance] = useState(null);
  const [tokenSymbol, setTokenSymbol] = useState(DEFAULT_TRACKED_TOKEN_SYMBOL);
  const [isTokenBalanceLoading, setIsTokenBalanceLoading] = useState(false);

  const disconnectWallet = useCallback(async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        await window.ethereum.request({
          method: 'wallet_revokePermissions',
          params: [{ eth_accounts: {} }],
        });
      } catch {
        // wallet_revokePermissions is not supported by all wallets; state is cleared regardless
      }
    }
    setAccount(null);
    setProvider(null);
    setChainId(null);
    setTokenBalance(null);
  }, []);

  const setTrackedToken = useCallback((address, defaultSymbol = DEFAULT_TRACKED_TOKEN_SYMBOL, defaultDecimals = 18) => {
    setTrackedTokenAddress(address || '');
    setTokenSymbol(defaultSymbol || DEFAULT_TRACKED_TOKEN_SYMBOL);
    setTrackedTokenDecimals(Number.isFinite(Number(defaultDecimals)) ? Number(defaultDecimals) : 18);
    setTokenBalance(null);
  }, []);

  const isPolygonNetwork = useCallback(() => {
    // console.log('Checking if on Polygon network. Current chainId:', chainId);
    return chainId === POLYGON_MAINNET_ID || chainId === POLYGON_AMOY_ID;
  }, [chainId]);

  const refreshTrackedTokenBalance = useCallback(async (walletAddress = account, walletProvider = provider) => {
    if (!walletAddress || !walletProvider || !trackedTokenAddress) {
      setTokenBalance(null);
      return;
    }

    try {
      setIsTokenBalanceLoading(true);
      const tokenContract = new Contract(trackedTokenAddress, ERC20_ABI, walletProvider);
      const [rawBalance, decimals, symbol] = await Promise.all([
        tokenContract.balanceOf(walletAddress),
        tokenContract.decimals().catch(() => 18),
        tokenContract.symbol().catch(() => tokenSymbol || DEFAULT_TRACKED_TOKEN_SYMBOL)
      ]);

      const formattedBalance = Number(formatUnits(rawBalance, decimals));
      setTokenBalance(formattedBalance);
      setTokenSymbol(symbol || tokenSymbol || DEFAULT_TRACKED_TOKEN_SYMBOL);
      setTrackedTokenDecimals(Number(decimals));
    } catch (error) {
      console.error('Error fetching tracked token balance:', error);
      setTokenBalance(null);
    } finally {
      setIsTokenBalanceLoading(false);
    }
  }, [account, provider, trackedTokenAddress, tokenSymbol]);

  const addTrackedTokenToWallet = useCallback(async () => {
    if (typeof window === 'undefined' || !window.ethereum || !trackedTokenAddress) {
      return false;
    }

    try {
      const wasAdded = await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: trackedTokenAddress,
            symbol: tokenSymbol || DEFAULT_TRACKED_TOKEN_SYMBOL,
            decimals: trackedTokenDecimals,
          },
        },
      });

      return Boolean(wasAdded);
    } catch (error) {
      console.error('Error adding tracked token to wallet:', error);
      return false;
    }
  }, [trackedTokenAddress, tokenSymbol, trackedTokenDecimals]);

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
      if (network.chainId !== BigInt(POLYGON_MAINNET_ID) && network.chainId !== BigInt(POLYGON_AMOY_ID)) {
        // Try to switch to Polygon Mainnet
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: POLYGON_MAINNET.chainId }],
          });

          const updatedChainId = await window.ethereum.request({ method: 'eth_chainId' });
          setChainId(parseInt(updatedChainId, 16));
        } catch (switchError) {
          // This error code indicates that the chain has not been added to MetaMask
          if (switchError.code === 4902) {
            try {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [POLYGON_MAINNET],
              });

              const updatedChainId = await window.ethereum.request({ method: 'eth_chainId' });
              setChainId(parseInt(updatedChainId, 16));
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
    setProvider(new BrowserProvider(window.ethereum));
  }, []);

  // Set mounted state to avoid hydration errors
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Check if wallet is already connected on mount (only after component is mounted)
  useEffect(() => {
    if (!isMounted) return;

    const initWallet = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          // Check if already connected without triggering MetaMask popup
          // This will only return accounts if user previously connected to this site
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
      if (typeof window !== 'undefined' && window.ethereum && window.ethereum.removeListener) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [isMounted, handleAccountsChanged, handleChainChanged]);

  useEffect(() => {
    if (!account || !provider) {
      setTokenBalance(null);
      return;
    }

    if (!isPolygonNetwork()) {
      setTokenBalance(null);
      return;
    }

    refreshTrackedTokenBalance(account, provider);
  }, [account, provider, chainId, isPolygonNetwork, refreshTrackedTokenBalance]);

  // ── NFT Minting ──────────────────────────────────────────────

  const [nftSinglePrice, setNftSinglePrice] = useState(null);
  const [nftPackPrice, setNftPackPrice] = useState(null);
  const [nftPackSize, setNftPackSize] = useState(null);
  const [saleActive, setSaleActive] = useState(null);

  const refreshNftPrices = useCallback(async () => {
    if (!provider || !account || !isPolygonNetwork()) return;
    const nftContract = new Contract(DEFAULT_NFT_ADDRESS, NFT_ABI, provider);

    try {
      const [active, singlePrice, packPrice, packSize] = await Promise.all([
        nftContract.saleActive(),
        nftContract.unityPrice(),
        nftContract.packPrice(),
        nftContract.PACK_SIZE()
      ]);
      setSaleActive(active);
      setNftSinglePrice(singlePrice);
      setNftPackPrice(packPrice);
      setNftPackSize(packSize);
    } catch (error) {
      console.error('Error fetching NFT data:', error);
    }
  }, [provider, account, isPolygonNetwork]);

  const approveToken = useCallback(async (spender, amount) => {
    if (!provider || !account) throw new Error('Wallet not connected');
    const signer = await provider.getSigner();
    const tokenContract = new Contract(trackedTokenAddress, ERC20_ABI, signer);
    const tx = await tokenContract.approve(spender, amount);
    return tx;
  }, [provider, account, trackedTokenAddress]);

  const mintOneNft = useCallback(async () => {
    if (!provider || !account) throw new Error('Wallet not connected');
    const signer = await provider.getSigner();
    const nftContract = new Contract(DEFAULT_NFT_ADDRESS, NFT_ABI, signer);
    const tx = await nftContract.mintOne();
    return tx;
  }, [provider, account]);

  const mintNftPacks = useCallback(async (packs) => {
    if (!provider || !account) throw new Error('Wallet not connected');
    const signer = await provider.getSigner();
    const nftContract = new Contract(DEFAULT_NFT_ADDRESS, NFT_ABI, signer);
    const tx = await nftContract.mintPacks(packs);
    return tx;
  }, [provider, account]);

  const calculateMintCost = useCallback((packCount, singleCount) => {
    let total = BigInt(0);
    if (packCount > 0) {
      if (!nftPackPrice) throw new Error('Pack price not available');
      total += nftPackPrice * BigInt(packCount);
    }
    if (singleCount > 0) {
      if (!nftSinglePrice) throw new Error('Single mint price not available');
      total += nftSinglePrice * BigInt(singleCount);
    }
    return total;
  }, [nftSinglePrice, nftPackPrice]);

  const switchToPolygon = async () => {
    if (!window.ethereum) return;

    // const network = testnet ? POLYGON_AMOY : POLYGON_MAINNET;
    const network = POLYGON_MAINNET;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: network.chainId }],
      });

      const updatedChainId = await window.ethereum.request({ method: 'eth_chainId' });
      setChainId(parseInt(updatedChainId, 16));
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [network],
          });

          const updatedChainId = await window.ethereum.request({ method: 'eth_chainId' });
          setChainId(parseInt(updatedChainId, 16));
        } catch (addError) {
          console.error('Error adding network:', addError);
        }
      }
    }
  };

  const value = {
    account,
    provider,
    chainId,
    trackedTokenAddress,
    trackedTokenDecimals,
    tokenBalance,
    tokenSymbol,
    isTokenBalanceLoading,
    isConnecting,
    connectWallet,
    disconnectWallet,
    switchToPolygon,
    isPolygonNetwork,
    setTrackedToken,
    refreshTrackedTokenBalance,
    addTrackedTokenToWallet,

    // NFT minting
    nftSinglePrice,
    nftPackPrice,
    nftPackSize,
    saleActive,
    refreshNftPrices,
    approveToken,
    mintOneNft,
    mintNftPacks,
    calculateMintCost,
    DEFAULT_NFT_ADDRESS
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
