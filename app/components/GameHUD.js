"use client";

import { useWallet } from "../context/WalletContext";
import { useWalletNFTs } from "../hooks/useWalletNFTs";

export default function GameHUD() {
  const { tokenBalance, tokenSymbol } = useWallet();
  const { nftImages } = useWalletNFTs();

  return (
    <div className="fixed top-40 left-4 z-40 flex flex-col gap-2">

      {/* Your $COINK */}
      <div className="bg-black/60 backdrop-blur-md border border-yellow-400/30 rounded-xl px-4 py-2 flex items-center gap-3 shadow-[0_0_15px_rgba(244,182,37,0.2)]">
        <div className="bg-yellow-400 rounded-full p-1.5">
          {/* Coins icon */}
          <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/><path d="M7 6h1v4"/><path d="m16.71 13.88.7.71-2.82 2.82"/>
          </svg>
        </div>
        <div>
          <p className="text-[10px] font-semibold text-gray-400 uppercase leading-none mb-1">Your {tokenSymbol}</p>
          <p className="text-xl text-yellow-400 leading-none font-bold">
            {tokenBalance !== null ? Number(tokenBalance).toLocaleString() : '—'}
          </p>
        </div>
      </div>

      {/* Wallet cards */}
      <div className="bg-black/60 backdrop-blur-md border border-pink-500/30 rounded-xl px-4 py-2 flex items-center gap-3 shadow-[0_0_15px_rgba(255,51,187,0.2)]">
        <div className="bg-pink-500 rounded-full p-1.5">
          {/* Layers icon */}
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 2 2 7l10 5 10-5-10-5z"/><path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/>
          </svg>
        </div>
        <div>
          <p className="text-[10px] font-semibold text-gray-400 uppercase leading-none mb-1">Wallet</p>
          <p className="text-xl text-white leading-none font-bold">{nftImages.length} CARDS</p>
        </div>
      </div>

      {/* W - L */}
      <div className="hidden md:flex bg-black/60 backdrop-blur-md border border-white/10 rounded-xl px-4 py-2 items-center gap-3">
        <div className="bg-white/10 rounded-full p-1.5">
          {/* Trophy icon */}
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/>
          </svg>
        </div>
        <div>
          <p className="text-[10px] font-semibold text-gray-400 uppercase leading-none mb-1">W - L</p>
          <p className="text-xl text-white leading-none font-bold">0 - 0</p>
        </div>
      </div>

    </div>
  );
}
