import NavbarWithConnectWallet from "../../../ui/components/homepage/navbar_with_connect_wallet";
import GameTimer from "../../components/game_timer";
import styles from '../../../styles/Game.module.css';
import Image from "next/image";

export function generateStaticParams() {
  return [{ id: 'logic' }, { id: '2' }, { id: '3' }]
}

export default function Page({ params }) {
  return (
    <main className={styles.gameContainer}>
      <div className="" style={{ backgroundImage: 'url(/background.jpeg)', backgroundSize: "cover", backgroundPosition: 'center bottom' }}>
        <NavbarWithConnectWallet show_logo={true} />
        <div className="hero h-screen text-neutral-content">
          <div className="hero-overlay bg-opacity-60"></div>

          <div className="container my-24">
            <div className="flex gap-4">
              <div className="flex flex-col">
                <a className="btn btn-ghost glass no-animation">Gallery</a>
                <div className="flex flex-col flex-1 overflow-auto gap-6">
                  <Image src="/images/games/NFTs/FARMER.png" width={200} height={450}></Image>
                  <Image src="/images/games/NFTs/REFEREE.png" width={200} height={450}></Image>
                  <Image src="/images/games/NFTs/LAWYER.png" width={200} height={450}></Image>
                  <Image src="/images/games/NFTs/BANKER.jpg" width={200} height={450}></Image>
                </div>
              </div>

              <div className="flex flex-row gap-4">
                <div className="flex flex-col">
                  <a className="btn btn-ghost glass no-animation">Player 1</a>
                </div>
                <div className="flex flex-col">
                  <a className="btn btn-ghost glass no-animation">Your combination</a>
                </div>
              </div>

              <div className="flex flex-col">

              </div>


              <div className="mx-auto">
                <GameTimer />
              </div>

              <div className="flex flex-col">

              </div>

              <div className="flex flex-row gap-4">
                <div className="flex flex-col">
                  <a className="btn btn-ghost glass no-animation">Player 2</a>
                </div>
                <div className="flex flex-col">
                  <a className="btn btn-ghost glass no-animation">Your combination</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
