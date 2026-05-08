# Stack Overview

## Core Technologies

| Layer | Technology | Version / Notes |
|---|---|---|
| Framework | Next.js (App Router) | React, server + client components |
| Language | JavaScript (JSX) | No TypeScript currently |
| Styling | Tailwind CSS + DaisyUI | Custom CSS variables in `styles/globals.css` |
| Web3 | ethers.js v6 | `BrowserProvider`, `Contract`, `formatUnits` |
| NFT Data | Alchemy NFT API v3 | `getNFTsForOwner` endpoint |
| Network | Polygon Mainnet | ChainId 137; MATIC as gas token |
| Package manager | npm / pnpm | `pnpm-lock.yaml` present |

## Blockchain

- **Network**: Polygon Mainnet (chainId `137`)
- **Token contract**: `$COINK` ERC-20 at `0x1E60032C0b93b5A8A0F3eD485cb35DBfE86972a5` (set via `NEXT_PUBLIC_TRACKED_TOKEN_ADDRESS`)
- **NFT contract**: Corrupted Pigs NFT collection (address via `NEXT_PUBLIC_TRACKED_NFT_ADDRESS`)
- **DEX**: Uniswap v3 on Polygon — USDC/COINK is the primary pool
- **USDC on Polygon**: `0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359`

## Directory Structure

```
nextjs-ic-starter/
├── app/                        # Next.js App Router
│   ├── layout.js               # Root layout — WalletProvider + MuteProvider
│   ├── page.js                 # Homepage (marketing landing)
│   ├── about/page.js
│   ├── games/
│   │   ├── page.js             # Games lobby (/games)
│   │   ├── GamesPageClient.js
│   │   └── [id]/               # Dynamic game routes
│   ├── swap/
│   │   ├── page.js             # Swap page — feature-flagged
│   │   └── SwapPageClient.js
│   ├── context/
│   │   └── WalletContext.js    # Polygon wallet + ERC-20 context
│   ├── components/
│   │   ├── SwapWidget.js       # USDC/COINK swap UI
│   │   ├── GameHUD.js
│   │   ├── NFTGalleryCard.js
│   │   └── games/logic/Player1.js
│   ├── hooks/
│   │   └── useWalletNFTs.js    # Alchemy NFT fetcher
│   └── utils/
│       └── swapFeatureFlag.js  # Feature flag for /swap
├── ui/
│   └── components/homepage/   # Marketing page sections
│       ├── NewNavbar.jsx
│       ├── NewFooter.jsx
│       ├── HeroSection.jsx
│       ├── BackersSection.jsx
│       └── navbar_with_connect_wallet.js  # Game pages navbar
├── styles/
│   └── globals.css             # Tailwind + CSS design tokens
├── public/
│   └── images/                 # Static assets incl. token logos
├── backend/                    # Motoko ICP canisters (legacy)
└── docs/                       # Project documentation
```

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_TRACKED_TOKEN_ADDRESS` | $COINK ERC-20 contract address |
| `NEXT_PUBLIC_TRACKED_TOKEN_SYMBOL` | Token symbol displayed in UI (default: `TOKEN`) |
| `NEXT_PUBLIC_TRACKED_TOKEN_DECIMALS` | Token decimals (default: `18`) |
| `NEXT_PUBLIC_TRACKED_NFT_ADDRESS` | NFT collection contract address |
| `NEXT_PUBLIC_ALCHEMY_API_KEY` | Alchemy API key for NFT fetching |

## Build

```bash
npm run dev      # development server
npm run build    # production build (static export, output: "export")
npm run start    # serve production build
```

The project uses `output: "export"` — it is a **static site**. Server-side features like `getServerSideProps` or API routes are not available.
