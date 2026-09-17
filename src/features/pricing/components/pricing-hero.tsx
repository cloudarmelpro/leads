import Link from "next/link";

import { GOUTTIERE } from "@/components/shared/container";
import { HeroGrid } from "@/components/shared/hero-grid";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Props = { lang: Locale; dict: Dictionary };

/**
 * Hero de la page Prix (maquette « Pricing v3 ») : titre en casse normale avec le
 * mot-clé en vert et une coupure de ligne forcée après la virgule, paragraphe, bouton
 * de 38px. Padding haut 120 / 64 / 96px selon la largeur, bas 140 / 96 / 72px.
 */
export function PricingHero({ lang, dict }: Props) {
  const t = dict.pricing;
  // « , du premier site… » : la virgule reste collée au mot-clé, la suite passe à la ligne.
  const comma = t.heroTitleB.startsWith(",") ? "," : "";
  const rest = t.heroTitleB.replace(/^,\s*/, "");

  return (
    <section className={`relative flex justify-center overflow-x-clip pt-[120px] pb-[140px] ${GOUTTIERE}`}>
      <HeroGrid />
      <div className="relative z-[1] flex w-full max-w-[1100px] flex-col items-start gap-[22px]">
        <h1 className="m-[0px] max-w-[640px] text-[clamp(26px,3.2vw,36px)] leading-[1.12] font-normal tracking-[-0.7px] text-encre text-pretty">
          {t.heroTitleA}
          <span className="text-vert">{t.heroHighlight}</span>
          {comma}
          <br />
          {rest}
        </h1>
        <p className="m-[0px] max-w-[520px] text-[14px] leading-[24px] font-normal text-texte2 text-pretty">{t.heroSubtitle}</p>
        <Link
          href={`/${lang}/contact`}
          className="mt-[10px] flex h-[38px] items-center rounded-[8px] bg-vert px-[22px] text-[14px] leading-[20px] font-medium text-sur-vert no-underline transition-colors hover:bg-vert-clair"
        >
          {t.cta}
        </Link>
      </div>
    </section>
  );
}
