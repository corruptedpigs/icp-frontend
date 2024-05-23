// import InstituitionsRollbar from './institutions_rollbar';
import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  return (
    <div className="container mx-auto">
      <div className="navbar text-neutral-content">
        <div className="navbar-start">
          <div className="hidden md:block">
            <Image src="/logo.png"
              alt="corrupted pigs logo"
              className="dark:invert"
              height={120}
              width={124}
              priority
            />
          </div>
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost md:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
              </svg>
            </div>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 w-52 text-black">
              <li><Link href="https://corruptedpigs.notion.site/Game-Rules-643b79c0b7394b6dafd9adc54157cc80">Game Rules</Link></li>
              <li><Link href="https://corruptedpigs.store">Merchandising</Link></li>
              <li><Link href="#" className="drop-shadow-md">About</Link></li>
              <li><Link href="#" className="btn btn-sm btn-warning glass no-animation">Play the game</Link></li>
            </ul>
          </div>
        </div>
        <div className="navbar-center md:hidden">
          <Image src="/logo.png"
            alt="corrupted pigs logo"
            className="dark:invert"
            height={120}
            width={124}
            priority
          />
        </div>
        <div className="navbar-center hidden md:flex text-black">
          <ul className="menu menu-horizontal px-1 uppercase font-bold">
            <li><Link href="https://corruptedpigs.notion.site/Game-Rules-643b79c0b7394b6dafd9adc54157cc80">Game Rules</Link></li>
            <li><Link href="https://corruptedpigs.store">Merchandising</Link></li>
            <li><Link href="#" className="drop-shadow-md">About</Link></li>
            <li><Link href="#" className="btn btn-sm btn-warning glass no-animation">Play the game</Link></li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Navbar;
