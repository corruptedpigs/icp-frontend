"use client";

import { useEffect, useRef } from "react";
import { BookOpen, ExternalLink } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "../../../app/components/LanguageContext";
import GoodDeedsWall from "./GoodDeedsWall";

const ManualSection = () => {
  const { t, ready } = useTranslations();
  const twitterRef = useRef(null);

  useEffect(() => {
    if (twitterRef.current && !twitterRef.current.querySelector("iframe")) {
      const script = document.createElement("script");
      script.src = "https://platform.twitter.com/widgets.js";
      script.async = true;
      script.charset = "utf-8";
      twitterRef.current.appendChild(script);
    }
  }, []);

  if (!ready) return null;

  return (
    <section id="manual" className="border-t border-border/60 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="text-3xl uppercase sm:text-4xl lg:text-5xl">{t("manual.title")}</h2>
        <p className="mt-4 max-w-2xl text-muted-foreground">{t("manual.subtitle")}</p>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <article className="glass-card-gold overflow-hidden p-8">
              <div className="relative mb-6 h-44 w-full overflow-hidden rounded-xl">
                <Image
                  src="/pig-suit.jpg"
                  alt="CPigs"
                  fill
                  className="object-cover opacity-90"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <BookOpen className="size-8 text-accent" />
              <h3 className="mt-4 text-2xl uppercase">{t("manual.bookTitle")}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{t("manual.bookText")}</p>
              <a
                href="https://corruptedpigs.com"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-xs font-bold uppercase tracking-wider text-accent-foreground transition-colors hover:bg-accent/90"
              >
                {t("manual.preorder")} <ExternalLink className="size-3.5" />
              </a>
              <p className="mt-3 text-xs text-muted-foreground">{t("manual.preorderNote")}</p>
            </article>

            <article className="glass-card p-8">
              <h3 className="text-2xl uppercase">{t("manual.dailyTitle")}</h3>
              <div className="mt-5 flex flex-wrap gap-2">
                {t("manual.dailySteps").map((step) => (
                  <span
                    key={step}
                    className="rounded-full border border-border px-4 py-2 font-display text-lg uppercase"
                  >
                    {step}
                  </span>
                ))}
              </div>
              <p className="mt-6 font-display text-xl uppercase leading-snug">
                {t("manual.dailyLine1")}
                <br />
                <span className="text-accent">{t("manual.dailyLine2")}</span>
              </p>
            </article>
          </div>

          <GoodDeedsWall />
        </div>
      </div>
    </section>
  );
};

export default ManualSection;
