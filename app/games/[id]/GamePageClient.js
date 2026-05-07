"use client";

import NavbarWithConnectWallet from "../../../ui/components/homepage/navbar_with_connect_wallet";
import GameTimer from "../../components/game_timer";
import Player1 from "../../components/games/logic/Player1";
import { useWalletNFTs } from "../../hooks/useWalletNFTs";
import { useWallet } from "../../context/WalletContext";

const FALLBACK_IMAGES = [
  "/images/games/NFTs/FARMER.png",
  "/images/games/NFTs/REFEREE.png",
  "/images/games/NFTs/LAWYER.png",
  "/images/games/NFTs/BANKER.jpg",
];

export default function GamePageClient() {
  const { account } = useWallet();
  const { nftImages, isLoading, error } = useWalletNFTs();

  const images = account && !isLoading && nftImages.length > 0
    ? nftImages
    : FALLBACK_IMAGES;

  return (
    <main style={{ backgroundImage: 'url(/background-2.jpeg)', backgroundSize: "cover", backgroundPosition: 'center bottom' }}>
      <NavbarWithConnectWallet show_logo={true} />
      <div className="flex justify-between hero hero-overlay h-screen text-neutral-content overflow-hidden px-6">

        {/* Player 1 Game */}
        {isLoading ? (
          <div className="flex flex-1 pt-24 h-screen justify-around items-center">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <Player1 images={images} />
        )}

        {/* Game timer */}
        <GameTimer seconds={6} />

        {/* Player 2 Game */}
        <div className="flex flex-1 pt-24 h-screen justify-around">
          <div>
            <div className="flex flex-col">
              <a className="btn btn-ghost glass no-animation">Your combination</a>
            </div>
          </div>
          <div>
            <div className="flex flex-col">
              <a className="btn btn-ghost glass no-animation">Player 2</a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
