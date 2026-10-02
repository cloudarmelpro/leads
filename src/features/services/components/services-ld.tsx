import { site } from "@/config/site";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Props = { lang: Locale; dict: Pick<Dictionary, "servicesPage"> };

/** « 1 500 $ », « $1,500 », « $35 / month » → 1500, 1500, 35. */
const amount = (price: string) => Number(price.replace(/[^\d]/g, ""));

/**
 * JSON-LD du catalogue de la page Services : chaque service affiché, avec sa description
 * et son prix de départ (`minPrice`, en CAD), rangé par famille. Les données viennent des
 * mêmes dictionnaires que les cartes : rien d'autre que ce que le visiteur lit. Le
 * catalogue est rattaché à l'entreprise par son `@id` (déclarée dans json-ld.tsx).
 */
export function ServicesLd({ lang, dict }: Props) {
  const t = dict.servicesPage;
  const base = `https://${site.domain}`;
  const page = `${base}/${lang}/services`;
  const quote = `${base}/${lang}/soumission`;

  const data = {
    "@context": "https://schema.org",
    // Même nœud que l'entreprise de json-ld.tsx (même `@id` et même type) : Google les fusionne.
    "@type": "ProfessionalService",
    "@id": `${base}/#business`,
    name: site.name,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      "@id": `${page}#catalogue`,
      name: t.title,
      url: page,
      itemListElement: t.families.map((family) => ({
        "@type": "OfferCatalog",
        name: family.label,
        description: family.desc,
        itemListElement: family.plans.map((plan) => ({
          "@type": "Offer",
          url: quote,
          priceCurrency: "CAD",
          priceSpecification: {
            "@type": family.unit ? "UnitPriceSpecification" : "PriceSpecification",
            minPrice: amount(plan.price),
            priceCurrency: "CAD",
            // Abonnement mensuel (hébergement) : le prix s'entend par mois.
            ...(family.unit ? { unitCode: "MON", unitText: family.unit.replace(/^\s*\/\s*/, "") } : {}),
          },
          itemOffered: {
            "@type": "Service",
            name: plan.name,
            description: plan.who,
            serviceType: family.label,
            provider: { "@id": `${base}/#business` },
            areaServed: { "@type": "Country", name: "Canada" },
          },
        })),
      })),
    },
  };

  return (
    <script
      type="application/ld+json"
      // Contenu 100% contrôlé (dictionnaires, aucune entrée utilisateur).
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
