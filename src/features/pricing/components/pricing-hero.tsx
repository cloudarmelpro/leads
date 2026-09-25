import { HERO_BTN_PRIMARY } from "@/components/shared/hero-buttons";
import { HeroCentre } from "@/components/shared/hero-centre";
import { Reveal } from "@/components/shared/reveal";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Props = { lang: Locale; dict: Dictionary };

/** Hero de la page Prix : nom de la page, texte d'appui, bouton texte seul. */
export function PricingHero({ lang, dict }: Props) {
  const t = dict.pricing;

  return (
    <HeroCentre title={t.breadcrumb} lede={t.heroSubtitle} className="pb-[clamp(96px,11vw,180px)]">
      <Reveal delay={640} immediate className="mt-[clamp(10px,1.6vw,22px)] flex flex-wrap justify-center gap-[12px]">
        <a href={`/${lang}/contact`} className={HERO_BTN_PRIMARY}>
          {t.cta}
        </a>
      </Reveal>
    </HeroCentre>
  );
}
