/**
 * Config de locale — client-safe (importable depuis un Client Component).
 * Le chargement des dictionnaires vit dans `dictionaries.ts`, server-only.
 */

export const locales = ["fr", "en"] as const;

export type Locale = (typeof locales)[number];

/** Le français est la langue de référence : marché québécois. */
export const defaultLocale: Locale = "fr";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Étiquette du sélecteur de langue. */
export const localeLabels: Record<Locale, string> = {
  fr: "FR",
  en: "EN",
};

/** Valeur de l'attribut `lang` / `hreflang`. */
export const localeHtmlLang: Record<Locale, string> = {
  fr: "fr-CA",
  en: "en-CA",
};
