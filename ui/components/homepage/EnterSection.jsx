"use client";

import { ExternalLink } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "../../../app/components/LanguageContext";

const tiers = [
  { name: "Piglet", image: "/images/backers/piglet.png" },
  { name: "Pig", image: "/images/backers/pig.png" },
  { name: "Hog", image: "/images/backers/hog.png" },
  { name: "Boar", image: "/images/backers/boar.png" },
  { name: "Orc", image: "/images/backers/orc.png" },
  { name: "CPig", image: "/images/backers/cpig.png" },
];

const EnterSection = () => {
  const { t, ready } = useTranslations();
  if (!ready) return null;

  return (
    <section id="entrar" className="grain border-t border-border/60 py-20 lg:py-28">
      <div className="mx-auto max-w-5xl px-4 text-center">
        <h2 className="text-3xl uppercase sm:text-4xl lg:text-5xl">{t("enter.title")}</h2>
        <p className="mx-auto mt-5 max-w-2xl text-muted-foreground">{t("enter.guide")}</p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {[
            { big: t("enter.need1"), sub: t("enter.need1sub") },
            { big: t("enter.need3"), sub: t("enter.need3sub") },
          ].map((item) => (
            <div
              key={item.big}
              className="glass-card-gold p-8"
            >
              <p className="font-display text-4xl text-accent">{item.big}</p>
              <p className="mt-2 text-sm uppercase tracking-widest text-muted-foreground">
                {item.sub}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-3 gap-4 sm:grid-cols-6">
          {tiers.map((tier) => (
            <div key={tier.name} className="glass-card p-3">
              <div className="relative aspect-[512/720] w-full overflow-hidden rounded-lg">
                <Image
                  src={tier.image}
                  alt={tier.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 33vw, 10vw"
                />
              </div>
              <p className="mt-2 font-heading text-[0.65rem] uppercase tracking-widest text-muted-foreground">
                {tier.name}
              </p>
            </div>
          ))}
        </div>

        <a
          href="https://corruptedpigs.com/mint?mint=unlocked"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-10 inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-bold uppercase tracking-wider text-accent-foreground transition-colors hover:bg-accent/90"
          style={{ boxShadow: "var(--shadow-gold)" }}
        >
          {t("enter.button")} <ExternalLink className="size-4" />
        </a>
        <p className="mt-4 text-xs text-muted-foreground">{t("enter.note")}</p>
      </div>
    </section>
  );
};

export default EnterSection;
