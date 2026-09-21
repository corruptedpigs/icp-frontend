"use client";

import { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";

const LanguageContext = createContext();

const STORAGE_KEY = "cpigs-locale";
const SUPPORTED = ["en", "pt"];
const DEFAULT = "en";

function detectLocale() {
  if (typeof window === "undefined") return DEFAULT;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && SUPPORTED.includes(stored)) return stored;
  const lang = navigator.language || navigator.userLanguage || "";
  if (lang.startsWith("pt")) return "pt";
  return DEFAULT;
}

export function LanguageProvider({ children }) {
  const [locale, setLocaleState] = useState(DEFAULT);
  const [translations, setTranslations] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const detected = detectLocale();
    setLocaleState(detected);
    loadTranslations(detected).then(() => setReady(true));
  }, []);

  const loadTranslations = async (loc) => {
    try {
      const mod = await import(`../../translations/${loc}.json`);
      setTranslations(mod.default);
    } catch {
      const mod = await import(`../../translations/en.json`);
      setTranslations(mod.default);
      setLocaleState(DEFAULT);
    }
  };

  const setLocale = useCallback(async (loc) => {
    if (!SUPPORTED.includes(loc)) return;
    localStorage.setItem(STORAGE_KEY, loc);
    setLocaleState(loc);
    setReady(false);
    await loadTranslations(loc);
    document.documentElement.lang = loc;
    setReady(true);
  }, []);

  const t = useCallback(
    (path) => {
      if (!translations) return "";
      const keys = path.split(".");
      let result = translations;
      for (const key of keys) {
        if (result && typeof result === "object" && key in result) {
          result = result[key];
        } else {
          return "";
        }
      }
      return typeof result === "string" ? result : result;
    },
    [translations]
  );

  const value = useMemo(
    () => ({ locale, setLocale, t, ready }),
    [locale, setLocale, t, ready]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslations() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useTranslations must be used within LanguageProvider");
  return ctx;
}
