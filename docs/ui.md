# UI & Design System

## Visual Identity

Corrupted Pigs uses a **dark cyberpunk / neon underground** aesthetic — think corrupted arcade meets speakeasy gambling den. Key visual motifs:

- Deep purple backgrounds with neon pink and gold accents
- Glowing ambient orbs (blurred radial blobs)
- Perspective grid floor (vanishing-point pink grid)
- Film noise overlay + CRT scanline animation
- Neon text shadows on headings
- Glass-morphism cards (`backdrop-blur` + semi-transparent backgrounds)

## Design Tokens

Defined in `styles/globals.css` as HSL CSS variables.

| Variable | HSL | Role |
|---|---|---|
| `--background` | `270 50% 8%` | Page background — near-black purple |
| `--foreground` | `270 20% 95%` | Body text |
| `--primary` | `320 100% 60%` | Hot pink — CTAs, neon glows, selections |
| `--accent` | `42 90% 55%` | Gold — $COINK, burn power, highlights |
| `--card` | `270 40% 12%` | Card surface |
| `--border` | `270 30% 22%` | Borders |
| `--muted-foreground` | `270 15% 65%` | Subdued labels |
| `--destructive` | `0 84% 60%` | Red — danger, CPU side |

## Typography

| Class | Font | Usage |
|---|---|---|
| `font-display` | Bangers (Google) | Large headings, scores, VS, game titles |
| `font-heading` | Russo One (Google) | Labels, nav items, stat names |
| _(body)_ | Inter | Body text, descriptions |

## Utility Classes (globals.css)

| Class | Effect |
|---|---|
| `.text-glow-pink` | Double pink neon text shadow |
| `.text-glow-gold` | Double gold neon text shadow |
| `.glass-card` | `bg-card/60 backdrop-blur-md border border-border/50 rounded-xl` |
| `.section-gradient` | Vertical fade gradient for landing page sections |
| `.animate-float` | Gentle vertical float animation |
| `.scrollbar-hide` | Hide scrollbar cross-browser |

## Page Background Pattern

Used on game pages and the Swap page. Copy this pattern for new full-screen game-style pages:

```jsx
<div className="relative min-h-screen overflow-hidden"
  style={{ background: "hsl(270 59% 10%)" }}
>
  {/* Ambient glow orbs */}
  <div className="pointer-events-none absolute inset-0 overflow-hidden">
    <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-20 blur-[120px]"
      style={{ background: "hsl(320 100% 60%)" }} />
    <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full opacity-10 blur-[150px]"
      style={{ background: "hsl(42 91% 55%)" }} />
  </div>

  {/* Perspective grid floor */}
  <div className="pointer-events-none absolute inset-0 opacity-30"
    style={{
      backgroundImage: `
        linear-gradient(rgba(255,51,187,0.2) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,51,187,0.2) 1px, transparent 1px)
      `,
      backgroundSize: "40px 40px",
      transform: "perspective(800px) rotateX(55deg) translateY(30%)",
      transformOrigin: "center bottom",
    }}
  />

  {/* Content */}
</div>
```

## Navbar Variants

Two navbar components exist:

| Component | Used on | Notes |
|---|---|---|
| `ui/components/homepage/NewNavbar.jsx` | Homepage (`/`) | Smooth scroll to sections, Swap link |
| `ui/components/homepage/navbar_with_connect_wallet.js` | Game pages (`/games`, `/swap`) | Wallet connect/disconnect, token balance, Swap link (feature-flagged) |

## Token Logos

Optimised token logo PNGs (64×64, transparent background) live in `public/images/`:

| File | Token |
|---|---|
| `coink_logo.png` | $COINK |
| `usdc_logo.png` | USDC |

To add a new token logo: download the source, remove background with `magick <src> -fuzz 10% -transparent white -resize 64x64 public/images/<name>_logo.png`.

## NFT Cards

NFT cards display:
- Pig image (from IPFS via custom gateway `https://ipfs.corruptedpigs.com/ipfs/`)
- Name
- `burnPower` attribute — shown as a badge, used in game mechanics

See `app/components/NFTGalleryCard.js` for the reference implementation.
