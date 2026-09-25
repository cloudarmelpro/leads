"use client";

import { HERO_BTN_PRIMARY } from "@/components/shared/hero-buttons";
import { HeroSpot, moveSpot, SPOT_STYLE } from "@/components/shared/hero-spot";
import { LineReveal } from "@/components/shared/line-reveal";
import { Reveal } from "@/components/shared/reveal";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Props = { lang: Locale; dict: Dictionary };

/**
 * Hero de la page Prix, sur le modèle des heros À propos et Contact (demande du client,
 * 2026-09-25) : halo qui suit le pointeur, le nom de la page en grand titre, texte
 * d'appui, bouton texte seul. Révélation ligne par ligne, lettres qui roulent au survol.
 */
export function PricingHero({ lang, dict }: Props) {
  const t = dict.pricing;

  return (
    <section
      id="top"
      onPointerMove={moveSpot}
      style={SPOT_STYLE}
      className="relative flex justify-center px-[clamp(16px,4vw,56px)] pt-[clamp(168px,16.7vw,240px)] pb-[clamp(48px,6vw,96px)] text-center"
    >
      <HeroSpot />
      <div className="relative flex w-full flex-col items-center gap-[22px]">
        <LineReveal as="h1" rollOnHover className="m-[0px] cursor-default text-center text-[clamp(24px,17.79px+1.66vw,36px)] leading-[1.08] font-semibold tracking-[-1px] text-encre uppercase min-[620px]:tracking-[-2px]">
          {t.breadcrumb}
        </LineReveal>
        <LineReveal delay={0.3} className="m-[0px] max-w-[620px] text-[clamp(15px,13.45px+0.41vw,18px)] leading-[1.34] font-normal text-texte2 text-pretty">
          {t.heroSubtitle}
        </LineReveal>
        <Reveal delay={640} immediate className="mt-[clamp(10px,1.6vw,22px)] flex flex-wrap justify-center gap-[12px]">
          <a href={`/${lang}/contact`} className={HERO_BTN_PRIMARY}>
            {t.cta}
          </a>
        </Reveal>
      </div>
    </section>
  );
}
