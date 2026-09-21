"use client";

import Image from "next/image";
import { useTranslations } from "../../../app/components/LanguageContext";

const AboutSection = () => {
  const { t, ready } = useTranslations();

  if (!ready) return null;

  const gamesData = [
    {
      tag: t("games.game1.tag"),
      title: t("games.game1.title"),
      description: t("games.game1.description"),
      image: "/not-the-pigs-fault.png",
      cta: { label: t("games.game1.cta"), href: "https://pigs-blame-game.base44.app/" },
    },
    {
      tag: t("games.game2.tag"),
      title: t("games.game2.title"),
      description: t("games.game2.description"),
      image: "/cpigs-card-back.png",
      cta: { label: t("games.game2.cta"), href: "/games" },
    },
  ];

  return (
    <section id="games" className="py-24 section-gradient">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl text-foreground mb-6 leading-tight">
            {t("games.title")}
            <br />
            <span className="text-primary">{t("games.titleHighlight")}</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            {t("games.description")}
          </p>
          <p className="text-muted-foreground leading-relaxed">
            {t("games.description2")}
          </p>
        </div>

        <div className="space-y-8 mb-16">
          {gamesData.map((game, i) => (
            <div
              key={game.title}
              className="glass-card overflow-hidden group hover:border-primary/60 transition-all duration-300 flex flex-col md:flex-row"
            >
              <div className={`relative w-full md:w-2/5 lg:w-1/2 h-56 md:h-auto overflow-hidden flex-shrink-0 ${i % 2 === 1 ? "md:order-2" : ""}`}>
                <Image
                  src={game.image}
                  alt={game.title}
                  fill
                  className="object-contain group-hover:scale-105 transition-transform duration-500 p-4"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 40vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent md:bg-gradient-to-r md:from-transparent md:to-card md:via-transparent" />
              </div>
              <div className="p-6 md:p-8 flex flex-col justify-center flex-1">
                <p className="text-xs text-accent font-heading mb-2 uppercase tracking-wider">
                  {game.tag}
                </p>
                <h3 className="font-display text-2xl text-foreground mb-3">
                  {game.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {game.description}
                </p>
                <a
                  href={game.cta.href}
                  target={game.cta.href.startsWith("http") ? "_blank" : undefined}
                  rel={game.cta.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-heading text-sm hover:opacity-90 transition-opacity self-start"
                >
                  {game.cta.label}
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="glass-card overflow-hidden flex flex-col md:flex-row">
          <div className="p-8 flex flex-col justify-center flex-1">
            <h3 className="font-display text-xl text-foreground mb-4">{t("games.moreThanGame.title")}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              {t("games.moreThanGame.description")}
            </p>
            <blockquote className="text-lg italic text-accent font-medium">
              &ldquo;{t("games.moreThanGame.quote")}&rdquo;
            </blockquote>
          </div>
          <div className="relative w-full md:w-2/5 lg:w-1/2 h-56 md:h-auto overflow-hidden flex-shrink-0">
            <Image
              src="/pigres-demoniacos.png"
              alt="Corrupted Pigs surrounded by flaming boars"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              height={350}
              width={250}
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
