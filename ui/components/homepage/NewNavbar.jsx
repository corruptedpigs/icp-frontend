"use client";

import { useState, useEffect } from "react";
import { useWallet } from "../../../app/context/WalletContext";

const navItems = ["About", "Game Modes", "Tokenomics", "Community", "Backers"];

const NewNavbar = () => {
  const { account, isConnecting, connectWallet, disconnectWallet, isPolygonNetwork, trackedTokenAddress, tokenBalance, tokenSymbol, isTokenBalanceLoading, addTrackedTokenToWallet } = useWallet();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id.toLowerCase().replace(" ", "-"))?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

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

  const handleAddToken = async () => {
    await addTrackedTokenToWallet();
  };

  const formatTokenBalance = () => {
    if (!isMounted || !account || !isPolygonNetwork()) return null;
    if (isTokenBalanceLoading) return `Loading ${tokenSymbol}...`;
    if (tokenBalance === null || Number.isNaN(tokenBalance)) return `${tokenSymbol}: N/A`;
    return `${tokenSymbol}: ${tokenBalance.toLocaleString(undefined, { maximumFractionDigits: 4 })}`;
  };

  const tokenBalanceLabel = formatTokenBalance();

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-background/90 backdrop-blur-md border-b border-border/50" : "bg-transparent"}`}>
      <div className="container mx-auto flex items-center justify-between py-4">
        <img src="/logo.png" alt="Corrupted Pigs" className="h-12 w-auto animate-float" />
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button key={item} onClick={() => scrollTo(item)} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              {item}
            </button>
          ))}
          <a href="//discord.gg/mX4hDzyYPT" target="_blank" rel="noopener noreferrer" className="px-5 py-2 rounded-lg bg-secondary text-secondary-foreground font-semibold text-sm hover:opacity-90 transition-opacity">
            Join Community
          </a>
          <button
            onClick={handleWalletAction}
            disabled={isConnecting || !isMounted}
            className={`px-5 py-2 rounded-lg font-semibold text-sm transition-opacity ${account ? 'bg-destructive text-destructive-foreground hover:opacity-90' : 'bg-primary text-primary-foreground hover:opacity-90'} ${isConnecting || !isMounted ? 'opacity-50 cursor-not-allowed' : ''}`}
            title={tokenBalanceLabel || undefined}
          >
            {!isMounted ? 'Loading...' : isConnecting ? 'Connecting...' : account ? formatAddress(account) : 'Connect Wallet'}
          </button>
          {tokenBalanceLabel && (
            <span className="text-xs text-accent font-medium">
              {tokenBalanceLabel}
            </span>
          )}
          {isMounted && account && isPolygonNetwork() && trackedTokenAddress && (
            <button onClick={handleAddToken} className="px-3 py-1 text-xs rounded-lg border border-accent text-accent hover:bg-accent/10 transition-colors">
              Add {tokenSymbol}
            </button>
          )}
          {isMounted && account && !isPolygonNetwork() && (
            <span className="text-xs text-destructive font-medium">
              ⚠ Switch to Polygon
            </span>
          )}
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-foreground">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={mobileOpen ? "M18 6L6 18M6 6l12 12" : "M3 12h18M3 6h18M3 18h18"} /></svg>
        </button>
      </div>
      {mobileOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-md border-b border-border/50 px-6 pb-4">
          {navItems.map((item) => (
            <button key={item} onClick={() => scrollTo(item)} className="block w-full text-left py-3 text-muted-foreground hover:text-primary transition-colors">
              {item}
            </button>
          ))}
          <button
            onClick={handleWalletAction}
            disabled={isConnecting || !isMounted}
            className={`w-full mt-4 px-5 py-2 rounded-lg font-semibold text-sm transition-opacity ${account ? 'bg-destructive text-destructive-foreground hover:opacity-90' : 'bg-primary text-primary-foreground hover:opacity-90'} ${isConnecting || !isMounted ? 'opacity-50 cursor-not-allowed' : ''}`}
            title={tokenBalanceLabel || undefined}
          >
            {!isMounted ? 'Loading...' : isConnecting ? 'Connecting...' : account ? `Disconnect ${formatAddress(account)}` : 'Connect Wallet'}
          </button>
          {tokenBalanceLabel && (
            <p className="text-xs text-accent font-medium mt-2">
              {tokenBalanceLabel}
            </p>
          )}
          {isMounted && account && !isPolygonNetwork() && (
            <p className="text-xs text-destructive font-medium mt-2">
              ⚠ Please switch to Polygon network
            </p>
          )}
          {isMounted && account && isPolygonNetwork() && trackedTokenAddress && (
            <button onClick={handleAddToken} className="w-full mt-2 px-3 py-1 text-xs rounded-lg border border-accent text-accent hover:bg-accent/10 transition-colors">
              Add {tokenSymbol} to wallet
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default NewNavbar;
