"use client";

import { useState, useEffect } from "react";

const navItems = ["About", "Game Modes", "Tokenomics", "Community", "Backers"];

const NewNavbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id.toLowerCase().replace(" ", "-"))?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

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
        </div>
      )}
    </nav>
  );
};

export default NewNavbar;
