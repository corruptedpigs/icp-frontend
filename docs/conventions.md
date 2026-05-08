# Project Conventions

## File & Component Conventions

### Page structure
Every route follows a two-file pattern:
```
app/<route>/page.js            # Server component — metadata, Suspense boundary
app/<route>/<Name>PageClient.js # "use client" — interactive page content
```

### Component naming
- PascalCase, named after **behaviour**, not the page it first appeared on
- Live in `app/components/` (game/shared) or `ui/components/homepage/` (marketing)
- Homepage section components are `.jsx`; everything else is `.js`

### Hooks
- `app/hooks/use<Name>.js`
- Custom hooks only — never call `useWallet()` outside a component tree that is wrapped by `WalletProvider`

### Utils
- `app/utils/<camelCase>.js`
- Pure functions preferred; no React imports in utils

## React / Next.js

- **`"use client"`** must be the first line of any file that uses hooks, `useState`, `useEffect`, browser APIs, or event handlers
- Wrap `useSearchParams()` callers in `<Suspense>` in the parent server component (required for static export)
- Never use `useRouter().push()` for external URLs — use `window.open()` or `<a>` tags
- Image optimisation is disabled (`unoptimized: true`) — use `next/image` for layout/sizing benefits, but don't rely on Vercel image optimisation

## Styling

- **Tailwind utility classes first** — check globals.css for existing utilities before writing new ones
- Reusable patterns belong in `@layer utilities` in `styles/globals.css`
- **Design token reference**:

| Token | Value | Usage |
|---|---|---|
| `--primary` | `hsl(320 100% 60%)` — hot pink | CTAs, selected states, neon glows |
| `--accent` | `hsl(42 90% 55%)` — gold | $COINK, highlights, burn power |
| `--background` | `hsl(270 50% 8%)` — deep purple | Page background |
| `--card` | `hsl(270 40% 12%)` | Card surfaces |
| `--border` | `hsl(270 30% 22%)` | Borders |

- **Glow utilities**: `.text-glow-pink`, `.text-glow-gold`
- **Glass card**: `.glass-card` — backdrop blur + semi-transparent card surface
- **Fonts**: `font-display` (Bangers — large headings), `font-heading` (Russo One — labels), body (Inter)

## Wallet & Web3

- All wallet state comes from `useWallet()` — never instantiate `BrowserProvider` directly in a component
- `WalletContext` is **read-only** by default (balanceOf, decimals, symbol only)
- To add write functionality: extend `ERC20_ABI` in `WalletContext.js` and add a new callback — do not use ethers directly in components
- Always check `isPolygonNetwork()` before showing token balances or transaction UI
- Gate transaction UI behind both `account !== null` AND `isPolygonNetwork()`

## Feature Flags

See [feature-flags.md](./feature-flags.md) for full details.

New unreleased features must be wrapped in a feature flag. Reference implementation: `/swap`.

## Common Anti-patterns to Avoid

| ❌ Don't | ✅ Do instead |
|---|---|
| Hardcode contract addresses | Read from `process.env.NEXT_PUBLIC_*` with fallback |
| Call `new BrowserProvider()` in components | Use `provider` from `useWallet()` |
| Write to chain without ABI extension | Extend `ERC20_ABI` + add callback in WalletContext |
| Add inline `<style>` or `<script>` | Use Tailwind / globals.css utilities |
| Use `getServerSideProps` | Not supported — static export only |
| Add external image URLs directly | Download and serve from `public/images/` |
