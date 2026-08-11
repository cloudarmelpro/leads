"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

const STORAGE_KEY = "cookie-consent"; // "accepted" | "declined"
// Événement global : le lien « Gérer mes témoins » du footer rouvre le bandeau.
export const OPEN_COOKIE_PREFS = "open-cookie-prefs";

/**
 * Bandeau de consentement (Loi 25), calqué sur la référence. Le site n'utilise
 * aujourd'hui que des témoins essentiels ; ce bandeau prépare le consentement pour
 * une éventuelle mesure d'audience. Le choix est mémorisé (localStorage) et
 * modifiable via « Gérer mes témoins ». Aucun outil de suivi n'est chargé ici.
 */
export function CookieConsent({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const t = dict.cookies;
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch {}
    if (!stored) setOpen(true);

    const reopen = () => setOpen(true);
    window.addEventListener(OPEN_COOKIE_PREFS, reopen);
    return () => window.removeEventListener(OPEN_COOKIE_PREFS, reopen);
  }, []);

  function choose(value: "accepted" | "declined") {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {}
    setOpen(false);
    // Le jour où une mesure d'audience est ajoutée : l'activer ici si accepté.
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-label={t.title}
      className="animate-fadein fixed bottom-4 left-4 z-90 w-[min(380px,calc(100vw-2rem))] rounded-2xl border border-ligne bg-surface p-5 shadow-[0_20px_50px_-20px_rgba(15,29,23,.4)]"
    >
      <p className="font-display text-[15px] text-encre">{t.title}</p>
      <p className="mt-2 text-[13px] leading-[1.6] text-texte2 text-pretty">
        {t.body}{" "}
        <Link
          href={`/${lang}/confidentialite`}
          className="font-medium text-sapin underline underline-offset-2 dark:text-accent-strong"
        >
          {t.learnMore}
        </Link>
      </p>
      <div className="mt-4 flex gap-2.5">
        <button
          type="button"
          onClick={() => choose("declined")}
          className="h-10 flex-1 cursor-pointer rounded-xl border border-input text-sm font-medium text-encre transition-colors hover:bg-menthe"
        >
          {t.decline}
        </button>
        <button
          type="button"
          onClick={() => choose("accepted")}
          className="h-10 flex-1 cursor-pointer rounded-xl bg-emeraude text-sm font-medium text-white transition-colors hover:bg-emeraude/90"
        >
          {t.accept}
        </button>
      </div>
    </div>
  );
}
