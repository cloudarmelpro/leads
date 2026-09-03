"use client";

import { ChevronDown, Globe } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { localeLabels, locales, type Locale } from "@/lib/i18n/config";

type Props = {
  current: Locale;
  label: string;
  variant?: "light" | "dark";
  /** Classe d'affichage (défaut `inline-flex`) — permet au header de le masquer sous 380px. */
  className?: string;
};

/**
 * Sélecteur de langue (design refonte) : 🌐 + langue courante + chevron. Bascule
 * par CHEMIN (`/fr/...` ↔ `/en/...`) — chaque langue garde son URL / canonical /
 * hreflang (exigence SEO). Le site étant bilingue, un clic bascule vers l'autre langue.
 */
export function LanguageSwitcher({
  current,
  label,
  variant = "light",
  className = "inline-flex",
}: Props) {
  const pathname = usePathname();
  const other = locales.find((locale) => locale !== current) ?? current;

  const pathFor = (locale: Locale) => {
    const segments = pathname.split("/");
    // segments[0] est vide (le chemin commence par "/"), segments[1] est la locale.
    segments[1] = locale;
    return segments.join("/") || `/${locale}`;
  };

  const color =
    variant === "dark"
      ? "text-white hover:text-white/80"
      : "text-encre hover:text-emeraude dark:hover:text-accent-strong";

  return (
    <Link
      href={pathFor(other)}
      hrefLang={other}
      aria-label={`${label} — ${localeLabels[other]}`}
      className={`tap-44 ${className} items-center gap-1.5 text-sm font-medium no-underline transition-colors ${color}`}
    >
      <Globe size={16} strokeWidth={2} aria-hidden />
      <span>{localeLabels[current]}</span>
      <ChevronDown size={14} strokeWidth={2} aria-hidden />
    </Link>
  );
}
