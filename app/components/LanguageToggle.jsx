"use client";

import { useTranslations } from "./LanguageContext";

const LanguageToggle = () => {
  const { locale, setLocale } = useTranslations();

  return (
    <div className="flex items-center gap-1 rounded-full border border-border/60 bg-white/[0.04] p-1 backdrop-blur-md">
      {["en", "pt"].map((code) => (
        <button
          key={code}
          onClick={() => setLocale(code)}
          className={`rounded-full px-3 py-1 font-heading text-[0.7rem] uppercase transition-all ${
            locale === code
              ? "bg-primary text-primary-foreground shadow-[0_0_18px_rgba(255,51,187,0.6)]"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {code}
        </button>
      ))}
    </div>
  );
};

export default LanguageToggle;
