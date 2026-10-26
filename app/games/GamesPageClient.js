"use client";

import { useRouter } from "next/navigation";
import ChooseGameCard from "../components/choose_game_card";
import NavbarWithConnectWallet from "../../ui/components/homepage/navbar_with_connect_wallet";
import GameHUD from "../components/GameHUD";
import styles from '../../styles/Game.module.css';
import { useJoinGame } from "../hooks/useJoinGame";
import { useWallet } from "../context/WalletContext";
import { useGameSession } from "../context/GameSessionContext";

function getJoinErrorMessage(error) {
  const message = error?.message || "Could not join the game.";
  if (message.includes("could not coalesce error") || message.includes("address does not match")) {
    return "Wallet could not sign with the connected account. Check the selected Phantom account, reconnect, and try again.";
  }
  return message;
}

export default function GamesPageClient() {
  const router = useRouter();
  const { account, connectWallet, isConnecting } = useWallet();
  const { joinGame, isLoading, error, isWaiting } = useJoinGame();
  const { beginJoin, completeJoin, soundEnabled, setSoundEnabled } = useGameSession();

  const handleJoinLogic = async (e) => {
    e.preventDefault();

    // Ensure wallet is connected first
    if (!account) {
      await connectWallet();
      return;
    }

    try {
      beginJoin();
      const result = await joinGame();
      completeJoin({ ...result.match, matched: result.matched });
      router.push("/games/logic");
    } catch (err) {
      console.error("Failed to join game:", err);
    }
  };

  return (
    <main className={styles.gameContainer}>
      <div className="" style={{ backgroundImage: 'url(/background.jpeg)', backgroundSize: "cover", backgroundPosition: 'center bottom' }}>
        <NavbarWithConnectWallet show_logo={true} />
        <GameHUD />

        {error && (
          <div
            role="alert"
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 alert alert-error shadow-lg w-[calc(100vw-2rem)] max-w-lg min-w-0 max-h-[40vh] overflow-y-auto items-start"
          >
            <span className="min-w-0 whitespace-pre-wrap [overflow-wrap:anywhere]">{getJoinErrorMessage(error)}</span>
          </div>
        )}

        <div className="hero h-screen">
          <div className="hero-overlay bg-opacity-60"></div>
          <div className="container my-24">
            <label className="flex justify-center items-center gap-2 mb-6 text-white">
              <input type="checkbox" checked={soundEnabled} onChange={e => setSoundEnabled(e.target.checked)} disabled={isLoading || isWaiting} />
              Play a sound when an opponent joins
            </label>
            <div className="flex flex-wrap items-center justify-center gap-24">

              <div
                onClick={isLoading || isWaiting || isConnecting ? undefined : handleJoinLogic}
                className={isLoading || isWaiting || isConnecting ? "cursor-not-allowed" : "cursor-pointer"}
                aria-busy={isLoading || isWaiting || isConnecting}
                title={isLoading || isWaiting || isConnecting
                  ? (isConnecting ? "Connecting wallet…" : isWaiting ? "Waiting for opponent…" : "Signing in…")
                  : undefined}
              >
                {isLoading || isWaiting || isConnecting ? (
                  <div className="relative card xs:w-32 md:w-auto image-full shadow-xl shadow-cyan-700 overflow-hidden">
                    <img src="/images/games/guessing-normal-2.png" alt="Logic Game" className="w-full h-auto object-cover" />
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-3 text-white">
                      <span className="loading loading-spinner loading-lg" />
                      <span className="font-mono font-bold uppercase text-center px-2">
                        {isConnecting
                          ? "Connecting wallet…"
                          : isWaiting
                          ? "Waiting for opponent…"
                          : "Signing in…"}
                      </span>
                    </div>
                  </div>
                ) : (
                  <ChooseGameCard bg_image_path="/images/games/guessing-normal-2.png" title="Logic" link="#" />
                )}
              </div>

              <ChooseGameCard bg_image_path="/images/games/strength-normal-2.png" title="Strong" blurred={true} />
              <ChooseGameCard bg_image_path="/images/games/luck-normal-2.png" title="Multiplayer" blurred={true} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
