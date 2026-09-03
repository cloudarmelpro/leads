import Link from "next/link";

import { CONTENEUR } from "@/components/shared/container";
import { Reveal } from "@/components/shared/reveal";
import { SplitReveal } from "@/components/shared/split-reveal";
import { HeroGlobe } from "@/features/home/components/hero-globe";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Props = { lang: Locale; dict: Dictionary };

export function Hero({ lang, dict }: Props) {
  const t = dict.hero;

  return (
    <section
      id="accueil"
      className="relative z-0 -mt-[77px] flex min-h-[calc(100svh-140px)] overflow-x-clip pt-[84px] pb-[clamp(20px,3vw,40px)]"
    >
      {/* Fond repris de la sélection Figma : deux fines ellipses vertes floutées,
          pivotées ~50° — de longs traits de lumière en diagonale depuis le haut.
          Valeurs exactes du SVG Figma : 99×2009px, #30D98C, blur 50, opacity .05.
          Couleur via token pour rester correct en clair/sombre. */}
      {/* Les traits débordent VERS LE BAS dans la page (pas de coupe nette au bas
          du hero) ; seul l'axe X est clippé (section `overflow-x-clip`) pour éviter
          un défilement horizontal. */}
      {/* Ellipse 2 — croise le header entre le logo et « Services ». */}
      <div aria-hidden className="pointer-events-none absolute top-[-340px] left-[-9%] h-[2009px] w-[99px] rotate-[50deg] rounded-[50%] bg-accent-strong opacity-[0.04] blur-[50px]" />
      {/* Ellipse 1 — croise le header au niveau du bouton « Contact ». */}
      <div aria-hidden className="pointer-events-none absolute top-[-340px] left-[30%] h-[2009px] w-[99px] rotate-[50deg] rounded-[50%] bg-accent-strong opacity-[0.04] blur-[50px]" />

      <div className={`${CONTENEUR} relative flex w-full flex-col items-start justify-center gap-6`}>
        {/* Globe « signature » animé (rotation lente + flottement). */}
        <HeroGlobe />

        <SplitReveal
          as="h1"
          scroll={false}
          delay={0.1}
          className="m-0 max-w-[min(720px,60%)] font-display text-[clamp(24px,4vw,38px)] leading-[1.143] font-normal tracking-[-1.2px] text-encre text-pretty uppercase"
        >
          {t.titleA}{" "}
          <span className="text-emeraude dark:text-accent-strong">{t.titleB}</span>
        </SplitReveal>

        <SplitReveal
          as="p"
          scroll={false}
          delay={0.28}
          className="m-0 max-w-[min(642px,55%)] text-[16px] leading-[24px] font-normal text-texte2 text-pretty"
        >
          {t.subtitle}
        </SplitReveal>

        <Reveal
          as="div"
          scroll={false}
          delay={0.5}
          stagger={0.12}
          className="flex flex-wrap items-center gap-3"
        >
          <Link
            href={`/${lang}/contact`}
            className="rounded-[9px] bg-emeraude px-4 py-2.5 text-[15px] font-medium text-white no-underline hover:bg-[#7fefc0] hover:text-fond dark:bg-accent-strong dark:text-fond dark:hover:bg-[#7fefc0]"
          >
            {t.ctaBook}
          </Link>
          <Link
            href={`/${lang}/a-propos`}
            className="rounded-[9px] px-4 py-2.5 text-[15px] font-medium text-encre no-underline shadow-[inset_0_0_0_1px_var(--color-encre)] hover:bg-encre/[0.08]"
          >
            {dict.nav.about}
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
