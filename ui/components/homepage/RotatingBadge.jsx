"use client";

import { useTranslations } from "../../../app/components/LanguageContext";

export function RotatingBadge({ size = 64, float = false }) {
  const { t, ready } = useTranslations();
  if (!ready) return null;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 100 100"
        className="badge-spin absolute inset-0 h-full w-full text-accent"
        style={{ filter: "drop-shadow(0 0 8px rgba(255,194,45,0.6))" }}
        aria-hidden="true"
      >
        <defs>
          <path id="cpigs-badge-path" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
        </defs>
        <text
          fill="currentColor"
          style={{ fontSize: "7.6px", letterSpacing: "0.6px", fontWeight: 700 }}
        >
          <textPath href="#cpigs-badge-path">{t("badge")}</textPath>
        </text>
      </svg>
      <img
        src="/logo.png"
        alt="CPigs"
        className={`absolute left-1/2 top-1/2 w-[58%] -translate-x-1/2 -translate-y-1/2 ${
          float ? "animate-float" : ""
        }`}
        style={{ filter: "drop-shadow(0 0 18px rgba(255,51,187,0.55))" }}
      />
    </div>
  );
}
