import NavbarWithConnectWallet from "../../../ui/components/homepage/navbar_with_connect_wallet";
import GameTimer from "../../components/game_timer";
import styles from '../../../styles/Game.module.css';
import Image from "next/image";

export function generateStaticParams() {
  return [{ id: 'logic' }, { id: '2' }, { id: '3' }]
}

export default function Page({ params }) {
  const images = [
    "/images/games/NFTs/FARMER.png",
    "/images/games/NFTs/REFEREE.png",
    "/images/games/NFTs/LAWYER.png",
    "/images/games/NFTs/BANKER.jpg",
  ];

  return (
    <main className={styles.gameContainer}>
      <div style={{ backgroundImage: 'url(/background.jpeg)', backgroundSize: "cover", backgroundPosition: 'center bottom' }}>
        <NavbarWithConnectWallet show_logo={true} />
        <div className="hero flex-col h-screen text-neutral-content overflow-hidden">
          <div className="hero-overlay bg-opacity-60"></div>
          <div className="container pt-24 mx-auto h-screen flex">

            <div className="flex flex-col">
              <a className="btn btn-ghost glass no-animation mb-4">Gallery</a>
              <div class="flex-1/3 flex flex-col hover:overflow-auto gap-4 scrollbar-hide">
                {images.map((src, index) => (
                  <Image
                    key={index}
                    src={src}
                    width={200}
                    height={450}
                    className="hover:scale-95 ease-in-out duration-400"
                  />
                ))}
              </div>
            </div>

            <div class="flex-1/3 overflow-auto mx-4">
              <div className="flex flex-row gap-4">
                <div className="flex flex-col">
                  <a className="btn btn-ghost glass no-animation">Player 1</a>
                </div>
                <div className="flex flex-col">
                  <a className="btn btn-ghost glass no-animation">Your combination</a>
                </div>
              </div>
            </div>

            <div className="flex flex-col mx-4">

            </div>

            <div class="flex-1/3 mx-4">
              <div className="mx-auto">
                <GameTimer />
              </div>
            </div>

            <div className="flex flex-col mx-4">

            </div>

            <div className="flex flex-row gap-4 mx-4">
              <div className="flex flex-col">
                <a className="btn btn-ghost glass no-animation">Your combination</a>
              </div>
            </div>
            <div className="flex flex-col mx-4">
              <a className="btn btn-ghost glass no-animation">Player 2</a>
            </div>
          </div>

        </div>
      </div>
    </main >
  );
}
