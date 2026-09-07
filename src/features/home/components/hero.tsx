import Link from "next/link";

import { CONTENEUR } from "@/components/shared/container";
import { Reveal } from "@/components/shared/reveal";
import { SplitReveal } from "@/components/shared/split-reveal";
import { HeroStreaks } from "@/components/shared/hero-streaks";
import { HeroMap } from "@/features/home/components/hero-map";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Props = { lang: Locale; dict: Dictionary };

export function Hero({ lang, dict }: Props) {
  const t = dict.hero;

  return (
    <section
      id="accueil"
      className="relative z-0 -mt-[4.8125rem] flex min-h-[calc(100svh-140px)] overflow-x-clip pt-[5.25rem] pb-[clamp(20px,3vw,40px)]"
    >
      <HeroStreaks />

      <div className={`${CONTENEUR} relative flex w-full flex-col items-start justify-center gap-6`}>
        {/* Carte du monde en points, « signature » du hero (nœud Québec, arcs animés). */}
        <HeroMap />

        <SplitReveal
          as="h1"
          scroll={false}
          delay={0.1}
          className="m-0 max-w-[720px] lg:max-w-[min(720px,60%)] font-display text-[clamp(1.5rem,4vw,2.375rem)] leading-[1.143] font-normal tracking-[-1.2px] text-encre text-pretty uppercase"
        >
          {t.titleA}{" "}
          <span className="text-emeraude dark:text-accent-strong">{t.titleB}</span>
        </SplitReveal>

        <SplitReveal
          as="p"
          scroll={false}
          delay={0.28}
          className="m-0 max-w-[642px] lg:max-w-[min(642px,55%)] text-body-fluid font-normal text-texte2 text-pretty"
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
            className="rounded-[9px] bg-emeraude px-3.5 py-2 sm:px-4 sm:py-2.5 text-cta-fluid font-medium text-white no-underline hover:bg-[#7fefc0] hover:text-fond dark:bg-accent-strong dark:text-fond dark:hover:bg-[#7fefc0]"
          >
            {t.ctaBook}
          </Link>
          <Link
            href={`/${lang}/a-propos`}
            className="rounded-[9px] px-3.5 py-2 sm:px-4 sm:py-2.5 text-cta-fluid font-medium text-encre no-underline shadow-[inset_0_0_0_1px_var(--color-encre)] hover:bg-encre/[0.08]"
          >
            {dict.nav.about}
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
