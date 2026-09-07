import { CONTENEUR } from "@/components/shared/container";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeader } from "@/components/shared/section-header";
import { ComparisonTable } from "@/features/pricing/components/comparison-table";
import { HostingCard } from "@/features/pricing/components/hosting-card";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Props = { lang: Locale; dict: Dictionary };

/**
 * Page Prix (design « Pricing v2 ») : trois sections sur l'en-tête standard du site
 * — Site web et Logo en grille comparative, Hébergement en carte large. L'eyebrow
 * « Prix » n'apparaît qu'au-dessus de la première.
 */
export function PricingGroups({ lang, dict }: Props) {
  const t = dict.pricing;
  const href = `/${lang}/contact`;

  return (
    <div className="flex flex-col gap-[clamp(56px,8vw,96px)] pb-[clamp(80px,14vw,200px)]">
      <section id="prix" className={CONTENEUR}>
        <SectionHeader kicker={t.kicker} title={t.site.title} intro={t.site.intro} />
        <Reveal as="div" className="mt-12">
          <ComparisonTable plans={t.site.plans} groups={t.site.groups} labels={t.labels} note={t.labels.compareNote} href={href} />
        </Reveal>
      </section>

      <section id="logo" className={CONTENEUR}>
        <SectionHeader title={t.logo.title} intro={t.logo.intro} />
        <Reveal as="div" className="mt-12">
          <ComparisonTable plans={t.logo.plans} groups={t.logo.groups} labels={t.labels} href={href} />
        </Reveal>
      </section>

      <section id="hebergement" className={CONTENEUR}>
        <SectionHeader title={t.hosting.title} intro={t.hosting.intro} />
        <Reveal as="div" className="mt-12">
          <HostingCard hosting={t.hosting} bookLabel={t.labels.book} href={href} />
        </Reveal>
      </section>
    </div>
  );
}
