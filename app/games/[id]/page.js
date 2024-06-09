import NavbarWithConnectWallet from "../../../ui/components/homepage/navbar_with_connect_wallet";
import GameTimer from "../../components/game_timer";
import styles from '../../../styles/Game.module.css';

export function generateStaticParams() {
  return [{ id: '1' }, { id: '2' }, { id: '3' }]
}

export default function Page({ params }) {
  const { id } = params
  console.debug(id);

  return (
    <main className={styles.gameContainer}>
      <div className="" style={{ backgroundImage: 'url(/background.jpeg)', backgroundSize: "cover", backgroundPosition: 'center bottom' }}>
        <NavbarWithConnectWallet show_logo={true} />
        <div className="hero h-screen text-neutral-content">
          <div className="hero-overlay bg-opacity-60"></div>
          <h1 className="text-3xl">Logic</h1>

          <div className="container hidden my-24">
            <div className="flex gap-4">
              <div className="flex flex-col">
                <a className="btn btn-warning btn-sm">Gallery</a>
              </div>

              <div className="flex flex-row gap-4">
                <div className="flex flex-col">
                  <a className="btn btn-warning text-xl">Player 1</a>
                </div>
                <div className="flex flex-col">
                  <a className="btn btn-warning text-xl">Your combination</a>
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
                  <a className="btn btn-warning text-xl">Player 2</a>
                </div>
                <div className="flex flex-col">
                  <a className="btn btn-warning text-xl">Your combination</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
