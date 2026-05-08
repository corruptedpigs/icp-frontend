"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import SwapWidget from "../components/SwapWidget";
import NavbarWithConnectWallet from "../../ui/components/homepage/navbar_with_connect_wallet";
import { checkAndPersistSwapFlag } from "../utils/swapFeatureFlag";

export default function SwapPageClient() {
  const searchParams = useSearchParams();
  const [unlocked, setUnlocked] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const isUnlocked = checkAndPersistSwapFlag(searchParams);
    setUnlocked(isUnlocked);
    setChecking(false);
  }, [searchParams]);

  return (
    // Full-viewport dark purple background matching the prototype aesthetic
    <div className="relative min-h-screen overflow-hidden"
      style={{ background: "hsl(270 59% 10%)" }}
    >
      {/* Ambient glow orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-20 blur-[120px]"
          style={{ background: "hsl(320 100% 60%)" }} />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full opacity-10 blur-[150px]"
          style={{ background: "hsl(42 91% 55%)" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10 blur-[150px]"
          style={{ background: "hsl(270 70% 40%)" }} />
      </div>

      {/* Perspective grid floor */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
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

      {/* Film noise overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03]">
        <svg className="w-full h-full">
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
      </div>

      {/* Scanline animation */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "linear-gradient(transparent 0%, rgba(255,51,187,0.06) 50%, transparent 100%)",
          backgroundSize: "100% 200%",
          animation: "scanline 8s linear infinite",
        }}
      />
      <style>{`
        @keyframes scanline {
          0% { background-position: 0 -100%; }
          100% { background-position: 0 100%; }
        }
      `}</style>

      {/* Navbar */}
      <NavbarWithConnectWallet show_logo={true} />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 pt-20 pb-10">
        {checking ? (
          // Loading state
          <div className="text-center">
            <div className="font-display text-2xl text-pink-500/60 animate-pulse">Loading...</div>
          </div>
        ) : !unlocked ? (
          // Locked state
          <LockedState />
        ) : (
          // Swap UI
          <div className="w-full max-w-md">
            {/* Title */}
            <div className="text-center mb-8">
              <h1 className="font-display text-5xl sm:text-6xl text-white text-glow-pink tracking-wider mb-2">
                SWAP
              </h1>
              <p className="text-purple-300/60 font-heading text-sm uppercase tracking-widest">
                Get $COINK on Polygon
              </p>
            </div>

            <SwapWidget />
          </div>
        )}
      </div>
    </div>
  );
}

function LockedState() {
  return (
    <div className="text-center max-w-sm">
      <div className="mb-6 text-7xl">🐷</div>
      <h1 className="font-display text-4xl text-white text-glow-pink mb-3">
        ACCESS RESTRICTED
      </h1>
      <p className="text-purple-300/60 font-heading text-sm leading-relaxed mb-6">
        The Swap page is currently in testing mode.<br />
        If you have an access link, please use it to unlock this page.
      </p>
      <div className="rounded-xl bg-black/40 border border-pink-500/20 px-4 py-3 text-xs text-purple-400/50 font-mono">
        Requires: <span className="text-pink-400/70">?swap=unlocked</span>
      </div>
    </div>
  );
}
