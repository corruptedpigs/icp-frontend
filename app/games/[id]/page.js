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
    <main style={{ backgroundImage: 'url(/background.jpeg)', backgroundSize: "cover", backgroundPosition: 'center bottom' }}>
      <NavbarWithConnectWallet show_logo={true} />
      <div className="flex justify-between hero hero-overlay h-screen text-neutral-content overflow-hidden px-6">

        {/* Player 1 Game */}
        <Player1 images={images} />

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
