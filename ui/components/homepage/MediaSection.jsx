"use client";

import { Mic, Play, Radio } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "../../../app/components/LanguageContext";

const MediaSection = () => {
  const { t, ready } = useTranslations();
  if (!ready) return null;

  const videos = t("media.videos");

  return (
    <section id="media" className="border-t border-border/60 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="text-3xl uppercase sm:text-4xl lg:text-5xl">{t("media.title")}</h2>
        <p className="mt-4 max-w-2xl text-muted-foreground">{t("media.subtitle")}</p>

        <h3 className="mt-14 flex items-center gap-2 font-display text-xl uppercase">
          <Play className="size-5 text-primary" /> {t("media.guerrillaTitle")}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">{t("media.guerrillaText")}</p>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {(Array.isArray(videos) ? videos : []).map((title) => (
            <article
              key={title}
              className="glass-card group overflow-hidden"
            >
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src="/community-pigs.jpg"
                  alt={title}
                  fill
                  className="object-cover opacity-70 transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <span className="absolute inset-0 grid place-items-center">
                  <span className="grid size-14 place-items-center rounded-full bg-accent text-accent-foreground">
                    <Play className="size-6" />
                  </span>
                </span>
              </div>
              <div className="p-4">
                <p className="font-semibold">{title}</p>
                <p className="text-xs text-muted-foreground">{t("media.placeholder")}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-14 grid items-start gap-6 lg:grid-cols-2">
          <article className="glass-card-gold p-8">
            <h3 className="flex items-center gap-2 font-display text-xl uppercase">
              <Radio className="size-5 text-accent" /> {t("media.spacesTitle")}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">{t("media.spacesText")}</p>
            <div className="mt-6 flex items-center gap-4 rounded-xl border border-border bg-background/60 p-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-accent text-accent-foreground">
                <Play className="size-5" />
              </span>
              <div className="flex-1">
                <div className="h-2 rounded-full bg-muted">
                  <div
                    className="h-full w-1/3 rounded-full"
                    style={{ backgroundImage: "var(--gradient-heat)" }}
                  />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  {t("media.spacesLive")} · {t("media.placeholder")}
                </p>
              </div>
            </div>
          </article>

          <article className="glass-card p-8">
            <h3 className="flex items-center gap-2 font-display text-xl uppercase">
              <Mic className="size-5 text-accent" /> {t("media.journalismTitle")}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">{t("media.journalismText")}</p>
            <div className="mt-6 grid aspect-video place-items-center rounded-xl border border-dashed border-border text-sm text-muted-foreground">
              {t("media.placeholder")}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
};

export default MediaSection;
