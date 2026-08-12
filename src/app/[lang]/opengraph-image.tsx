import { ImageResponse } from "next/og";

import { site } from "@/config/site";
import { isLocale, locales, type Locale } from "@/lib/i18n/config";

// Une image OG par langue (prérendue), sous [lang] pour être rattachée aux pages
// et ne pas être redirigée par le proxy.
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Copie de marque existante (nom + positionnement) — aucune donnée inventée.
const TAGLINE: Record<Locale, string> = {
  fr: "Sites web professionnels qui convertissent",
  en: "Professional websites that convert",
};
const KICKER: Record<Locale, string> = {
  fr: "Agence web · Québec",
  en: "Web agency · Québec",
};

export const alt = `${site.name} — ${TAGLINE.fr}`;

export default async function OpengraphImage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const l: Locale = isLocale(lang) ? lang : "fr";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background: "linear-gradient(135deg, #0c1712 0%, #10412a 58%, #177e4f 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
          <div style={{ width: "20px", height: "20px", borderRadius: "9999px", background: "#35c489" }} />
          <span
            style={{
              fontSize: "28px",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#a7e0c0",
            }}
          >
            {KICKER[l]}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <span style={{ fontSize: "116px", fontWeight: 700, lineHeight: 1 }}>{site.name}</span>
          <span style={{ fontSize: "42px", color: "#cfe6d8" }}>{TAGLINE[l]}</span>
        </div>

        <span style={{ fontSize: "32px", color: "#a7e0c0" }}>{site.domain}</span>
      </div>
    ),
    { ...size },
  );
}
