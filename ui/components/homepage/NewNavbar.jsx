"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "../../../app/components/LanguageContext";
import LanguageToggle from "../../../app/components/LanguageToggle";

const NewNavbar = () => {
  const { t, ready } = useTranslations();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!ready) return null;

  const navItems = [
    { key: "games", id: "games" },
    { key: "goodDeeds", id: "good-deeds" },
    { key: "tokenomics", id: "tokenomics" },
    { key: "community", id: "community" },
    { key: "backers", id: "backers" },
  ];

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-background/90 backdrop-blur-md border-b border-border/50" : "bg-transparent"}`}>
      <div className="container mx-auto flex items-center justify-between py-4">
        <img src="/logo.png" alt="Corrupted Pigs" className="h-12 w-auto animate-float" />
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button key={item.key} onClick={() => scrollTo(item.id)} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              {t(`nav.${item.key}`)}
            </button>
          ))}
          <LanguageToggle />
          <a href="//discord.gg/mX4hDzyYPT" target="_blank" rel="noopener noreferrer" className="px-5 py-2 rounded-lg bg-secondary text-secondary-foreground font-semibold text-sm hover:opacity-90 transition-opacity">
            {t("nav.joinCommunity")}
          </a>
        </div>
        <div className="flex items-center gap-3 md:hidden">
          <LanguageToggle />
          <button onClick={() => setMobileOpen(!mobileOpen)} className="text-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={mobileOpen ? "M18 6L6 18M6 6l12 12" : "M3 12h18M3 6h18M3 18h18"} /></svg>
          </button>
        </div>
      </div>
      {mobileOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-md border-b border-border/50 px-6 pb-4">
          {navItems.map((item) => (
            <button key={item.key} onClick={() => scrollTo(item.id)} className="block w-full text-left py-3 text-muted-foreground hover:text-primary transition-colors">
              {t(`nav.${item.key}`)}
            </button>
          ))}
          <Link href="/swap" onClick={() => setMobileOpen(false)} className="block w-full text-left py-3 text-primary font-heading hover:text-primary/80 transition-colors">
            {t("nav.swap")}
          </Link>
        </div>
      )}
    </nav>
  );
};

export default NewNavbar;
