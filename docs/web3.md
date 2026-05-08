# Web3 & Contracts

## Network

| Property | Value |
|---|---|
| Network | Polygon Mainnet |
| Chain ID | `137` (`0x89`) |
| RPC | `https://polygon-rpc.com/` |
| Explorer | `https://polygonscan.com/` |
| Gas token | MATIC |

## Contracts

### $COINK Token (ERC-20)

| Property | Value |
|---|---|
| Address | `0x1E60032C0b93b5A8A0F3eD485cb35DBfE86972a5` |
| Standard | ERC-20 |
| Decimals | 18 |
| Symbol | `COINK` |
| Explorer | [polygonscan.com/token/0x1E60...](https://polygonscan.com/token/0x1E60032C0b93b5A8A0F3eD485cb35DBfE86972a5) |

### Corrupted Pigs NFT Collection

| Property | Value |
|---|---|
| Address | Set via `NEXT_PUBLIC_TRACKED_NFT_ADDRESS` |
| Standard | ERC-721 |
| IPFS gateway | `https://ipfs.corruptedpigs.com/ipfs/` |
| Key trait | `burn power` — integer used for game mechanics |

### USDC on Polygon

| Property | Value |
|---|---|
| Address | `0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359` |
| Standard | ERC-20 |
| Decimals | 6 |

## WalletContext API

Located at `app/context/WalletContext.js`. Wrap the app in `<WalletProvider>`.

### State

| Property | Type | Description |
|---|---|---|
| `account` | `string \| null` | Connected wallet address |
| `provider` | `BrowserProvider \| null` | ethers.js v6 provider |
| `chainId` | `number \| null` | Current chain ID |
| `tokenBalance` | `number \| null` | Formatted $COINK balance |
| `tokenSymbol` | `string` | Token symbol |
| `trackedTokenAddress` | `string` | Currently tracked ERC-20 address |
| `isTokenBalanceLoading` | `boolean` | Balance fetch in progress |
| `isConnecting` | `boolean` | Wallet connect in progress |

### Methods

| Method | Description |
|---|---|
| `connectWallet()` | Request accounts, auto-switch to Polygon |
| `disconnectWallet()` | Revoke permissions, clear all state |
| `switchToPolygon()` | Switch/add Polygon Mainnet chain |
| `isPolygonNetwork()` | `true` if chainId is 137 or 80002 |
| `refreshTrackedTokenBalance()` | Re-fetch balance from chain |
| `setTrackedToken(address, symbol, decimals)` | Track a different ERC-20 |
| `addTrackedTokenToWallet()` | `wallet_watchAsset` — add token to MetaMask |

### Current ABI (read-only)

```js
const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)'
]
```

To add write functionality (e.g. `approve`, `transfer`), extend `ERC20_ABI` in `WalletContext.js` and expose a new callback through the context value.

## DEX Integration

The swap page (`/swap`) integrates with Uniswap v3 on Polygon by building a deep-link URL — no on-chain calls are made from the app itself.

**Live pool**: USDC / COINK on Uniswap v3 (Polygon)

```js
// Opens Uniswap with USDC→COINK pre-filled
`https://app.uniswap.org/swap?inputCurrency=${USDC_ADDRESS}&outputCurrency=${COINK_ADDRESS}&chain=polygon`
```

## NFT Hook

`app/hooks/useWalletNFTs.js` — fetches NFTs owned by the connected wallet via Alchemy.

```js
const { nfts, loading, error } = useWalletNFTs(account);
// nfts: [{ image, burnPower, name }, ...]
```

Requires `NEXT_PUBLIC_ALCHEMY_API_KEY` and `NEXT_PUBLIC_TRACKED_NFT_ADDRESS`.
