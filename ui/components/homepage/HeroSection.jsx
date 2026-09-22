"use client";

import { ArrowDown } from "lucide-react";
import { useTranslations } from "../../../app/components/LanguageContext";
import { RotatingBadge } from "./RotatingBadge";

const HeroSection = () => {
  const { t, ready } = useTranslations();
  if (!ready) return null;

  return (
    <section id="topo" className="relative overflow-hidden pt-20">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/hero-bg.jpg)" }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(10,8,18,0.55), rgba(13,11,20,0.78) 55%, #0d0b14)",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-7xl gap-14 px-4 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-28">
        <div className="rise">
          <p className="mb-5 inline-block rounded-full border border-accent/50 bg-white/[0.04] px-4 py-1 font-heading text-[0.7rem] uppercase tracking-[0.25em] text-accent backdrop-blur-md">
            {t("hero.kicker")}
          </p>
          <h1 className="text-balance text-4xl leading-[1.05] tracking-wide sm:text-5xl lg:text-6xl">
            <span className="text-glow-pink text-primary">CPigs</span>{" "}
            <span className="text-foreground">{t("hero.headline").replace(/^CPigs\s*/, "")}</span>
          </h1>
          <p className="mt-6 max-w-xl font-heading text-lg uppercase tracking-wide text-accent text-glow-gold">
            {t("hero.subtitle")}
          </p>
          <a
            href="#jogos"
            className="mt-10 inline-flex items-center gap-2 font-heading text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowDown className="size-4" /> {t("hero.scroll")}
          </a>
        </div>

        <div className="flex justify-center">
          <RotatingBadge size={320} float />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
