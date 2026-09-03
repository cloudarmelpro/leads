import { cache } from "react";

import { defaultLocale, type Locale } from "@/lib/i18n/config";

/**
 * `not-found.tsx` ne reçoit AUCUNE prop (contrainte Next : voir la doc
 * file-conventions/not-found). Le layout `[lang]`, lui, a `params` et rend avant
 * ses enfants : il dépose ici la locale de la requête pour que la 404 la relise.
 * `cache()` = mémoire par requête, jamais partagée entre visiteurs.
 */
const store = cache((): { locale: Locale } => ({ locale: defaultLocale }));

export function setRequestLocale(locale: Locale): void {
  store().locale = locale;
}

export function getRequestLocale(): Locale {
  return store().locale;
}
