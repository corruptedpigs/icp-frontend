// Public network/contract configuration; defaults match docs/web3.md.
export const POLYGON_CHAIN_ID = 137;
export const POLYGON_RPC_URL = process.env.NEXT_PUBLIC_POLYGON_RPC_URL || 'https://polygon-rpc.com/';
export const POLYGON_EXPLORER_URL = 'https://polygonscan.com/';
export const COINK_ADDRESS = process.env.NEXT_PUBLIC_TRACKED_TOKEN_ADDRESS || '0x1E60032C0b93b5A8A0F3eD485cb35DBfE86972a5';
export const COINK_SYMBOL = process.env.NEXT_PUBLIC_TRACKED_TOKEN_SYMBOL || 'COINK';
export const COINK_DECIMALS = Number(process.env.NEXT_PUBLIC_TRACKED_TOKEN_DECIMALS || 18);
export const POLYGON_MAINNET = {
  chainId: '0x89',
  chainName: 'Polygon Mainnet',
  nativeCurrency: { name: 'POL', symbol: 'POL', decimals: 18 },
  rpcUrls: [POLYGON_RPC_URL],
  blockExplorerUrls: [POLYGON_EXPLORER_URL],
};
