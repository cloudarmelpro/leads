"use client";

import { HERO_BTN_GLASS, HERO_BTN_PRIMARY } from "@/components/shared/hero-buttons";
import { HeroSpot, moveSpot, SPOT_STYLE } from "@/components/shared/hero-spot";
import { LineReveal } from "@/components/shared/line-reveal";
import { Reveal } from "@/components/shared/reveal";
import { HeroBand } from "@/features/about/components/hero-band";
import { ContactMap } from "@/features/contact";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Props = { lang: Locale; dict: Pick<Dictionary, "about"> };

/**
 * Hero À propos (maquette Claude Design, 2e version du 2026-09-25) : la même construction
 * que le hero Contact — halo vert qui suit le pointeur, titre et texte centrés, deux
 * boutons, carte du monde en points — puis le bandeau défilant qui remonte sur le bas
 * fondu de la carte.
 */
export function AboutHero({ lang, dict }: Props) {
  const t = dict.about.hero;

  return (
    <>
      <section
        id="top"
        onPointerMove={moveSpot}
        style={SPOT_STYLE}
        className="relative flex justify-center px-[clamp(16px,4vw,56px)] pt-[clamp(168px,16.7vw,240px)] text-center"
      >
        <HeroSpot />
        <div className="relative flex w-full flex-col items-center gap-[22px]">
          <LineReveal as="h1" rollOnHover className="m-[0px] cursor-default text-center text-[clamp(24px,17.79px+1.66vw,36px)] leading-[1.08] font-semibold tracking-[-1px] text-encre uppercase min-[620px]:tracking-[-2px]">
            {t.title}
          </LineReveal>
          <LineReveal delay={0.3} className="m-[0px] max-w-[620px] text-[clamp(15px,13.45px+0.41vw,18px)] leading-[1.34] font-normal text-texte2 text-pretty">
            {t.lede}
          </LineReveal>
          <Reveal delay={640} immediate className="mt-[clamp(10px,1.6vw,22px)] flex flex-wrap justify-center gap-[12px]">
            <a href={`/${lang}/contact#rendez-vous`} className={HERO_BTN_PRIMARY}>
              {t.ctaBook}
            </a>
            <a href="#histoire" className={HERO_BTN_GLASS}>
              {t.ctaStory}
            </a>
          </Reveal>
          <Reveal kind="scale" delay={760} immediate className="relative mt-[clamp(16px,2.6vw,32px)] w-full max-w-[960px]">
            <ContactMap label={t.mapAria} />
          </Reveal>
        </div>
      </section>

      <HeroBand items={t.band} label={t.bandAria} />
    </>
  );
}
