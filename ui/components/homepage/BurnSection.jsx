"use client";

import { useState } from "react";
import { Flame } from "lucide-react";
import { useTranslations } from "../../../app/components/LanguageContext";

const COINKS_PER_CARD = 250;

const BurnSection = () => {
  const { t, ready } = useTranslations();
  const [cards, setCards] = useState(3);
  const [assoc, setAssoc] = useState(null);
  const [burning, setBurning] = useState(false);

  if (!ready) return null;

  const associations = t("burn.associations");
  const tokenItems = t("burn.tokenItems");
  const coinks = cards * COINKS_PER_CARD;
  const selectedAssoc = assoc || (Array.isArray(associations) ? associations[0] : "");

  const burn = () => {
    setBurning(true);
    window.setTimeout(() => {
      setBurning(false);
      const msg = String(t("burn.simDone"))
        .replace("{coinks}", coinks)
        .replace("{assoc}", selectedAssoc);
      alert(msg);
    }, 900);
  };

  return (
    <section id="burn" className="grain border-t border-border/60 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="text-3xl uppercase sm:text-4xl lg:text-5xl">{t("burn.title")}</h2>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="glass-card grid gap-6 p-8 sm:grid-cols-[1fr_7rem] sm:items-center">
              <div>
                <h3 className="text-2xl uppercase">{t("burn.leftTitle")}</h3>
                <p className="mt-4 text-sm text-muted-foreground">{t("burn.leftText")}</p>
              </div>
              <img
                src="/coin.png"
                alt="$COINK"
                loading="lazy"
                width={256}
                height={256}
                className="animate-float mx-auto w-28"
                style={{ filter: "drop-shadow(0 0 22px rgba(255,194,45,0.55))" }}
              />
            </div>

            <div className="glass-card p-8">
              <h4 className="flex items-center gap-2 font-display text-xl uppercase">
                <Flame className="size-5 text-primary" /> {t("burn.simTitle")}
              </h4>

              <div className="mt-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{t("burn.simCards")}</span>
                  <span className="font-display text-2xl text-accent">{cards}</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={12}
                  step={1}
                  value={cards}
                  onChange={(e) => setCards(Number(e.target.value))}
                  className="mt-3 w-full accent-accent"
                />
              </div>

              <div className="mt-6">
                <p className="text-sm text-muted-foreground">{t("burn.simAssoc")}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(Array.isArray(associations) ? associations : []).map((a) => (
                    <button
                      key={a}
                      onClick={() => setAssoc(a)}
                      className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                        selectedAssoc === a
                          ? "border-accent bg-accent text-accent-foreground"
                          : "border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex items-end justify-between rounded-xl border border-border bg-background/60 p-4">
                <span className="text-sm text-muted-foreground">{t("burn.simResult")}</span>
                <span className="font-display text-3xl text-primary">{coinks}</span>
              </div>

              <button
                onClick={burn}
                disabled={burning}
                className="mt-5 w-full rounded-lg bg-primary py-3 font-heading text-sm font-bold uppercase tracking-wider text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                <Flame className={`inline size-4 ${burning ? "animate-pulse" : ""}`} /> {t("burn.simSend")}
              </button>
              <p className="mt-3 text-xs text-muted-foreground">{t("burn.simNote")}</p>
            </div>
          </div>

          <div className="glass-card p-8">
            <h3 className="text-2xl uppercase">{t("burn.tokenTitle")}</h3>
            <p className="mt-3 text-sm text-muted-foreground">{t("burn.tokenText")}</p>

            <ul className="mt-8 space-y-5">
              {(Array.isArray(tokenItems) ? tokenItems : []).map((item) => (
                <li key={item.label}>
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="font-semibold">{item.label}</span>
                    <span className="font-display text-xl text-accent">{item.value}%</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${item.value}%`, backgroundImage: "var(--gradient-heat)" }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{item.note}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BurnSection;
