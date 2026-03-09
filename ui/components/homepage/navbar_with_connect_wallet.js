"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import ToggleMuteButton from "../../../app/components/toggle_mute_button";
import { useWallet } from "../../../app/context/WalletContext";

const NavbarWithConnectWallet = ( { show_logo = false }) => {
  const { account, isConnecting, connectWallet, disconnectWallet, isPolygonNetwork } = useWallet();
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleWalletAction = () => {
    if (account) {
      disconnectWallet();
    } else {
      connectWallet();
    }
  };

  return (
    <div className="navbar absolute text-neutral-content">
      <div className="navbar-start lg:w-20">
        {
          show_logo && (
            <Link href="/">
              <Image src="/logo.png"
                alt="corrupted pigs logo"
                height={70}
                width={88}
                priority
                className="hidden lg:block"
              />
            </Link>
          )
        }
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
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
          <ul tabIndex={0} className="menu dropdown-content mt-3 z-[1] p-2 rounded-box shadow bg-slate-600 text-neutral-content border-solid w-52">
            <li>
              <button 
                onClick={handleWalletAction}
                disabled={isConnecting || !isMounted}
                className={`btn ${account ? 'btn-error' : 'btn-warning'} uppercase`}
              >
                {!isMounted ? 'Loading...' : isConnecting ? 'Connecting...' : account ? `Disconnect ${formatAddress(account)}` : 'Connect Wallet'}
              </button>
            </li>
            {isMounted && account && !isPolygonNetwork() && (
              <li className="text-xs text-warning mt-2 px-2" role="alert">
                <span aria-label="Warning">⚠</span> Please switch to Polygon network
              </li>
            )}
          </ul>
        </div>
      </div>
      <div className="navbar-center lg:hidden">
        <Link href="/">
          <Image src="/logo.png"
            alt="corrupted pigs logo"
            height={70}
            width={88}
            priority
          />
        </Link>
      </div>
      <div className="navbar-end hidden lg:flex lg:flex-1">
        <ul className="menu menu-horizontal px-1 uppercase font-bold">
          <li>
            <div className="relative top-[-12px]">
              <ToggleMuteButton />
            </div>
          </li>
          <li>
            <button 
              onClick={handleWalletAction}
              disabled={isConnecting || !isMounted}
              className={`btn btn-sm ${account ? 'btn-error' : 'btn-warning'} uppercase`}
            >
              {!isMounted ? 'Loading...' : isConnecting ? 'Connecting...' : account ? formatAddress(account) : 'Connect wallet'}
            </button>
          </li>
          {isMounted && account && !isPolygonNetwork() && (
            <li className="text-xs text-warning" role="alert">
              <span aria-label="Warning">⚠</span> Switch to Polygon
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}

export default NavbarWithConnectWallet;
