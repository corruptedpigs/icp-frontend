"use client";

import { useTranslations } from "../../../app/components/LanguageContext";

const GoodDeedsWall = () => {
  const { t, ready } = useTranslations();
  if (!ready) return null;

  return (
    <div
      id="comunidade"
      className="scroll-mt-24 rounded-2xl border border-border bg-card p-6 lg:p-8"
    >
      <h3 className="text-2xl uppercase">{t("manual.wallTitle")}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{t("manual.wallSubtitle")}</p>

      <div className="mt-6 glass-card p-6 flex justify-center">
        <a
          className="twitter-timeline"
          data-height="500"
          data-theme="dark"
          data-chrome="nofooter noheader"
          href="https://twitter.com/corruptedpigs?ref_src=twsrc%5Etfw&f=tweet_search_recent&q=%23gooddeed"
        >
          Tweets by @corruptedpigs
        </a>
      </div>
    </div>
  );
};

export default GoodDeedsWall;
