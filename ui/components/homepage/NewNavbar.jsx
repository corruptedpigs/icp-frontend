"use client";

import { useState, useEffect } from "react";
import { Menu, X, Volume2, VolumeX } from "lucide-react";
import { useTranslations } from "../../../app/components/LanguageContext";
import LanguageToggle from "../../../app/components/LanguageToggle";

const navItems = [
  { key: "games", id: "jogos" },
  { key: "manual", id: "manual" },
  { key: "burn", id: "burn" },
  { key: "media", id: "media" },
  { key: "enter", id: "entrar" },
];

const NewNavbar = () => {
  const { t, ready } = useTranslations();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!ready) return null;

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  return (
    <header className={`fixed inset-x-0 top-0 z-40 border-b border-border/40 transition-all duration-300 ${scrolled ? "bg-background/60 backdrop-blur-xl" : "bg-transparent"}`}>
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
        <a href="#topo" className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="CPigs"
            className="h-10 w-auto"
            style={{ filter: "drop-shadow(0 0 12px rgba(255,51,187,0.5))" }}
          />
          <span className="font-display text-2xl tracking-wider text-glow-pink">CPigs</span>
        </a>

        <nav className="ml-auto hidden items-center gap-6 lg:flex">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => scrollTo(item.id)}
              className="font-heading text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:text-primary"
            >
              {t(`nav.${item.key}`)}
            </button>
          ))}
        </nav>

        <button
          onClick={() => setSoundOn(!soundOn)}
          className={`ml-auto grid size-9 place-items-center rounded-full border backdrop-blur-md transition-all lg:ml-4 ${
            soundOn
              ? "border-accent/60 bg-accent/15 text-accent shadow-[0_0_18px_rgba(255,194,45,0.45)]"
              : "border-border/60 bg-white/[0.04] text-muted-foreground hover:text-foreground"
          }`}
          aria-label={soundOn ? t("nav.soundOff") : t("nav.soundOn")}
        >
          {soundOn ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
        </button>

        <LanguageToggle />

        <button
          className="lg:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          {mobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {mobileOpen && (
        <nav className="border-t border-border/40 bg-background/90 px-4 pb-4 backdrop-blur-xl lg:hidden">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => scrollTo(item.id)}
              className="block w-full border-b border-border/40 py-3 text-left font-heading text-xs uppercase tracking-wider text-muted-foreground"
            >
              {t(`nav.${item.key}`)}
            </button>
          ))}
        </nav>
      )}
    </header>
  );
};

export default NewNavbar;
