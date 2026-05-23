"use client";

import { useEffect, useState } from 'react';
import Image from "next/image";
import Link from "next/link";
import ToggleMuteButton from "../../../app/components/toggle_mute_button";
import { useWallet } from "../../../app/context/WalletContext";
import AddTokenButton from "./AddTokenButton";
import { isFlagUnlocked } from "../../../app/utils/featureFlags";

const NavbarWithConnectWallet = ({ show_logo = false }) => {
  const { account, isConnecting, connectWallet, disconnectWallet, isPolygonNetwork, tokenBalance, tokenSymbol, isTokenBalanceLoading } = useWallet();
  const [isMounted, setIsMounted] = useState(false);
  const [swapUnlocked, setSwapUnlocked] = useState(false);
  const [mintUnlocked, setMintUnlocked] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setSwapUnlocked(isFlagUnlocked("swap"));
    setMintUnlocked(isFlagUnlocked("mint"));
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

  const formatTokenBalance = () => {
    if (!isMounted || !account || !isPolygonNetwork()) return null;
    if (isTokenBalanceLoading) return `Loading ${tokenSymbol}...`;
    if (tokenBalance === null || Number.isNaN(tokenBalance)) return `${tokenSymbol}: N/A`;
    return `${tokenSymbol}: ${tokenBalance.toLocaleString(undefined, { maximumFractionDigits: 4 })}`;
  };

  const tokenBalanceLabel = formatTokenBalance();

  return (
    <div id="navbar-main" className="navbar absolute text-neutral-content">
      <div className="navbar-start">
        {show_logo && (
          <Link href="/" className="hidden lg:block">
            <Image
              src="/logo.png"
              alt="corrupted pigs logo"
              height={70}
              width={88}
              priority
            />
          </Link>
        )}
        {/* Mobile hamburger */}
        <div className="dropdown">
          <div tabIndex={0} role="button" id="navbar-mobile-menu-btn" className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </div>
          <ul tabIndex={0} className="menu dropdown-content mt-3 z-[1] p-2 rounded-box shadow bg-slate-600 text-neutral-content border-solid w-52">
            <li>
              <button
                id="navbar-mobile-wallet-btn"
                onClick={handleWalletAction}
                disabled={isConnecting || !isMounted}
                className={`btn ${account ? 'btn-error' : 'btn-warning'} uppercase`}
                title={tokenBalanceLabel || undefined}
              >
                {!isMounted ? 'Loading...' : isConnecting ? 'Connecting...' : account ? `Disconnect ${formatAddress(account)}` : 'Connect Wallet'}
              </button>
            </li>
            {isMounted && account && !isPolygonNetwork() && (
              <li id="navbar-mobile-network-warning" className="text-xs text-warning mt-2 px-2" role="alert">
                <span aria-label="Warning">⚠</span> Please switch to Polygon network
              </li>
            )}
            {tokenBalanceLabel && (
              <li id="navbar-mobile-token-balance" className="text-xs text-info mt-1 px-2" aria-live="polite">
                {tokenBalanceLabel}
              </li>
            )}
            {isMounted && swapUnlocked && (
              <li className="mt-2 px-2">
                <Link href="/swap" className="btn btn-sm btn-outline border-pink-500 text-pink-400 uppercase hover:bg-pink-500 hover:border-pink-500">
                  Swap
                </Link>
              </li>
            )}
            {isMounted && mintUnlocked && (
              <li className="mt-2 px-2">
                <Link href="/mint" className="btn btn-sm btn-outline border-pink-500 text-pink-400 uppercase hover:bg-pink-500 hover:border-pink-500">
                  Mint
                </Link>
              </li>
            )}
            {isMounted && (
              <li className="mt-2 px-2">
                <AddTokenButton id="navbar-mobile-add-token-btn" />
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Mobile center logo */}
      <div className="navbar-center lg:hidden">
        <Link href="/">
          <Image src="/logo.png" alt="corrupted pigs logo" height={70} width={88} priority />
        </Link>
      </div>

      {/* Desktop right side */}
      <div className="navbar-end hidden lg:flex lg:flex-1">
        <ul className="menu menu-horizontal px-1 uppercase font-bold gap-4 items-center">
          <li>
            <div className="relative top-[-12px]">
              <ToggleMuteButton />
            </div>
          </li>
          <li>
            <button
              id="navbar-desktop-wallet-btn"
              onClick={handleWalletAction}
              disabled={isConnecting || !isMounted}
              className={`btn btn-sm ${account ? 'btn-error' : 'btn-warning'} uppercase`}
              title={tokenBalanceLabel || undefined}
            >
              {!isMounted ? 'Loading...' : isConnecting ? 'Connecting...' : account ? formatAddress(account) : 'Connect wallet'}
            </button>
          </li>
          {isMounted && account && !isPolygonNetwork() && (
            <li id="navbar-desktop-network-warning" className="text-xs text-warning normal-case" role="alert">
              <span aria-label="Warning">⚠</span> Switch to Polygon
            </li>
          )}
          {isMounted && swapUnlocked && (
            <li>
              <Link href="/swap" className="btn btn-sm btn-outline border-pink-500 text-pink-400 uppercase hover:bg-pink-500 hover:border-pink-500">
                Swap
              </Link>
            </li>
          )}
          {isMounted && mintUnlocked && (
            <li>
              <Link href="/mint" className="btn btn-sm btn-outline border-pink-500 text-pink-400 uppercase hover:bg-pink-500 hover:border-pink-500">
                Mint
              </Link>
            </li>
          )}
          {isMounted && (
            <li>
              <AddTokenButton id="navbar-desktop-add-token-btn" />
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default NavbarWithConnectWallet;
