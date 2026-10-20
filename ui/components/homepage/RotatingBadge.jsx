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
          <path id="cpigs-badge-path" d="M50,50 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
        </defs>
        <text
          fill="currentColor"
          textLength="270"
          lengthAdjust="spacing"
          style={{ fontSize: "5.8px", letterSpacing: "0.15px", fontWeight: 700 }}
        >
          <textPath href="#cpigs-badge-path">{t("badge")}</textPath>
        </text>
      </svg>
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <img
          src="/logo.png"
          alt="CPigs"
          className={`w-[58%] ${float ? "animate-float" : ""}`}
          style={{ filter: "drop-shadow(0 0 18px rgba(255,51,187,0.55))" }}
        />
      </div>
    </div>
  );
}
