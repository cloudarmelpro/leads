"use client";

import type { ReactNode } from "react";

import { HeroSpot, moveSpot, SPOT_STYLE } from "@/components/shared/hero-spot";
import { LineReveal } from "@/components/shared/line-reveal";

type Props = {
  /** Nom de la page (ou titre de l'article), rendu en capitales. */
  title: string;
  lede?: string;
  /** Sous le texte d'appui : boutons, méta… (dans la colonne centrée). */
  children?: ReactNode;
  id?: string;
  /** Classes ajoutées à la section, typiquement l'espace du bas. */
  className?: string;
};

/**
 * Hero centré des pages intérieures (Prix, Blogue, article, Confidentialité), sur le
 * modèle d'À propos et Contact : halo vert sous le pointeur, titre en capitales qui se
 * révèle ligne par ligne et roule au survol, texte d'appui, puis ce que la page ajoute.
 * Sous l'en-tête flottant (pages `FULL_BLEED` dans header.tsx).
 */
export function HeroCentre({ title, lede, children, id = "top", className = "" }: Props) {
  return (
    <section
      id={id}
      onPointerMove={moveSpot}
      style={SPOT_STYLE}
      className={`relative flex justify-center px-[clamp(16px,4vw,56px)] pt-[clamp(168px,16.7vw,240px)] text-center ${className}`}
    >
      <HeroSpot />
      <div className="relative flex w-full flex-col items-center gap-[22px]">
        <LineReveal as="h1" rollOnHover className="m-[0px] max-w-[880px] cursor-default text-center text-[clamp(24px,17.79px+1.66vw,36px)] leading-[1.08] font-semibold tracking-[-1px] text-encre uppercase text-balance min-[620px]:tracking-[-2px]">
          {title}
        </LineReveal>
        {lede && (
          <LineReveal delay={0.3} className="m-[0px] max-w-[620px] text-[clamp(15px,13.45px+0.41vw,18px)] leading-[1.34] font-normal text-texte2 text-pretty">
            {lede}
          </LineReveal>
        )}
        {children}
      </div>
    </section>
  );
}
