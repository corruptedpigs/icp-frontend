"use client";

import { useRouter } from "next/navigation";
import ChooseGameCard from "../components/choose_game_card";
import NavbarWithConnectWallet from "../../ui/components/homepage/navbar_with_connect_wallet";
import GameHUD from "../components/GameHUD";
import styles from '../../styles/Game.module.css';
import { useJoinGame } from "../hooks/useJoinGame";
import { useWallet } from "../context/WalletContext";

function getJoinErrorMessage(error) {
  const message = error?.message || "Could not join the game.";
  if (message.includes("could not coalesce error") || message.includes("address does not match")) {
    return "Wallet could not sign with the connected account. Check the selected Phantom account, reconnect, and try again.";
  }
  return message;
}

export default function GamesPageClient() {
  const router = useRouter();
  const { account, connectWallet } = useWallet();
  const { joinGame, isLoading, error, isWaiting } = useJoinGame();

  const handleJoinLogic = async (e) => {
    e.preventDefault();

    // Ensure wallet is connected first
    if (!account) {
      await connectWallet();
      return;
    }

    try {
      await joinGame();
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
            <div className="flex flex-wrap items-center justify-center gap-24">

              <div
                onClick={handleJoinLogic}
                className={isLoading || isWaiting ? "cursor-not-allowed" : "cursor-pointer"}
                title={isLoading || isWaiting ? (isLoading ? "Signing…" : "Waiting for opponent…") : undefined}
              >
                {isLoading || isWaiting ? (
                  <span className="loading loading-spinner loading-lg text-white" />
                ) : (
                  <ChooseGameCard
                    bg_image_path="/images/games/guessing-normal-2.png"
                    title="Logic"
                    link="#"
                  />
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
