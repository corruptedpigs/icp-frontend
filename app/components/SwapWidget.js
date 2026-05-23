"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useWallet } from "../../app/context/WalletContext";
import { buildUniswapUrl, COINK_ADDRESS, COINK_SYMBOL } from "../utils/uniswap";

// Only USDC/COINK pair is supported
const USDC_ADDRESS = "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359";

const TOKENS = [
  {
    symbol: "USDC",
    address: USDC_ADDRESS,
    decimals: 6,
    logo: null,
    logoImg: "/images/usdc_logo.png",
  },
  {
    symbol: COINK_SYMBOL,
    address: COINK_ADDRESS,
    decimals: 18,
    logo: null,
    logoImg: "/images/coink_logo.png",
  },
];

function TokenLogo({ token, size = 20 }) {
  if (token.logoImg) {
    return (
      <Image
        src={token.logoImg}
        alt={token.symbol}
        width={size}
        height={size}
        className="rounded-full"
      />
    );
  }
  return <span style={{ fontSize: size * 0.75 }}>{token.logo}</span>;
}

function TokenSelector({ selected, onChange, exclude, label }) {
  const [open, setOpen] = useState(false);
  const filtered = TOKENS.filter((t) => t.address !== exclude?.address);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl font-heading text-sm font-bold
          bg-black/40 border border-pink-500/30 hover:border-pink-500/70
          text-white transition-all hover:shadow-[0_0_12px_rgba(255,51,187,0.4)]"
      >
        <TokenLogo token={selected} size={20} />
        <span>{selected.symbol}</span>
        <svg className="w-3 h-3 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 z-20 min-w-[160px]
            bg-[hsl(270_50%_10%)] border border-pink-500/30 rounded-xl shadow-xl
            shadow-pink-900/40 overflow-hidden">
            {filtered.map((token) => (
              <button
                key={token.address}
                onClick={() => { onChange(token); setOpen(false); }}
                className="w-full flex items-center gap-2 px-4 py-3 text-sm font-heading
                  text-left hover:bg-pink-500/10 transition-colors
                  border-b border-white/5 last:border-0"
              >
                <TokenLogo token={token} size={18} />
                <span className="font-bold">{token.symbol}</span>
              </button>
            ))}
          </div>
        </>
      )}
      {label && (
        <span className="absolute -top-5 left-0 text-xs text-purple-300/60 font-heading uppercase tracking-wider">
          {label}
        </span>
      )}
    </div>
  );
}

export default function SwapWidget() {
  const { account, tokenBalance, tokenSymbol, isPolygonNetwork, connectWallet, isConnecting } =
    useWallet();

  const [fromToken, setFromToken] = useState(TOKENS[0]); // USDC
  const [toToken, setToToken] = useState(TOKENS[1]); // COINK
  const [amount, setAmount] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => { setIsMounted(true); }, []);

  const handleFlip = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setAmount("");
  };

  const handleSwap = () => {
    const url = buildUniswapUrl(fromToken.address, toToken.address, amount);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const coinkBalance =
    isMounted && account && isPolygonNetwork() && tokenBalance !== null
      ? tokenBalance.toLocaleString(undefined, { maximumFractionDigits: 4 })
      : null;

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Widget card */}
      <div
        className="relative rounded-2xl border border-pink-500/30
          bg-black/60 backdrop-blur-xl
          shadow-[0_0_40px_rgba(255,51,187,0.15),0_0_80px_rgba(139,92,246,0.1)]
          p-5 sm:p-6"
      >
        {/* Subtle inner glow top */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-pink-500/50 to-transparent rounded-t-2xl" />

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl text-white text-glow-pink tracking-wide">
            SWAP
          </h2>
          <div className="flex items-center gap-2 text-xs text-purple-300/60 font-heading uppercase">
            <span className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.8)] animate-pulse" />
            Polygon
          </div>
        </div>

        {/* From */}
        <div className="mb-2">
          <div className="relative flex items-center gap-2 rounded-xl
            bg-white/5 border border-white/10 hover:border-pink-500/30
            transition-colors p-4">
            <div className="flex-1">
              <div className="text-xs text-purple-300/50 font-heading uppercase mb-1">You pay</div>
              <input
                type="number"
                min="0"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-transparent text-2xl font-display text-white
                  placeholder-white/20 outline-none focus:placeholder-white/10
                  [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none
                  [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
            <div className="mt-4">
              <TokenSelector
                selected={fromToken}
                onChange={setFromToken}
                exclude={toToken}
              />
            </div>
          </div>
        </div>

        {/* Flip button */}
        <div className="flex justify-center my-1 relative z-10">
          <button
            onClick={handleFlip}
            className="w-9 h-9 flex items-center justify-center
              rounded-xl bg-[hsl(270_50%_15%)] border border-pink-500/30
              hover:border-pink-500/70 hover:shadow-[0_0_15px_rgba(255,51,187,0.4)]
              hover:bg-pink-500/10 transition-all text-pink-400"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          </button>
        </div>

        {/* To */}
        <div className="mb-5">
          <div className="relative flex items-center gap-2 rounded-xl
            bg-white/5 border border-white/10 hover:border-pink-500/30
            transition-colors p-4">
            <div className="flex-1">
              <div className="text-xs text-purple-300/50 font-heading uppercase mb-1">You receive</div>
              <div className="text-2xl font-display text-white/30">~</div>
            </div>
            <div className="mt-4">
              <TokenSelector
                selected={toToken}
                onChange={setToToken}
                exclude={fromToken}
              />
            </div>
          </div>
        </div>

        {/* Balance info */}
        {coinkBalance && (
          <div className="mb-4 text-xs text-purple-300/60 font-heading flex items-center justify-between px-1">
            <span>Your {tokenSymbol} balance</span>
            <span className="text-amber-400/80">{coinkBalance} {tokenSymbol}</span>
          </div>
        )}

        {/* Action buttons */}
        {!isMounted ? null : !account ? (
          <button
            onClick={connectWallet}
            disabled={isConnecting}
            className="w-full py-4 rounded-xl font-display text-xl tracking-wide
              bg-gradient-to-r from-pink-600 to-purple-600
              hover:from-pink-500 hover:to-purple-500
              hover:shadow-[0_0_25px_rgba(255,51,187,0.5)]
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all text-white"
          >
            {isConnecting ? "Connecting..." : "Connect Wallet"}
          </button>
        ) : !isPolygonNetwork() ? (
          <button
            className="w-full py-4 rounded-xl font-display text-xl tracking-wide
              bg-amber-500/20 border border-amber-500/50 text-amber-400 cursor-not-allowed"
          >
            Switch to Polygon
          </button>
        ) : (
          <div className="flex flex-col gap-2">
            <button
              onClick={handleSwap}
              className="w-full py-4 rounded-xl font-display text-xl tracking-wide
                bg-gradient-to-r from-pink-600 to-purple-600
                hover:from-pink-500 hover:to-purple-500
                hover:shadow-[0_0_25px_rgba(255,51,187,0.5)]
                transition-all text-white"
            >
              Swap on Uniswap
            </button>
          </div>
        )}

        {/* Disclaimer */}
        <p className="mt-4 text-center text-[11px] text-purple-400/40 font-heading leading-relaxed">
          Swapping opens the selected DEX in a new tab with tokens pre-filled.
          Always verify contract addresses before trading.
        </p>

        {/* Bottom glow line */}
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent rounded-b-2xl" />
      </div>

      {/* Contract address */}
      <div className="mt-4 text-center">
        <p className="text-xs text-purple-400/40 font-heading">
          {COINK_SYMBOL} contract:{" "}
          <a
            href={`https://polygonscan.com/token/${COINK_ADDRESS}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-500/50 hover:text-pink-400 transition-colors underline underline-offset-2"
          >
            {COINK_ADDRESS.slice(0, 6)}...{COINK_ADDRESS.slice(-4)}
          </a>
        </p>
      </div>
    </div>
  );
}
