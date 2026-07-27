import { localeHtmlLang, type Locale } from "@/lib/i18n/config";

/** Date longue localisée (ex. « 18 juillet 2026 » / « July 18, 2026 »). */
export function formatDate(iso: string, lang: Locale): string {
  return new Intl.DateTimeFormat(localeHtmlLang[lang], {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(iso));
}
