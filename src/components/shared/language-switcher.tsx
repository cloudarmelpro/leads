"use client";

import { Globe } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { localeLabels, locales, type Locale } from "@/lib/i18n/config";

type Props = {
  current: Locale;
  label: string;
  /** `pill` (en-tête : fond surélevé, rayon 9px) ou `plain` (menu mobile : texte seul). */
  variant?: "pill" | "plain";
  className?: string;
};

/**
 * Sélecteur de langue : globe + langue de DESTINATION (« EN » sur les pages françaises,
 * rapport de révision 2026-09-14 — un anglophone cherche « EN »). Bascule
 * par CHEMIN (`/fr/...` ↔ `/en/...`) — chaque langue garde son URL / canonical /
 * hreflang (exigence SEO). Le site étant bilingue, un clic bascule vers l'autre langue.
 */
export function LanguageSwitcher({ current, label, variant = "pill", className = "" }: Props) {
  const pathname = usePathname();
  const other = locales.find((locale) => locale !== current) ?? current;

  const pathFor = (locale: Locale) => {
    const segments = pathname.split("/");
    // segments[0] est vide (le chemin commence par "/"), segments[1] est la locale.
    segments[1] = locale;
    return segments.join("/") || `/${locale}`;
  };

  const look =
    variant === "pill"
      ? "rounded-[9px] bg-surface-2 px-[10px] text-encre hover:bg-surface-3"
      : "text-encre hover:text-vert";

  return (
    <Link
      href={pathFor(other)}
      hrefLang={other}
      // Le nom accessible doit contenir le texte visible (« EN ») : « Choisir la langue : EN ».
      aria-label={`${label} : ${localeLabels[other]}`}
      className={`tap-44 inline-flex h-[34px] items-center gap-[6px] text-[13px] leading-[20px] font-medium whitespace-nowrap no-underline transition-colors duration-200 ease-[cubic-bezier(0.2,0.7,0.2,1)] ${look} ${className}`}
    >
      <Globe size={16} strokeWidth={1.8} aria-hidden />
      <span>{localeLabels[other]}</span>
    </Link>
  );
}
