"use client";

import NavbarWithConnectWallet from "../../../ui/components/homepage/navbar_with_connect_wallet";
import GameTimer from "../../components/game_timer";
import Player1 from "../../components/games/logic/Player1";
import { useWalletNFTs } from "../../hooks/useWalletNFTs";
import { useWallet } from "../../context/WalletContext";
import GameHUD from "../../components/GameHUD";

const MIN_NFTS_REQUIRED = 3;
const ACQUIRE_NFTS_URL = "/mint";

function NotEnoughNFTs({ count }) {
  return (
    <div className="flex flex-1 pt-24 h-screen justify-around items-center">
      <div className="flex flex-col items-center gap-4 text-center">
        <p className="text-lg font-semibold">
          {count === 0
            ? "You don't have any NFTs in your wallet."
            : `You only have ${count} NFT${count === 1 ? '' : 's'} — you need at least ${MIN_NFTS_REQUIRED} to play.`}
        </p>
        <a href={ACQUIRE_NFTS_URL} className="btn btn-primary">
          Acquire NFTs
        </a>
      </div>
    </div>
  );
}

export default function GamePageClient() {
  const { account } = useWallet();
  const { nfts, nftImages, isLoading } = useWalletNFTs();

  // const hasEnoughNFTs = nftImages.length >= MIN_NFTS_REQUIRED;
  const hasEnoughNFTs = true;

  return (
    <main
      id="game-page"
      style={{ backgroundImage: 'url(/background-2.jpeg)', backgroundSize: "cover", backgroundPosition: 'center bottom' }}
    >
      <NavbarWithConnectWallet show_logo={true} />

      {/* Page body: HUD sidebar + game content side by side */}
      <div id="game-body" className="flex h-screen pt-16 overflow-hidden">

        {/* HUD sidebar — sits in normal flow, no overlap */}
        <div id="game-hud-sidebar" className="flex-none pt-8 pl-4">
          <GameHUD />
        </div>

        {/* Game content */}
        <div id="game-content" className="flex flex-1 flex-col bg-black/40 text-white overflow-y-auto px-6">

          {/* Game timer */}
          <div className="flex justify-end pt-2 pr-2">
            <GameTimer seconds={60} />
          </div>

          {/* Player 1 — full-width centered selection phase */}
          {isLoading ? (
            <div className="flex flex-1 h-full justify-around items-center">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : !account || !hasEnoughNFTs ? (
            <NotEnoughNFTs count={account ? nftImages.length : 0} />
          ) : (
            <Player1 nfts={nfts} images={nftImages} />
          )}

        </div>
      </div>
    </main>
  );
}
