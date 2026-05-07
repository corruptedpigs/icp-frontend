"use client";

import ChooseGameCard from "../components/choose_game_card";
import NavbarWithConnectWallet from "../../ui/components/homepage/navbar_with_connect_wallet";
import GameHUD from "../components/GameHUD";
import styles from '../../styles/Game.module.css';

export default function GamesPageClient() {
  return (
    <main className={styles.gameContainer}>
      <div className="" style={{ backgroundImage: 'url(/background.jpeg)', backgroundSize: "cover", backgroundPosition: 'center bottom' }}>
        <NavbarWithConnectWallet show_logo={true} />
        <GameHUD />
        <div className="hero h-screen">
          <div className="hero-overlay bg-opacity-60"></div>
          <div className="container my-24">
            <div className="flex flex-wrap items-center justify-center gap-24">
              <ChooseGameCard bg_image_path="/images/games/guessing-normal-2.png" title="Logic" link="/games/logic" />
              <ChooseGameCard bg_image_path="/images/games/strength-normal-2.png" title="Strong" blurred={true} />
              <ChooseGameCard bg_image_path="/images/games/luck-normal-2.png" title="Multiplayer" blurred={true} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
