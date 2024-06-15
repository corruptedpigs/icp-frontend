import NavbarWithConnectWallet from "../../../ui/components/homepage/navbar_with_connect_wallet";
import GameTimer from "../../components/game_timer";
import Player1 from "../../components/games/logic/Player1";

export function generateStaticParams() {
  return [{ id: 'logic' }, { id: '2' }, { id: '3' }]
}

export default function Page() {
  const images = [
    "/images/games/NFTs/FARMER.png",
    "/images/games/NFTs/REFEREE.png",
    "/images/games/NFTs/LAWYER.png",
    "/images/games/NFTs/BANKER.jpg",
  ];

  return (
    <main>
      <div style={{ backgroundImage: 'url(/background.jpeg)', backgroundSize: "cover", backgroundPosition: 'center bottom' }} className="flex justify-center">
        <NavbarWithConnectWallet show_logo={true} />
        <div className="hero hero-overlay h-screen text-neutral-content overflow-hidden flex justify-around">

          {/* Player 1 Game */}
          <div className="pt-24 h-screen flex gap-4">
            <Player1 images={images} />
          </div>

          {/* Game timer */}
          <div className="flex">
            <GameTimer seconds={8} />
          </div>

          {/* Player 2 Game */}
          <div className="pt-24 h-screen flex gap-4">
              <div className="flex flex-col">
                <a className="btn btn-ghost glass no-animation">Your combination</a>
              </div>
            <div className="flex flex-col">
              <a className="btn btn-ghost glass no-animation">Player 2</a>
            </div>
          </div>

        </div>
      </div>
    </main >
  );
}
