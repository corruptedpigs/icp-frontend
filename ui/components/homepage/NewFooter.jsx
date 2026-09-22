"use client";

import { useTranslations } from "../../../app/components/LanguageContext";
import { RotatingBadge } from "./RotatingBadge";

const NewFooter = () => {
  const { t, ready } = useTranslations();
  if (!ready) return null;

  return (
    <footer className="border-t border-border/60 py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 text-center">
        <RotatingBadge size={72} />
        <p className="font-display text-lg uppercase text-primary">{t("footer.tagline")}</p>
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} CPigs. {t("footer.rights")}
        </p>
      </div>
    </footer>
  );
};

export default NewFooter;
