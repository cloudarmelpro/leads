"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { localeLabels, localeNames, locales, type Locale } from "@/lib/i18n/config";

type Props = {
  current: Locale;
  label: string;
  /** `glass` (en-tête), `plain` (menu mobile, texte seul), `outline` (pied de page). */
  variant?: "glass" | "plain" | "outline";
  /** Côté d'ouverture du panneau : sous le bouton (en-tête) ou au-dessus (pied de page). */
  placement?: "below" | "above";
};

const GlobeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
    <circle cx="12" cy="12" r="9.5" />
    <path d="M2.6 12h18.8M12 2.5c2.6 2.6 3.9 6 3.9 9.5s-1.3 6.9-3.9 9.5c-2.6-2.6-3.9-6-3.9-9.5S9.4 5.1 12 2.5" />
  </svg>
);

const LOOK: Record<NonNullable<Props["variant"]>, string> = {
  glass:
    "h-[40px] rounded-[8px] bg-verre px-[14px] text-encre shadow-[inset_0_0_0_1px_var(--color-filet-verre)] backdrop-blur-[14px] hover:bg-verre-fort",
  plain: "h-[34px] text-encre hover:text-vert",
  outline: "h-[40px] rounded-[8px] px-[14px] text-encre shadow-[inset_0_0_0_1px_var(--color-contour)] hover:bg-surface-2",
};

/**
 * Sélecteur de langue (maquette Accueil) : globe, code de la langue courante et chevron ;
 * le panneau liste les deux langues, la courante cochée. Chaque langue garde son URL
 * (`/fr/...` ↔ `/en/...`, exigence SEO) : les entrées sont de vrais liens. Ouverture au
 * survol ou au clic, fermeture à Échap, au clic extérieur ou en quittant la zone.
 */
export function LangMenu({ current, label, variant = "glass", placement = "below" }: Props) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const root = useRef<HTMLDivElement>(null);

  const pathFor = (locale: Locale) => {
    const segments = pathname.split("/");
    // segments[0] est vide (le chemin commence par "/"), segments[1] est la locale.
    segments[1] = locale;
    return segments.join("/") || `/${locale}`;
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onDown = (event: PointerEvent) => {
      if (root.current && !root.current.contains(event.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  return (
    <div ref={root} className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={`${label} : ${localeLabels[current]}`}
        className={`tap-44 flex cursor-pointer items-center gap-[6px] text-[13px] leading-[20px] font-medium whitespace-nowrap transition-colors duration-200 ease-[cubic-bezier(0.2,0.7,0.2,1)] ${LOOK[variant]}`}
      >
        <GlobeIcon />
        <span>{localeLabels[current]}</span>
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
          className={`transition-transform duration-200 ease-[cubic-bezier(0.2,0.7,0.2,1)] ${open ? "rotate-180" : ""}`}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        // Dans l'en-tête (verre), le panneau s'aligne à droite du bouton ; ailleurs (menu
        // mobile, pied de page) à gauche, sinon il sortirait de l'écran par la gauche.
        <div className={`absolute z-[50] ${placement === "below" ? `top-full pt-[10px] ${variant === "glass" ? "right-[0px]" : "left-[0px]"}` : "bottom-full left-[0px] pb-[10px]"}`}>
          <ul className="m-[0px] flex w-[176px] list-none flex-col gap-[2px] rounded-[12px] bg-surface p-[6px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.07),0_26px_60px_rgba(0,0,0,0.5)] [animation:tw-menu-in_200ms_cubic-bezier(0.22,1,0.36,1)_both]">
            {locales.map((locale) => (
              <li key={locale}>
                <Link
                  href={pathFor(locale)}
                  hrefLang={locale}
                  lang={locale}
                  aria-current={locale === current ? "true" : undefined}
                  onClick={() => setOpen(false)}
                  className="flex h-[36px] w-full items-center justify-between gap-[10px] rounded-[6px] px-[10px] text-[13px] leading-[20px] font-medium text-encre no-underline transition-colors duration-200 ease-[cubic-bezier(0.2,0.7,0.2,1)] hover:bg-surface-2"
                >
                  <span className="flex items-center gap-[8px]">
                    <span className="w-[22px] font-semibold text-vert">{localeLabels[locale]}</span>
                    {localeNames[locale]}
                  </span>
                  {locale === current && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="text-vert">
                      <path d="M5 12l5 5L20 7" />
                    </svg>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
