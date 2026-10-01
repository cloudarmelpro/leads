"use client";

import { HERO_BTN_GLASS, HERO_BTN_PRIMARY } from "@/components/shared/buttons";
import { HeroCentre } from "@/components/shared/hero-centre";
import { Reveal } from "@/components/shared/reveal";
import { HeroBand } from "@/features/about/components/hero-band";
import { DotMap } from "@/components/shared/dot-map";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Props = { lang: Locale; dict: Pick<Dictionary, "about"> };

/**
 * Hero À propos (maquette Claude Design, 2e version du 2026-09-25) : la même construction
 * que le hero Soumission — halo vert qui suit le pointeur, titre et texte centrés, deux
 * boutons, carte du monde en points — puis le bandeau défilant qui remonte sur le bas
 * fondu de la carte.
 */
export function AboutHero({ lang, dict }: Props) {
  const t = dict.about.hero;

  return (
    <>
      <HeroCentre title={t.title} lede={t.lede}>
          <Reveal delay={640} immediate className="mt-[clamp(10px,1.6vw,22px)] flex flex-wrap justify-center gap-[12px]">
            <a href={`/${lang}/soumission`} className={HERO_BTN_PRIMARY}>
              {t.ctaBook}
            </a>
            <a href="#histoire" className={HERO_BTN_GLASS}>
              {t.ctaStory}
            </a>
          </Reveal>
          {/* Marge plus aérée que la maquette (16–32px), demande du client du 2026-09-30 : avec les
              22px de la colonne, le même écart que sous le hero de Soumission et de Services (72–140px). */}
          <Reveal kind="scale" delay={760} immediate className="relative mt-[clamp(50px,8vw,118px)] w-full max-w-[960px]">
            <DotMap label={t.mapAria} />
          </Reveal>
      </HeroCentre>

      <HeroBand items={t.band} label={t.bandAria} />
    </>
  );
}
