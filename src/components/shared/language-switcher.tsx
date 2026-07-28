"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { localeLabels, locales, type Locale } from "@/lib/i18n/config";

type Props = {
  current: Locale;
  label: string;
  variant?: "light" | "dark";
};

/**
 * Bascule de langue par CHEMIN (`/fr/...` ↔ `/en/...`), pas par état client :
 * chaque langue garde son URL, ses canonical et ses hreflang — exigence SEO.
 * La page courante est conservée lors du changement.
 */
export function LanguageSwitcher({ current, label, variant = "light" }: Props) {
  const pathname = usePathname();

  const pathFor = (locale: Locale) => {
    const segments = pathname.split("/");
    // segments[0] est vide (le chemin commence par "/"), segments[1] est la locale.
    segments[1] = locale;
    return segments.join("/") || `/${locale}`;
  };

  if (variant === "dark") {
    // Même contrôle segmenté que la variante claire, adapté au fond vert :
    // segment actif en pastille blanche, texte vert.
    return (
      <div
        aria-label={label}
        className="inline-flex items-center gap-0.5 rounded-[12px] border border-white/25 bg-white/10 p-[3px]"
      >
        {locales.map((locale) => {
          const active = locale === current;
          return (
            <Link
              key={locale}
              href={pathFor(locale)}
              hrefLang={locale}
              aria-current={active ? "true" : undefined}
              className={`inline-flex h-9 min-w-12 items-center justify-center rounded-[9px] text-sm font-semibold transition-colors ${
                active ? "bg-white text-sapin" : "text-white/70 hover:text-white"
              }`}
            >
              {localeLabels[locale]}
            </Link>
          );
        })}
      </div>
    );
  }

  // Variante claire — contrôle segmenté : la langue active est une pastille
  // intérieure arrondie sur ses 4 coins (rounded-[9px]), comme le badge « L ».
  return (
    <div
      aria-label={label}
      className="inline-flex items-center gap-0.5 rounded-[11px] border border-surface bg-surface p-[3px]"
    >
      {locales.map((locale) => {
        const active = locale === current;
        return (
          <Link
            key={locale}
            href={pathFor(locale)}
            hrefLang={locale}
            aria-current={active ? "true" : undefined}
            className={`inline-flex h-[26px] min-w-9 items-center justify-center rounded-[9px] text-xs font-bold transition-colors ${
              active ? "bg-emeraude text-white" : "text-texte2 hover:text-encre"
            }`}
          >
            {localeLabels[locale]}
          </Link>
        );
      })}
    </div>
  );
}
