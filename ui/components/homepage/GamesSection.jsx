"use client";

import { ExternalLink, Swords, Search } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "../../../app/components/LanguageContext";

const GamesSection = () => {
  const { t, ready } = useTranslations();
  if (!ready) return null;

  const games = [
    {
      tag: t("games.card1.tag"),
      title: t("games.card1.title"),
      text: t("games.card1.text"),
      cta: t("games.card1.cta"),
      image: "/not-the-pigs-fault.png",
      href: "https://pigs-blame-game.base44.app/",
      Icon: Search,
    },
    {
      tag: t("games.card2.tag"),
      title: t("games.card2.title"),
      text: t("games.card2.text"),
      cta: t("games.card2.cta"),
      image: "/cpigs-card-back.png",
      href: "/games",
      Icon: Swords,
    },
  ];

  return (
    <section id="jogos" className="border-t border-border/60 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="max-w-4xl text-balance text-3xl uppercase leading-tight sm:text-4xl lg:text-5xl">
          {t("games.title")}
        </h2>
        <div className="mt-8 grid max-w-4xl gap-4 text-muted-foreground md:grid-cols-2">
          <p>{t("games.intro")}</p>
          <p>{t("games.intro2")}</p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {games.map((g) => (
            <article
              key={g.title}
              className="glass-card group grid gap-6 p-6 sm:grid-cols-[10rem_1fr]"
            >
              <div className="relative w-full aspect-square overflow-hidden rounded-xl border border-accent/25">
                <Image
                  src={g.image}
                  alt={g.title}
                  fill
                  className="object-contain transition-transform duration-500 group-hover:-translate-y-1"
                  sizes="(max-width: 768px) 100vw, 10rem"
                />
              </div>
              <div className="flex flex-col">
                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-accent/40 px-3 py-1 text-xs uppercase tracking-widest text-accent">
                  <g.Icon className="size-3.5" /> {g.tag}
                </span>
                <h3 className="mt-4 text-2xl uppercase">{g.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground">{g.text}</p>
                <a
                  href={g.href}
                  target={g.href.startsWith("http") ? "_blank" : undefined}
                  rel={g.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="mt-6 inline-flex w-fit items-center gap-2 rounded-lg bg-accent px-4 py-2 text-xs font-bold uppercase tracking-wider text-accent-foreground transition-colors hover:bg-accent/90"
                >
                  {g.cta} <ExternalLink className="size-3.5" />
                </a>
              </div>
            </article>
          ))}
        </div>

        <div
          className="glass-card-gold mt-14 p-8 lg:p-12"
          style={{ boxShadow: "var(--shadow-gold)" }}
        >
          <h3 className="text-2xl uppercase sm:text-3xl">{t("games.moreTitle")}</h3>
          <p className="mt-4 max-w-3xl text-muted-foreground">{t("games.moreText")}</p>
          <div className="mt-6 grid items-center gap-8 md:grid-cols-[minmax(0,1fr)_minmax(18rem,28rem)]">
            <blockquote className="border-l-2 border-accent pl-5 font-display text-xl uppercase leading-snug sm:text-2xl">
              {t("games.moreQuote")}
            </blockquote>
            <div className="relative aspect-[3/2] w-full overflow-hidden rounded-xl border border-accent/25">
              <Image
                src="/pigres-demoniacos.png"
                alt="Corrupted Pigs surrounded by flaming boars"
                fill
                className="object-cover motion-safe:transition-transform motion-safe:duration-500 motion-safe:hover:-translate-y-1"
                sizes="(max-width: 768px) 100vw, 28rem"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GamesSection;
