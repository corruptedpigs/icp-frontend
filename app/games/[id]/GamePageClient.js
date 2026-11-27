"use client";

import NavbarWithConnectWallet from "../../../ui/components/homepage/navbar_with_connect_wallet";
import GameTimer from "../../components/game_timer";
import Player1 from "../../components/games/logic/Player1";
import { useWalletNFTs } from "../../hooks/useWalletNFTs";
import { useWallet } from "../../context/WalletContext";
import GameHUD from "../../components/GameHUD";
import { useSimulation } from "../../context/SimulationContext";
import { fetchGameSession } from "../../hooks/useJoinGame";
import { toClientMs, withClockOffset } from "../../utils/matchmaking";
import { useGameSession } from "../../context/GameSessionContext";

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
  const { simulation } = useSimulation();
  const { opponentReady, match } = useGameSession();
  const moveDeadline = match ? toClientMs(match.move_deadline_at, match.clock_offset_ms ?? 0) : NaN;
  const sessionId = match?.public_id || match?.session_id;

  // Ask the server what really happened before declaring time up.
  const checkDeadline = async () => {
    if (!sessionId || !match?.token) return null;
    const state = withClockOffset(await fetchGameSession(sessionId, match.token, (key) => key));
    return { deadline: toClientMs(state.move_deadline_at, state.clock_offset_ms) };
  };
  const { nfts, nftImages, isLoading } = useWalletNFTs();

  // Real mode keeps the legacy always-true behaviour; simulation enforces the minimum.
  const hasEnoughNFTs = simulation ? nftImages.length >= MIN_NFTS_REQUIRED : true;

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
            {opponentReady && Number.isFinite(moveDeadline) && (
              <GameTimer deadline={moveDeadline} onExpire={checkDeadline} />
            )}
          </div>

          {/* Player 1 — full-width centered selection phase */}
          {isLoading ? (
            <div className="flex flex-1 h-full justify-around items-center">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : !account || !hasEnoughNFTs ? (
            <NotEnoughNFTs count={account ? nftImages.length : 0} />
          ) : (
            <Player1 nfts={nfts} images={nftImages} opponentReady={opponentReady} />
          )}

        </div>
      </div>
    </main>
  );
}
