"use client";

import type { ReactNode } from "react";

import { HeroSpot, moveSpot, SPOT_STYLE } from "@/components/shared/hero-spot";
import { LineReveal } from "@/components/shared/line-reveal";

type Props = {
  /** Nom de la page, rendu en capitales. */
  title: string;
  lede: string;
  /** Sous le texte d'appui, dans la colonne centrée : boutons, cartes, carte du monde… */
  children?: ReactNode;
  /** Classes ajoutées à la section, typiquement l'espace du bas. */
  className?: string;
};

/**
 * Hero centré des pages intérieures (À propos, Services, Soumission) : halo vert sous le
 * pointeur, titre en capitales qui se révèle ligne par ligne et roule au survol, texte
 * d'appui, puis ce que la page ajoute. Hauteur de tête 168/190/240px selon la largeur
 * (maquettes du 2026-09-30). Sous l'en-tête flottant (pages `FULL_BLEED` dans header.tsx).
 */
export function HeroCentre({ title, lede, children, className = "" }: Props) {
  return (
    <section
      id="top"
      onPointerMove={moveSpot}
      style={SPOT_STYLE}
      className={`relative flex justify-center overflow-clip px-[calc(10px+clamp(18px,5vw,72px))] pt-[168px] text-center min-[620px]:pt-[190px] min-[900px]:pt-[240px] ${className}`}
    >
      <HeroSpot />
      <div className="relative flex w-full flex-col items-center gap-[22px]">
        <LineReveal as="h1" immediate rollOnHover className="m-[0px] cursor-default text-[clamp(24px,17.79px+1.66vw,36px)] leading-[1.08] font-semibold tracking-[-1px] text-encre uppercase min-[620px]:tracking-[-2px]">
          {title}
        </LineReveal>
        <LineReveal immediate delay={0.3} className="m-[0px] max-w-[620px] text-[clamp(15px,13.45px+0.41vw,18px)] leading-[1.34] font-normal text-texte2 text-pretty">
          {lede}
        </LineReveal>
        {children}
      </div>
    </section>
  );
}
