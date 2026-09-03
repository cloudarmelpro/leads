import { PageHero } from "@/components/shared/page-hero";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Props = { lang: Locale; dict: Dictionary };

/** En-tête de la page Prix : titre avec mot-clé vert, sous-titre, bouton vers Contact. */
export function PricingHero({ lang, dict }: Props) {
  const t = dict.pricing;

  return (
    <PageHero
      title={
        <>
          {t.heroTitleA}
          <span className="text-emeraude dark:text-accent-strong">{t.heroHighlight}</span>
          {t.heroTitleB}
        </>
      }
      subtitle={t.heroSubtitle}
      cta={{ label: t.cta, href: `/${lang}/contact` }}
    />
  );
}
