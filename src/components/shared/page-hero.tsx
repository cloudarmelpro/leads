import Link from "next/link";
import type { ReactNode } from "react";

import { CONTENEUR } from "@/components/shared/container";
import { Reveal } from "@/components/shared/reveal";
import { SplitReveal } from "@/components/shared/split-reveal";

type Props = {
  /** Titre h1 — mêmes classes que le hero de l'accueil (majuscules, 38px max). */
  title: ReactNode;
  subtitle?: string;
  cta?: { label: string; href: string };
};

/**
 * En-tête des pages intérieures (Prix, À propos, Contact, Blog) : reprend le titre,
 * le sous-titre et le bouton du hero de l'accueil, sans visuel plein écran. Pas
 * d'eyebrow : le hero de l'accueil n'en a pas, les pages non plus.
 */
export function PageHero({ title, subtitle, cta }: Props) {
  return (
    <section className="pt-[clamp(40px,7vw,96px)] pb-[clamp(48px,7vw,88px)]">
      <div className={`${CONTENEUR} flex flex-col items-start gap-6`}>
        <SplitReveal
          as="h1"
          scroll={false}
          delay={0.1}
          className="m-0 max-w-[720px] lg:max-w-[min(720px,60%)] font-display text-[clamp(1.5rem,4vw,2.375rem)] leading-[1.143] font-normal tracking-[-1.2px] text-encre text-pretty uppercase"
        >
          {title}
        </SplitReveal>

        {subtitle && (
          <SplitReveal
            as="p"
            scroll={false}
            delay={0.28}
            className="m-0 max-w-[642px] lg:max-w-[min(642px,55%)] text-body-fluid font-normal text-texte2 text-pretty"
          >
            {subtitle}
          </SplitReveal>
        )}

        {cta && (
          <Reveal as="div" scroll={false} delay={0.5} className="flex flex-wrap items-center gap-3">
            <Link
              href={cta.href}
              className="rounded-[9px] bg-emeraude px-3.5 py-2 sm:px-4 sm:py-2.5 text-cta-fluid font-medium text-white no-underline hover:bg-[#7fefc0] hover:text-fond dark:bg-accent-strong dark:text-fond dark:hover:bg-[#7fefc0]"
            >
              {cta.label}
            </Link>
          </Reveal>
        )}
      </div>
    </section>
  );
}
