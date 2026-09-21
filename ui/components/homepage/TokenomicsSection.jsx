"use client";

import { useTranslations } from "../../../app/components/LanguageContext";

const TokenomicsSection = () => {
  const { t, ready } = useTranslations();

  if (!ready) return null;

  const categories = t("tokenomics.categories");
  const notes = t("tokenomics.notes");

  const catKeys = ["social", "community", "dev", "education", "ops"];
  const colors = [
    "hsl(320, 100%, 60%)",
    "hsl(42, 90%, 55%)",
    "hsl(280, 60%, 50%)",
    "hsl(200, 70%, 50%)",
    "hsl(150, 60%, 45%)",
  ];
  const pcts = [40, 25, 20, 10, 5];

  const pieSegments = catKeys.map((key, i) => ({
    label: categories[key] || key,
    pct: pcts[i],
    color: colors[i],
  }));

  const allocations = catKeys.map((key, i) => ({
    name: categories[key] || key,
    pct: `${pcts[i]}%`,
    note: notes[key] || "",
  }));

  const associations = t("tokenomics.associations");

  return (
    <section id="tokenomics" className="py-24 section-gradient">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="flex items-center justify-center gap-6 mb-4">
            <img src="/coin.png" alt="$COINK" loading="lazy" className="w-20 h-20 animate-float" />
            <div>
              <h2 className="font-display text-4xl md:text-5xl text-accent text-glow-gold">$COINK</h2>
              <p className="font-heading text-lg text-foreground">{t("tokenomics.title")}</p>
            </div>
          </div>
          <p className="text-muted-foreground leading-relaxed mt-6">
            {t("tokenomics.description")}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="glass-card p-8">
            <h3 className="font-heading text-sm text-accent mb-6">{t("tokenomics.distribution")}</h3>
            <div className="space-y-4">
              {pieSegments.map((seg) => (
                <div key={seg.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-foreground">{seg.label}</span>
                    <span className="text-sm font-bold" style={{ color: seg.color }}>{seg.pct}%</span>
                  </div>
                  <div className="w-full h-2 bg-secondary/50 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${seg.pct}%`, backgroundColor: seg.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-6 border-t border-border/50 pt-4">
              {t("tokenomics.distributionNote")}
            </p>
          </div>

          <div className="glass-card p-8">
            <h3 className="font-heading text-sm text-accent mb-6">{t("tokenomics.burn.title")}</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-muted-foreground block mb-1">{t("tokenomics.burn.cardsToBurn")}</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 5, 10].map((n) => (
                    <span key={n} className="px-3 py-1.5 rounded-lg bg-secondary text-sm text-foreground cursor-pointer hover:bg-secondary/80 transition-colors">
                      {n}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">{t("tokenomics.burn.associationToSupport")}</label>
                <div className="flex flex-wrap gap-2">
                  {(Array.isArray(associations) ? associations : []).map((name) => (
                    <span key={name} className="px-3 py-1.5 rounded-lg bg-secondary text-sm text-foreground cursor-pointer hover:bg-secondary/80 transition-colors">
                      {name}
                    </span>
                  ))}
                </div>
              </div>
              <div className="glass-card p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">{t("tokenomics.burn.coinksGenerated")}</p>
                <p className="font-display text-3xl text-accent">750</p>
              </div>
              <button className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-heading text-sm hover:opacity-90 transition-opacity">
                {t("tokenomics.burn.burnAndSend")}
              </button>
              <p className="text-[10px] text-muted-foreground text-center">
                {t("tokenomics.burn.disclaimer")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TokenomicsSection;
