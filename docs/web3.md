# Web3 & Contracts

## Network

| Property | Value |
|---|---|
| Network | Polygon Mainnet |
| Chain ID | `137` (`0x89`) |
| RPC | `https://polygon-rpc.com/` |
| Explorer | `https://polygonscan.com/` |
| Gas token | POL (formerly MATIC) |

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

## COINK Console

`/coink-console` integrates the colleague's standalone console using the existing navbar, wallet context, design tokens and glass cards. It includes reserve balances/withdrawals, all 14 supplied write functions, quick reads, and calldata generation for Transaction Builder. No CDN scripts, standalone page styles, editable contract addresses or saved RPC overrides are used.

Configuration is centralized in `app/utils/web3Config.js`: token address/symbol/decimals use `NEXT_PUBLIC_TRACKED_TOKEN_*`; optional `NEXT_PUBLIC_POLYGON_RPC_URL` overrides the documented Polygon RPC. These public values are embedded at build time. Owner, UBQ and airdrop-manager addresses are read from the contract, never hardcoded. Reserve IDs, function signatures and vesting descriptions come from the supplied console; verify them against the deployed contract before treasury use.

### Team access and Safe setup

1. Ask the team for the console unlock link. See [Feature Flags](feature-flags.md) for the UI-gating mechanism. This is not authentication.
2. For a treasury Safe, use **https://app.safe.global** with the correct Polygon Safe selected and a signer wallet connected.
3. Add a custom Safe App using the team's console unlock URL (`https://corruptedpigs.com/coink-console` with the provided query parameter). Including the unlock parameter is important: embedded-browser storage may differ from normal browser storage.
4. `/coink-console/manifest.json` describes the Safe App (Safe appends `/manifest.json` to the app URL, stripping query parameters). Its adjacent `logo.png` reuses the site logo. The IC assets configuration includes `Access-Control-Allow-Origin: *` for this manifest. On other hosts/CDNs, configure that header there. Permit this console route to be embedded by `https://app.safe.global` (no conflicting `X-Frame-Options: DENY/SAMEORIGIN`; if using CSP, allow that origin in `frame-ancestors`). Static Next.js export cannot set HTTP response headers itself: verify the actual response headers after deployment.
5. Confirm the displayed Safe address, chain 137 and on-chain roles before proposing anything. Safe responses are accepted only from `https://app.safe.global`. Embedded detection failures never fall back to direct wallet sends.
6. Proposals are **not executed transfers**: other signers must confirm and execute in Safe. Refresh balances after execution. Browser-wallet sends wait for confirmation and refresh automatically.

Every send rechecks network/account and live roles and performs an RPC simulation from the effective caller (Safe address in Safe mode). Unauthorized sends are disabled; calldata preparation stays available without a wallet and is explicitly marked as unsimulated. Reserve Fund always pays UBQ. All sends require a review confirmation; dangerous functions carry an additional warning. Simulation is not a guarantee of later execution, particularly for delayed multisig proposals.

Before production treasury use, test the deployed domain in Safe with the actual Polygon multisig. Local tests cannot verify real Safe proposal/signature/execution behavior. No on-chain transactions are sent by automated tests.
