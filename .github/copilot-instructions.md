# Copilot Instructions for Corrupted Pigs

## ⚠️ CRITICAL RULES — NEVER VIOLATE THESE ⚠️

1. **Next.js App Router only** — all pages live under `app/`. No `pages/` directory.
   - Use `"use client"` at the top of any component that uses hooks, browser APIs, or interactivity.
   - Server components are the default; only add `"use client"` when needed.

2. **Wallet interaction is read-only by default** — `WalletContext` exposes only `balanceOf`, `decimals`, `symbol` on ERC-20 contracts. Do not add write/transaction calls without explicit instruction and a corresponding ABI extension.

3. **Polygon Mainnet is the target chain** (chainId `137`). Amoy testnet (`80002`) is only for local testing. Never hardcode a different chain.

4. **Tailwind + DaisyUI only** — no new CSS frameworks. Prefer utility classes over new custom CSS. Extend `globals.css` utilities (`@layer utilities`) for reusable patterns.

5. **Feature flags via `app/utils/featureFlags.js`** — any feature not ready for public release must be gated. The swap page is the reference implementation.

6. **No inline `<script>` or `<style>` tags** in JSX/TSX files.

7. **Environment variables** must be prefixed `NEXT_PUBLIC_` to be available client-side. Never hardcode contract addresses — read from `process.env.NEXT_PUBLIC_*` with a fallback.

## Naming Conventions

- **Pages**: `app/<route>/page.js` (server) + `app/<route>/<Name>PageClient.js` (client)
- **Components**: `app/components/<ComponentName>.js` — PascalCase, named after behaviour not page
- **Hooks**: `app/hooks/use<HookName>.js`
- **Utils**: `app/utils/<utilName>.js`
- **Homepage UI sections**: `ui/components/homepage/<SectionName>.jsx`

## Common Patterns

- **Wallet connect**: Use `useWallet()` from `app/context/WalletContext.js`. Never instantiate `BrowserProvider` directly in components.
- **NFT fetching**: Use `useWalletNFTs()` from `app/hooks/useWalletNFTs.js` (Alchemy API).
- **Feature flags**: Gate unreleased features using `checkAndPersistFlag(flag, searchParams)` / `isFlagUnlocked(flag)` from `app/utils/featureFlags.js`. The swap page is the reference implementation.
- **Suspense boundary**: Wrap any client component that uses `useSearchParams()` in a `<Suspense>` in the server page component.

## Start Here

Use the `docs/` folder as the source of truth:
- [Stack Overview](../docs/stack.md)
- [Project Conventions](../docs/conventions.md)
- [Web3 & Contracts](../docs/web3.md)
- [UI & Design System](../docs/ui.md)
- [Feature Flags](../docs/feature-flags.md)
