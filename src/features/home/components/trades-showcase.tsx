import { Info } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { CONTENEUR } from "@/components/shared/container";
import { ArrowRight } from "@/components/ui/arrows";
import { Eyebrow } from "@/components/shared/eyebrow";
import { Reveal } from "@/components/shared/reveal";
import { SplitReveal } from "@/components/shared/split-reveal";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

// Vraies photos par métier (public/images), dans le MÊME ordre que `hero.demos` :
// paysagement, excavation, construction, rénovation, commerce local, déneigement,
// arboriculture. Couplage par index — garder les deux listes synchronisées.
const TRADE_IMAGES = [
  "/images/paysagement.jpg",
  "/images/excavation.jpg",
  "/images/construction.jpg",
  "/images/renovation.jpg",
  "/images/commerce_local.jpg",
  "/images/deneigement.jpg",
  "/images/arboriculture.jpg",
];

type Props = { lang: Locale; dict: Dictionary };

/**
 * Vitrine des métiers (design refonte) : en-tête eyebrow + titre à gauche,
 * sous-titre à droite ; grille de cartes photo (7) + une carte « secteur non
 * listé » qui occupe deux colonnes (illustration labyrinthe + CTA vert plein).
 */
export function TradesShowcase({ lang, dict }: Props) {
  const t = dict.hero;

  return (
    <section id="secteurs" className="pb-[clamp(80px,14vw,200px)]">
      <div className={CONTENEUR}>
        <div className="grid grid-cols-1 gap-x-16 gap-y-5 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] md:items-end">
          <div>
            <p className="mb-1">
              <Eyebrow>{t.tradesKicker}</Eyebrow>
            </p>
            <SplitReveal as="h2" className="font-display text-[clamp(24px,4vw,38px)] leading-[1.143] font-normal tracking-[-1.2px] text-balance">
              {t.tradesLabel}
            </SplitReveal>
          </div>
          <SplitReveal
            as="p"
            delay={0.1}
            className="text-body-fluid text-texte2 text-pretty md:w-[480px] md:justify-self-end md:pb-2 md:text-right"
          >
            {t.demoCaption}
          </SplitReveal>
        </div>

        {/* Grille : 3 par ligne. Cartes métier photo ; la carte « non listé » occupe
            deux colonnes (7 + 2 = 3 rangées pleines). */}
        <Reveal as="div" stagger={0.07} className="mt-12 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3">
          {t.demos.map((demo, i) => (
            <figure
              key={demo.trade}
              className="relative flex aspect-[373/392] max-h-[392px] items-end overflow-hidden rounded-[20px] bg-menthe shadow-[inset_0_0_0_1px_var(--color-ligne)] [clip-path:inset(0_round_20px)] dark:shadow-[inset_0_0_0_1px_#0a2a3a]"
            >
              <Image
                src={TRADE_IMAGES[i % TRADE_IMAGES.length]}
                alt={demo.imgLabel}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 340px"
                className="object-cover"
              />
              {/* Dégradé plein cadre (design) : transparent en haut → émeraude en clair, sarcelle sombre en sombre. */}
              <span
                aria-hidden
                className="absolute inset-0 bg-[linear-gradient(180deg,rgba(23,126,79,0)_0%,rgba(23,126,79,0.92)_85%)] dark:bg-[linear-gradient(180deg,rgba(4,96,142,0)_0%,rgba(1,27,40,0.9)_83.65%)]"
              />
              <figcaption className="relative flex w-full items-center justify-between gap-2 px-4 pb-4 sm:gap-3 sm:px-7 sm:pb-6">
                <span className="text-[15px] leading-[22px] font-normal tracking-[-0.01em] text-white text-balance sm:text-[18px] sm:leading-[26px]">
                  {demo.trade}
                </span>
                <Info size={15} strokeWidth={1.6} aria-hidden className="shrink-0 text-white/80" />
              </figcaption>
            </figure>
          ))}

          {/* Carte « secteur non listé » : bordée, illustration labyrinthe, CTA vert plein. */}
          <div
            className="relative flex flex-col justify-between overflow-hidden rounded-[20px] border border-ligne bg-surface p-8 sm:col-span-2 sm:p-10 dark:border-transparent dark:shadow-[inset_0_0_0_1px_#0a2a3a]"
          >
            {/* Labyrinthe décoratif (design) : grand carré débordant en haut/droite,
                clippé par la carte. Traits blancs dans le SVG : teintés vert pâle en
                clair (`tint-vert`), laissés blancs et discrets en sombre.
                `loading="lazy"` : évite le <link rel=preload> que React 19 émet
                pour toute <img> rendue côté serveur (décor sous la ligne de flottaison). */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/sectors-maze.svg"
              alt=""
              aria-hidden
              loading="lazy"
              decoding="async"
              className="pointer-events-none absolute top-[-22.74%] left-[28.5%] w-[102.65%] opacity-60 select-none tint-vert dark:opacity-15 dark:[filter:none]"
            />
            <p className="relative max-w-[26ch] text-[clamp(20px,2.2vw,24px)] leading-[1.45] font-medium text-encre text-balance">
              {t.tradesCardTitle}
            </p>
            <Link
              href={`/${lang}/contact`}
              className="relative mt-6 inline-flex w-fit items-center gap-2.5 rounded-[9px] bg-emeraude px-3.5 py-2 sm:px-4 sm:py-2.5 text-cta-fluid font-medium text-white no-underline transition-colors hover:bg-[#7fefc0] hover:text-fond motion-reduce:transition-none dark:bg-accent-strong dark:text-fond dark:hover:bg-[#7fefc0]"
            >
              {t.tradesCta}
              <ArrowRight className="w-[19px]" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
