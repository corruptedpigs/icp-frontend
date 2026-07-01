# NFT Mint Page — Implementation Plan

## Overview

New page at `/mint` where connected wallet users can purchase Corrupted Pigs NFTs using $COINK tokens.

## Page Structure

```
app/mint/page.js              # Server component — Suspense wrapper + metadata
app/mint/MintPageClient.js     # "use client" — full interactive page
```

Follows conventions from `/swap` and `/games`.

## Visual Design

Reuse the full background layer from `app/swap/SwapPageClient.js`:

- Dark purple base: `hsl(270 59% 10%)`
- Two ambient glow orbs (pink top-left, gold bottom-right)
- Perspective grid floor (pink 1px lines, 40px grid, `perspective(800px) rotateX(55deg)`)
- Film noise overlay (`<feTurbulence>` SVG at 3% opacity)
- Scanline animation (pink stripe, 8s loop)
- Fonts: `font-display` (Bangers) for headings, `font-heading` (Russo One) for labels
- Navbar: `NavbarWithConnectWallet` (consistent with swap/games pages)

## Contract Architecture

### Current state (read-only)

`WalletContext.js` only has `balanceOf`, `decimals`, `symbol` in `ERC20_ABI`. Per `docs/conventions.md`:

> To add write functionality: extend `ERC20_ABI` in `WalletContext.js` and add a new callback — do not use ethers directly in components.

### Required ABI extensions

**ERC-20 ($COINK) — add `approve`:**
```
function approve(address spender, uint256 amount) returns (bool)
```

**NFT Contract (ERC-721) — new ABI `NFT_ABI`:**
```
function mintOne()                                     // mint 1 NFT
function mintPacks(uint256 packs)                       // mint N packs (5 NFTs each)
function unityPrice() view returns (uint256)            // current price per single NFT (wei)
function packPrice() view returns (uint256)             // current price for 1 pack (wei)
function PACK_SIZE() view returns (uint256)             // number of NFTs per pack (5)
function totalMinted() view returns (uint256)           // total minted so far
function saleActive() view returns (bool)               // whether minting is active
```

### Price model

| Unit | NFTs | Pricing |
|---|---|---|
| 1 single | 1 | `unityPrice()` in wei |
| 1 pack | 5 | `packPrice()` in wei (slightly cheaper per NFT) |

The cost functions should be called on-chain to get current prices rather than hardcoding, since the contract owner may adjust prices.

### Purchase logic

```
let remaining = desiredQuantity
let packCount = 0
let singleCount = 0

// Optimize: buy as many packs as possible, then singles for remainder
packCount = Math.floor(remaining / 5)
remaining = remaining % 5
singleCount = remaining

// Calculate total cost
totalCost = (packCount > 0 ? packPrice() * packCount : 0) + (singleCount > 0 ? unityPrice() * singleCount : 0)

// Transaction sequence:
// 1. approve(spender=NFT_CONTRACT, amount=totalCost) — ERC-20 approval
// 2. If packCount > 0: mintPacks(packCount)
// 3. If singleCount > 0: call mintOne() repeatedly (singleCount times)

Note: unityPrice() returns the per-single price in wei, packPrice() returns the per-pack price.
Since packs have a discount, always use packPrice() for the bulk portion.
```

**Important:** The user said `mintPacks` receives one param `packs` for how many packs. So `mintPacks(2)` = 10 NFTs. Let's verify if we need to call `mintPacks(1)` per pack or `mintPacks(2)` for 2 packs — the param name `packs` suggests it's the count of packs.

If `mintPacks(packs)` takes the number of packs, then:
- For 12 NFTs: `mintPacks(2)` (10 NFTs) + `mintOne()` + `mintOne()` (2 singles) = 12 total

### Transaction sequence

1. **Approve** — ERC-20 `approve(NFT_CONTRACT, totalCost)` — user confirms
2. **Wait for approval confirmation**
3. **Mint** — Execute mint calls sequentially (packs first, then singles)
4. **Wait for mint confirmations**
5. **Success** — Refresh NFT list, show animation

Since each `mintOne()` is a separate transaction, for large quantities this could require many confirmations. Consider batching where possible or using a multicall pattern.

### Transaction state machine

```
IDLE → APPROVING → APPROVED → MINTING → CONFIRMED → SUCCESS
                              ↓
                           ERROR
```

### $COINK decimals

Per `docs/web3.md`, COINK has 18 decimals. Use `ethers.parseUnits("63", 18)` to convert human-readable amounts to wei, and `ethers.formatUnits` for display. The `unityPrice()` and `packPrice()` contract functions return values already in wei, so no conversion needed for those.

## UI Components

### Quantity selector

Use DaisyUI `range` component (`<input type="range">`) with value display. Sync with a numeric input for keyboard entry.

Range: 1–20 (MAX_QUANTITY constant).

Show the calculated price breakdown in real-time:
```
Quantity: 12
  Packs: 2 × 5 NFTs
  Singles: 2 × 1 NFT
Total: ~63 COINK
```

### Price breakdown card

Glass-morphism card showing:
- Number of packs × pack price
- Number of singles × single price
- Total $COINK cost
- Current $COINK balance vs cost (insufficient funds warning)

### Action button

States mirroring `SwapWidget`:
1. **Connect Wallet** — when no account
2. **Switch to Polygon** — when wrong network
3. **Approve & Mint** — when ready (shows total cost)
4. **Pending** — during transaction (spinner, tx hash link to Polygonscan)
5. **Success** — celebration state

### Post-mint celebration

After successful mint:
- Confetti/particle animation (CSS or lightweight library)
- Display freshly minted NFT thumbnails in a grid/carousel
- Refresh NFT collection via `useWalletNFTs()` hook

## Feature Flag

Gate behind `?mint=unlocked` — follow the exact pattern in `docs/feature-flags.md`:
- `app/mint/page.js` — server component with `<Suspense>` wrapper
- `app/mint/MintPageClient.js` — client component that calls `checkAndPersistFlag("mint", searchParams)`

## Navbar link

Add a "Mint" link in `NavbarWithConnectWallet` gated behind `isFlagUnlocked("mint")`, following the same pattern as the existing `swapUnlocked` logic.

## Open Questions / Missing Info

1. ~~**Price constants**: What are the current `cost()` and `costForPacks(1)` values in COINK?~~ **Answered**: `unityPrice()` ≈ 5,850,000 COINK, `packPrice()` ≈ 19,500,000 COINK, `PACK_SIZE` = 5, `MAX_SUPPLY` = 7000, `saleActive` = true.
2. ~~**Max purchase limit**: Is there a max per transaction from the contract (e.g. `maxMint` or `maxSupply`)?~~ **Answered**: No per-transaction limit found; `MAX_SUPPLY` = 7000 (hard cap). UI caps at 20.
3. ~~**Gas estimation**: Should we estimate gas or use fixed limits for `mintOne`/`mintPacks` calls?~~ **Answered**: Using ethers default gas estimation (no fixed limits).

## TODO Checklist

- [x] Extend `ERC20_ABI` in `WalletContext.js` — add `approve` function signature
- [x] Add `NFT_ABI` constant — `mintOne`, `mintPacks`, `unityPrice`, `packPrice`, `PACK_SIZE`, `totalMinted`, `saleActive`
- [x] Add `approveToken(spender, amount)` callback in `WalletContext`
- [x] Add `mintOneNft()` and `mintNftPacks(packs)` callbacks in `WalletContext`
- [x] Add `calculateMintCost(packCount, singleCount)` and `refreshNftPrices()` callbacks
- [x] Create `app/mint/page.js` — server component with `Suspense` + feature flag wrapper
- [x] Create `app/mint/MintPageClient.js`:
  - [x] Background layer (copy from `SwapPageClient`)
  - [x] Feature flag gating (`checkAndPersistFlag("mint", searchParams)`)
  - [x] Quantity selector (slider + numeric input, 1–20)
  - [x] Real-time price calculation & breakdown
  - [x] Wallet connection state handling
  - [x] Approve transaction flow
  - [x] Mint transaction flow (packs first, then singles)
  - [x] Transaction status display (pending tx hash, confirmation)
  - [x] Success state — freshly minted NFT gallery
  - [x] Insufficient balance warning with Uniswap buy link
- [x] Add `isFlagUnlocked("mint")` link in `NavbarWithConnectWallet` (desktop + mobile)
- [x] Point GamePageClient ACQUIRE_NFTS_URL to `/mint`
- [x] Test on-chain reads: unityPrice(), packPrice(), PACK_SIZE(), saleActive() all verified via terminal
- [ ] Test end-to-end mint flow on Polygon mainnet (approve + mint transactions)
