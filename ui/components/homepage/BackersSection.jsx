"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "../../../app/components/LanguageContext";

const tierData = [
  { key: "piglet", name: "Piglet", price: "€15", image: "/images/backers/piglet.png", highlight: false },
  { key: "pig", name: "Pig", price: "€45", image: "/images/backers/pig.png", highlight: false },
  { key: "hog", name: "Hog", price: "€95", image: "/images/backers/hog.png", highlight: false },
  { key: "boar", name: "Boar", price: "€1,000", image: "/images/backers/boar.png", highlight: true },
  { key: "orc", name: "Orc", price: "€3,000", image: "/images/backers/orc.png", highlight: false },
  { key: "cpig", name: "CPig", price: "Per Case", image: "/images/backers/cpig.png", highlight: false },
];

const BackersSection = () => {
  const { t, ready } = useTranslations();

  if (!ready) return null;

  return (
    <section id="backers" className="py-24 section-gradient">
      <div className="container mx-auto px-4">
        <h2 className="font-display text-4xl md:text-5xl text-center text-accent text-glow-gold mb-2">
          {t("backers.title")}
        </h2>
        <p className="text-center text-muted-foreground mb-6 max-w-2xl mx-auto text-sm">
          {t("backers.subtitle")}
        </p>
        <p className="text-center text-muted-foreground mb-16 max-w-xl mx-auto text-sm">
          {t("backers.description")}
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tierData.map((tier) => {
            const perks = t(`backers.tiers.${tier.key}.perks`);
            return (
              <div
                key={tier.name}
                className={`glass-card p-8 flex flex-col transition-all duration-300 hover:-translate-y-1 ${
                  tier.highlight ? "border-primary/70 shadow-lg shadow-primary/10 ring-1 ring-primary/30" : "hover:border-primary/40"
                }`}
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3 flex-1">
                    <h3 className="font-heading text-lg text-foreground">{tier.name}</h3>
                  </div>
                  <div className="relative w-24 h-24 flex-shrink-0">
                    <Image
                      src={tier.image}
                      alt={tier.name}
                      fill
                      className="object-cover rounded-lg"
                      sizes="80px"
                    />
                  </div>
                </div>

                {tier.highlight && (
                  <span className="text-[10px] font-heading bg-primary text-primary-foreground px-3 py-1 rounded-full self-start mb-4">
                    {t("backers.popular")}
                  </span>
                )}
                <p className="font-display text-2xl text-primary mb-6">{tier.price}</p>
                <ul className="space-y-2 flex-1">
                  {(Array.isArray(perks) ? perks : []).map((perk) => (
                    <li key={perk} className="flex gap-2 text-sm text-muted-foreground">
                      <span className="text-accent flex-shrink-0">✦</span>
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/swap" className="mt-6 w-full py-3 rounded-lg bg-secondary text-secondary-foreground font-heading text-sm hover:bg-secondary/80 transition-colors text-center block">
                  {t("backers.getStarted")}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BackersSection;
