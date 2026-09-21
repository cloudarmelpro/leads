import Link from "next/link";
import type { ReactNode } from "react";

import { CONTENEUR } from "@/components/shared/container";
import { HeroStreaks } from "@/components/shared/hero-streaks";
import { ArrowRight } from "@/components/ui/arrows";

type Props = {
  /** Titre h1 — mêmes classes que le hero de l'accueil (majuscules, 38px max). */
  title: ReactNode;
  subtitle?: string;
  cta?: { label: string; href: string };
  /** Lien texte secondaire à côté du bouton (ex. « Voir les forfaits »). */
  secondary?: { label: string; href: string };
};

/**
 * En-tête des pages intérieures (Prix, À propos, Contact, Blog) : reprend le titre,
 * le sous-titre, le bouton et le fond (traits de lumière) du hero de l'accueil, sans
 * visuel plein écran. Pas
 * d'eyebrow : le hero de l'accueil n'en a pas, les pages non plus.
 */
export function PageHero({ title, subtitle, cta, secondary }: Props) {
  return (
    <section className="relative z-0 -mt-[4.8125rem] overflow-x-clip pt-[calc(4.8125rem+clamp(40px,7vw,96px))] pb-[clamp(48px,7vw,88px)]">
      {/* Mêmes traits de lumière que le hero de l'accueil, remontés sous l'en-tête. */}
      <HeroStreaks />
      <div className={`${CONTENEUR} relative flex flex-col items-start gap-6`}>
        <h1 className="m-0 max-w-[720px] lg:max-w-[min(720px,60%)] font-display text-[clamp(1.5rem,4vw,2.375rem)] leading-[1.143] font-normal tracking-[-0.5px] text-encre text-pretty">
          {title}
        </h1>

        {subtitle && (
          <p className="m-0 max-w-[642px] lg:max-w-[min(642px,55%)] text-body-fluid font-normal text-texte2 text-pretty">{subtitle}</p>
        )}

        {cta && (
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={cta.href}
              className="rounded-[8px] bg-vert px-3.5 py-2 sm:px-4 sm:py-2.5 text-cta-fluid font-medium text-sur-vert no-underline transition-colors hover:bg-vert-clair"
            >
              {cta.label}
            </Link>
            {secondary && (
              <a
                href={secondary.href}
                className="inline-flex items-center gap-2.5 px-1 text-cta-fluid font-normal text-texte2 no-underline transition-colors hover:text-encre"
              >
                {secondary.label}
                <ArrowRight className="w-[19px]" />
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
