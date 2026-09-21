"use client";

import { useTranslations } from "./LanguageContext";

const LanguageToggle = () => {
  const { locale, setLocale } = useTranslations();

  return (
    <div className="flex items-center gap-1 text-xs font-medium">
      <button
        onClick={() => setLocale("en")}
        className={`px-2 py-1 rounded transition-colors ${
          locale === "en"
            ? "text-primary font-bold"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        EN
      </button>
      <span className="text-border">|</span>
      <button
        onClick={() => setLocale("pt")}
        className={`px-2 py-1 rounded transition-colors ${
          locale === "pt"
            ? "text-primary font-bold"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        PT
      </button>
    </div>
  );
};

export default LanguageToggle;
