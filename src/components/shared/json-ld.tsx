import { site } from "@/config/site";
import type { Locale } from "@/lib/i18n/config";
import { localeHtmlLang, locales } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Props = { lang: Locale; dict: Dictionary };

/**
 * Données structurées JSON-LD (schema.org) : l'entreprise + le site web. On n'y met
 * QUE des données confirmées dans `site.ts` — aucune adresse, note ou avis inventé.
 * Les champs `null` (adresse, etc.) sont simplement omis.
 */
export function JsonLd({ lang, dict }: Props) {
  const base = `https://${site.domain}`;
  const phoneDigits = site.phone?.replace(/\D/g, "");

  const business = {
    "@type": "ProfessionalService",
    "@id": `${base}/#business`,
    name: site.name,
    url: base,
    logo: `${base}/talgasy-logo.png`,
    image: `${base}/talgasy-logo.png`,
    description: dict.meta.description,
    ...(site.email ? { email: site.email } : {}),
    ...(phoneDigits ? { telephone: `+1${phoneDigits}` } : {}),
    areaServed: { "@type": "AdministrativeArea", name: "Québec, Canada" },
    availableLanguage: locales.map((l) => localeHtmlLang[l]),
  };

  const website = {
    "@type": "WebSite",
    "@id": `${base}/#website`,
    url: base,
    name: site.name,
    inLanguage: localeHtmlLang[lang],
    publisher: { "@id": `${base}/#business` },
  };

  const data = { "@context": "https://schema.org", "@graph": [business, website] };

  return (
    <script
      type="application/ld+json"
      // Contenu 100% contrôlé (config du site, aucune entrée utilisateur).
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
