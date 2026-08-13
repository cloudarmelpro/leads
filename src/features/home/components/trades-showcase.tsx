import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";

import { Eyebrow } from "@/components/shared/eyebrow";
import { ArrowRight } from "@/components/ui/arrows";

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
  "/images/deneigemement.jpg",
  "/images/arboriculture.jpg",
];

type Props = { lang: Locale; dict: Dictionary };

/**
 * Vitrine des métiers (réf. ieaEnergy « What is the role… ») : en-tête sur deux
 * colonnes — question à gauche, texte + bouton à droite — puis une grille de
 * cartes photo (les métiers qui défilaient auparavant dans le hero) suivie d'une
 * carte foncée « texte » qui occupe deux colonnes, comme la carte noire de la réf.
 */
export function TradesShowcase({ lang, dict }: Props) {
  const t = dict.hero;

  return (
    <section id="secteurs" className="px-[clamp(16px,4vw,32px)] py-[clamp(40px,6vw,80px)]">
      <div className="mx-auto max-w-290">
        <div className="grid grid-cols-1 gap-x-10 gap-y-6 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] md:items-end">
          <div>
            <p data-reveal="up" className="mb-4">
              <Eyebrow>{t.tradesKicker}</Eyebrow>
            </p>
            <div
              data-reveal-child="right"
              style={
                {
                  "--reveal-delay": "80ms",
                  "--reveal-dist": "40vw",
                  "--reveal-dur": "3400ms",
                } as CSSProperties
              }
              className="w-full"
            >
              <h2 className="font-display text-[clamp(28px,4vw,46px)] leading-[1.06] tracking-normal text-balance">
                {t.tradesLabel}
              </h2>
            </div>
          </div>

          <div data-reveal="left" data-reveal-delay="120" data-reveal-dist="60px">
            <p className="text-base leading-[1.6] text-texte2 text-pretty">{t.demoCaption}</p>
            <Link
              href={`/${lang}/contact`}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emeraude px-5 py-2.5 text-sm font-medium text-white no-underline transition-colors hover:bg-emeraude/90 motion-reduce:transition-none"
            >
              {t.tradesCta}
            </Link>
          </div>
        </div>

        {/* Grille (réf.) : 3 par ligne. Cartes métier CARRÉES ; la carte foncée
            occupe le reste de la dernière ligne (2 colonnes). 7 + 2 = 3 rangées pleines. */}
        <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3">
          {t.demos.map((demo, i) => (
            <figure
              key={demo.trade}
              data-reveal="up"
              data-reveal-delay={`${i * 60}`}
              className="relative flex aspect-5/6 items-end overflow-hidden rounded-3xl bg-menthe"
            >
              <Image
                src={TRADE_IMAGES[i % TRADE_IMAGES.length]}
                alt={demo.imgLabel}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 380px"
                className="object-cover"
              />
              <figcaption className="relative w-full bg-[linear-gradient(transparent,rgba(15,29,23,.82))] p-5">
                <span className="text-base font-semibold text-white">{demo.trade}</span>
              </figcaption>
            </figure>
          ))}

          <div
            data-reveal="up"
            data-reveal-delay={`${t.demos.length * 60}`}
            className="flex flex-col justify-between rounded-3xl bg-surface p-6 text-encre sm:col-span-2"
          >
            <p className="max-w-[26ch] font-display text-[clamp(20px,2.4vw,28px)] leading-[1.2] text-balance">
              {t.tradesCardTitle}
            </p>
            <Link
              href={`/${lang}/contact`}
              className="mt-4 inline-flex w-fit items-center gap-2 text-sm font-medium text-encre no-underline transition-colors hover:text-emeraude dark:hover:text-accent-strong"
            >
              {t.tradesCta}
              <ArrowRight className="w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
