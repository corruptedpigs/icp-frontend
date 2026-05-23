"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { formatUnits } from "ethers";
import Image from "next/image";
import NavbarWithConnectWallet from "../../ui/components/homepage/navbar_with_connect_wallet";
import { useWallet } from "../context/WalletContext";
import { useWalletNFTs } from "../hooks/useWalletNFTs";
import { checkAndPersistFlag } from "../utils/featureFlags";
import { buildBuyCoinkUrl } from "../utils/uniswap";

const DEFAULT_PACK_SIZE = 5;
const MAX_QUANTITY = 20;

export default function MintPageClient() {
  const searchParams = useSearchParams();
  const [unlocked, setUnlocked] = useState(false);
  const [checking, setChecking] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  const {
    account, isPolygonNetwork, connectWallet, isConnecting,
    tokenBalance, tokenSymbol, refreshNftPrices,
    approveToken, mintOneNft, mintNftPacks, calculateMintCost,
    nftSinglePrice, nftPackPrice, nftPackSize, saleActive, provider,
    totalMinted, maxSupply, DEFAULT_NFT_ADDRESS
  } = useWallet();

  const { nfts } = useWalletNFTs();

  const isPreviewSuccess = searchParams.get("preview_success") === "1";
  const [quantity, setQuantity] = useState(1);
  const [txState, setTxState] = useState(isPreviewSuccess ? "success" : "idle");
  const [txHash, setTxHash] = useState(null);
  const [txError, setTxError] = useState(null);
  const [mintProgress, setMintProgress] = useState({ current: 0, total: 0 });
  const [preMintTotal, setPreMintTotal] = useState(null);
  const [pricesLoaded, setPricesLoaded] = useState(false);

  const packSize = nftPackSize ? Number(nftPackSize) : DEFAULT_PACK_SIZE;
  const remainingSupply = totalMinted !== null && maxSupply !== null
    ? Number(maxSupply) - Number(totalMinted)
    : null;
  const effectiveMax = remainingSupply !== null
    ? Math.min(MAX_QUANTITY, remainingSupply)
    : MAX_QUANTITY;

  useEffect(() => { setIsMounted(true); }, []);

  useEffect(() => {
    if (isMounted && account && isPolygonNetwork()) {
      refreshNftPrices();
    }
  }, [isMounted, account, isPolygonNetwork, refreshNftPrices]);

  useEffect(() => {
    if (nftSinglePrice !== null || nftPackPrice !== null) {
      setPricesLoaded(true);
    }
  }, [nftSinglePrice, nftPackPrice]);

  useEffect(() => {
    if (effectiveMax < quantity) {
      setQuantity(effectiveMax);
    }
  }, [effectiveMax, quantity]);

  useEffect(() => {
    setUnlocked(checkAndPersistFlag("mint", searchParams));
    setChecking(false);
  }, [searchParams]);

  const packs = Math.floor(quantity / packSize);
  const singles = quantity % packSize;

  const totalTxCount = packs > 0 ? 1 + singles : singles;

  let displayCost = null;
  if (nftSinglePrice && nftPackPrice) {
    const total = (packs > 0 ? nftPackPrice * BigInt(packs) : 0n) + (singles > 0 ? nftSinglePrice * BigInt(singles) : 0n);
    displayCost = formatUnits(total, 18);
  }

  const showSalePaused = saleActive === false;
  const showPricingLoading = account && isPolygonNetwork && !pricesLoaded && saleActive === null;

  const handleMint = useCallback(async () => {
    if (!account || !provider) return;
    setTxState("approving");
    setTxError(null);
    setTxHash(null);

    try {
      const mintedBefore = Number(totalMinted ?? 0);
      setPreMintTotal(mintedBefore);

      const size = nftPackSize ? Number(nftPackSize) : DEFAULT_PACK_SIZE;
      const packCount = Math.floor(quantity / size);
      const singleCount = quantity % size;

      const totalCost = await calculateMintCost(packCount, singleCount);
      if (totalCost <= 0) throw new Error("Invalid mint cost — unable to calculate price");

      setTxState("approving");
      const approveTx = await approveToken(
        process.env.NEXT_PUBLIC_TRACKED_NFT_ADDRESS,
        totalCost
      );
      setTxHash(approveTx.hash);
      await approveTx.wait();

      setMintProgress({ current: 0, total: totalTxCount });
      setTxState("minting");

      if (packCount > 0) {
        const mintTx = await mintNftPacks(packCount);
        setTxHash(mintTx.hash);
        await mintTx.wait();
      }

      for (let i = 0; i < singleCount; i++) {
        // eslint-disable-next-line no-await-in-loop
        const mintTx = await mintOneNft();
        setTxHash(mintTx.hash);
        // eslint-disable-next-line no-await-in-loop
        await mintTx.wait();
        setMintProgress(prev => ({ ...prev, current: prev.current + 1 }));
      }

      setTxState("success");
    } catch (err) {
      console.error("Mint error:", err);
      const message = err?.reason || err?.message || "Transaction failed";
      if (message.includes("user rejected") || message.includes("denied")) {
        setTxError("Transaction was rejected in your wallet");
      } else if (message.includes("execution reverted")) {
        setTxError("Transaction reverted — check your COINK balance and try again");
      } else {
        setTxError(message);
      }
      setTxState("error");
    }
  }, [account, provider, quantity, approveToken, mintOneNft, mintNftPacks, calculateMintCost, totalTxCount, nftPackSize, totalMinted]);

  const reset = () => {
    setTxState("idle");
    setTxHash(null);
    setTxError(null);
    setMintProgress({ current: 0, total: 0 });
  };

  if (checking) return null;
  if (!unlocked) return <LockedState />;

  return (
    <div className="relative min-h-screen overflow-hidden"
      style={{ background: "hsl(270 59% 10%)" }}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-20 blur-[120px]"
          style={{ background: "hsl(320 100% 60%)" }} />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full opacity-10 blur-[150px]"
          style={{ background: "hsl(42 91% 55%)" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10 blur-[150px]"
          style={{ background: "hsl(270 70% 40%)" }} />
      </div>

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

      <div className="pointer-events-none absolute inset-0 opacity-[0.03]">
        <svg className="w-full h-full">
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
      </div>

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

      <NavbarWithConnectWallet show_logo={true} />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 pt-20 pb-10">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="font-display text-5xl sm:text-6xl text-white text-glow-pink tracking-wider mb-2">
              MINT
            </h1>
            <p className="text-purple-300/60 font-heading text-sm uppercase tracking-widest">
              Corrupted Pigs NFTs
            </p>
          </div>

          {txState === "success" ? (
            <SuccessState nfts={nfts} onReset={reset} preMintTotal={preMintTotal} nftContractAddress={DEFAULT_NFT_ADDRESS} />
          ) : (
            <div className="relative rounded-2xl border border-pink-500/30
              bg-black/60 backdrop-blur-xl
              shadow-[0_0_40px_rgba(255,51,187,0.15),0_0_80px_rgba(139,92,246,0.1)]
              p-5 sm:p-6">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-pink-500/50 to-transparent rounded-t-2xl" />

              {/* Quantity selector */}
              <div className="mb-6">
                <label className="font-heading text-sm text-purple-300/60 uppercase tracking-wider mb-3 block">
                  Quantity: <span className="text-white text-lg">{quantity}</span>
                </label>
                <input
                  type="range"
                  min={1}
                  max={effectiveMax}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="range range-primary w-full"
                  disabled={txState === "approving" || txState === "minting"}
                />
                <div className="flex justify-between text-xs text-purple-400/40 font-heading mt-1">
                  <span>1</span>
                  <span>{effectiveMax}{remainingSupply !== null && remainingSupply < MAX_QUANTITY ? " (supply)" : ""}</span>
                </div>
                <input
                  type="number"
                  min={1}
                  max={effectiveMax}
                  value={quantity}
                  onChange={(e) => {
                    const v = Math.min(effectiveMax, Math.max(1, Number(e.target.value) || 1));
                    setQuantity(v);
                  }}
                  className="w-full mt-3 bg-white/5 border border-white/10 rounded-xl px-4 py-2
                    text-white font-heading text-center outline-none focus:border-pink-500/30
                    [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none
                    [&::-webkit-inner-spin-button]:appearance-none"
                  disabled={txState === "approving" || txState === "minting"}
                />
              </div>

              {/* Supply warning */}
              {remainingSupply !== null && remainingSupply < MAX_QUANTITY && (
                <div className="mb-4 text-xs text-amber-400/80 font-heading text-center">
                  Only {remainingSupply} NFT{remainingSupply !== 1 ? "s" : ""} remaining
                </div>
              )}

              {/* Price breakdown */}
              <div className="mb-6 space-y-2 text-sm">
                <div className="flex justify-between text-purple-300/60 font-heading">
                  <span>Packs ({packs} &times; {packSize} NFTs)</span>
                  <span className="text-white">
                    {nftPackPrice ? `${formatUnits(nftPackPrice, 18)} ${tokenSymbol}` : "—"}
                  </span>
                </div>
                {packs > 1 && (
                  <div className="flex justify-between text-purple-300/40 font-heading text-xs">
                    <span>&times;{packs}</span>
                    <span>≈ {nftPackPrice ? `${formatUnits(nftPackPrice * BigInt(packs), 18)} ${tokenSymbol}` : "—"}</span>
                  </div>
                )}
                <div className="flex justify-between text-purple-300/60 font-heading">
                  <span>Singles ({singles} &times; 1 NFT)</span>
                  <span className="text-white">
                    {nftSinglePrice ? `${formatUnits(nftSinglePrice * BigInt(singles || 1), 18)} ${tokenSymbol}` : "—"}
                  </span>
                </div>
                <hr className="border-purple-500/20 my-2" />
                <div className="flex justify-between font-heading text-base">
                  <span className="text-amber-400/80">Total</span>
                  <span className="text-amber-400 font-bold">
                    {displayCost ? `${displayCost} ${tokenSymbol}` : "Loading..."}
                  </span>
                </div>
                {tokenBalance !== null && displayCost && (
                  <div className={`text-xs font-heading text-right ${Number(displayCost) > tokenBalance ? "text-red-400" : "text-green-400/60"}`}>
                    {tokenBalance !== null && displayCost
                      ? (Number(displayCost) > tokenBalance
                          ? <span>Insufficient balance ({tokenBalance.toLocaleString()} {tokenSymbol})</span>
                          : `Balance: ${tokenBalance.toLocaleString()} ${tokenSymbol}`)
                      : `${tokenSymbol} balance: —`
                    }
                    {tokenBalance !== null && displayCost && Number(displayCost) > tokenBalance && (
                      <a href={buildBuyCoinkUrl(displayCost)} target="_blank" rel="noopener noreferrer"
                        className="text-pink-400 hover:text-pink-300 underline underline-offset-2 ml-1">
                        Get {tokenSymbol} on Uniswap
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Transaction status */}
              {txState === "approving" && (
                <div className="mb-4 text-center">
                  <span className="loading loading-spinner loading-sm text-pink-500"></span>
                  <p className="text-purple-300/60 font-heading text-xs mt-2">
                    Approving token spend...
                  </p>
                  {txHash && (
                    <a href={`https://polygonscan.com/tx/${txHash}`} target="_blank" rel="noopener noreferrer"
                      className="text-pink-500/50 hover:text-pink-400 font-heading text-xs underline underline-offset-2 mt-1 inline-block">
                      View on Polygonscan
                    </a>
                  )}
                </div>
              )}

              {txState === "minting" && (
                <div className="mb-4 text-center">
                  <span className="loading loading-spinner loading-sm text-pink-500"></span>
                  <p className="text-purple-300/60 font-heading text-xs mt-2">
                    Minting {quantity} NFT{quantity > 1 ? "s" : ""}...
                    {totalTxCount > 1 && ` (${mintProgress.current + (packs > 0 ? 1 : 0)}/${totalTxCount})`}
                  </p>
                  {txHash && (
                    <a href={`https://polygonscan.com/tx/${txHash}`} target="_blank" rel="noopener noreferrer"
                      className="text-pink-500/50 hover:text-pink-400 font-heading text-xs underline underline-offset-2 mt-1 inline-block">
                      View on Polygonscan
                    </a>
                  )}
                </div>
              )}

              {txState === "error" && (
                <div className="mb-4 text-center">
                  <p className="text-red-400 font-heading text-xs">{txError}</p>
                </div>
              )}

              {/* Action buttons */}
              {!isMounted ? null : !account ? (
                <button onClick={connectWallet} disabled={isConnecting}
                  className="w-full py-4 rounded-xl font-display text-xl tracking-wide
                    bg-gradient-to-r from-pink-600 to-purple-600
                    hover:from-pink-500 hover:to-purple-500
                    hover:shadow-[0_0_25px_rgba(255,51,187,0.5)]
                    disabled:opacity-50 disabled:cursor-not-allowed transition-all text-white">
                  {isConnecting ? "Connecting..." : "Connect Wallet"}
                </button>
              ) : !isPolygonNetwork() ? (
                <button className="w-full py-4 rounded-xl font-display text-xl tracking-wide
                  bg-amber-500/20 border border-amber-500/50 text-amber-400 cursor-not-allowed">
                  Switch to Polygon
                </button>
              ) : showSalePaused ? (
                <div className="text-center">
                  <p className="text-amber-400 font-heading text-sm mb-2">Sale is not currently active</p>
                  <p className="text-purple-300/40 font-heading text-xs">Check back later or contact an administrator</p>
                </div>
              ) : showPricingLoading ? (
                <div className="text-center">
                  <span className="loading loading-spinner loading-sm text-pink-500"></span>
                  <p className="text-purple-300/60 font-heading text-xs mt-2">Loading pricing...</p>
                </div>
              ) : txState === "error" ? (
                <div className="flex gap-2">
                  <button onClick={reset}
                    className="flex-1 py-4 rounded-xl font-display text-lg tracking-wide
                      bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all">
                    Cancel
                  </button>
                  <button onClick={handleMint}
                    className="flex-[2] py-4 rounded-xl font-display text-lg tracking-wide
                      bg-gradient-to-r from-pink-600 to-purple-600
                      hover:from-pink-500 hover:to-purple-500
                      hover:shadow-[0_0_25px_rgba(255,51,187,0.5)] transition-all text-white">
                    Retry
                  </button>
                </div>
              ) : txState === "approving" || txState === "minting" ? (
                <button disabled
                  className="w-full py-4 rounded-xl font-display text-xl tracking-wide
                    bg-gradient-to-r from-pink-600/50 to-purple-600/50 text-white/50 cursor-not-allowed">
                  {txState === "approving" ? "Approving..." : "Minting..."}
                </button>
              ) : (
                <button onClick={handleMint}
                  disabled={!displayCost}
                  className="w-full py-4 rounded-xl font-display text-xl tracking-wide
                    bg-gradient-to-r from-pink-600 to-purple-600
                    hover:from-pink-500 hover:to-purple-500
                    hover:shadow-[0_0_25px_rgba(255,51,187,0.5)]
                    disabled:opacity-50 disabled:cursor-not-allowed transition-all text-white">
                  Approve & Mint ({displayCost || "..."} {tokenSymbol})
                </button>
              )}

              <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent rounded-b-2xl" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function LockedState() {
  return (
    <div className="text-center max-w-sm mx-auto min-h-screen flex flex-col items-center justify-center">
      <div className="mb-6 text-7xl">🐷</div>
      <h1 className="font-display text-4xl text-white text-glow-pink mb-3">ACCESS RESTRICTED</h1>
      <p className="text-purple-300/60 font-heading text-sm leading-relaxed mb-6">
        The Mint page is currently in testing mode.<br />
        If you have an access link, please use it to unlock this page.
      </p>
      <div className="rounded-xl bg-black/40 border border-pink-500/20 px-4 py-3 text-xs text-purple-400/50 font-mono">
        <span className="text-pink-400/70">Talk to an Administrator to unlock access</span>
      </div>
    </div>
  );
}

function SuccessState({ nfts, onReset, preMintTotal, nftContractAddress }) {
  const [addingNfts, setAddingNfts] = useState(false);

  const addNftsToMetaMask = useCallback(async () => {
    if (!window.ethereum || preMintTotal === null) return;
    setAddingNfts(true);
    const quantity = nfts.length;
      for (let i = 1; i <= quantity; i++) {
        const tokenId = preMintTotal + i;
        try {
          // eslint-disable-next-line no-await-in-loop
          await window.ethereum.request({
          method: "wallet_watchAsset",
          params: {
            type: "ERC721",
            options: {
              address: nftContractAddress,
              tokenId: tokenId.toString(),
            },
          },
        });
      } catch (err) {
        if (err.code !== 4001) {
          console.error("Failed to add token", tokenId, err);
        }
      }
    }
    setAddingNfts(false);
  }, [nfts.length, preMintTotal, nftContractAddress]);

  return (
    <div className="text-center">
      <div className="animate-float mb-4 text-7xl">🎉</div>
      <h2 className="font-display text-4xl text-white text-glow-pink mb-3">Minted!</h2>
      <p className="text-purple-300/60 font-heading text-sm mb-8">
        Your new NFTs have arrived.
      </p>

      {nfts.length > 0 && (
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {nfts.slice(-12).reverse().map((nft, i) => (
            <div key={i} className="w-28 h-28 sm:w-36 sm:h-36 rounded-xl overflow-hidden border border-pink-500/30
              shadow-[0_0_15px_rgba(255,51,187,0.2)]"
              style={{ animation: `fadeInUp 0.3s ease-out ${i * 0.05}s both` }}>
              <Image src={nft.image} alt={nft.name || "NFT"} width={144} height={144}
                className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-3">
        {preMintTotal !== null && (
          <button onClick={addNftsToMetaMask} disabled={addingNfts}
            className="w-full py-3 rounded-xl font-display text-lg tracking-wide
              bg-white/5 border border-white/10 text-white hover:bg-white/10
              disabled:opacity-50 disabled:cursor-not-allowed transition-all">
            {addingNfts ? "Adding..." : "Add NFTs to MetaMask"}
          </button>
        )}

        <button onClick={onReset}
          className="w-full py-4 rounded-xl font-display text-xl tracking-wide
            bg-gradient-to-r from-pink-600 to-purple-600
            hover:from-pink-500 hover:to-purple-500
            hover:shadow-[0_0_25px_rgba(255,51,187,0.5)] transition-all text-white">
          Mint More
        </button>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px) scale(0.8); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}

