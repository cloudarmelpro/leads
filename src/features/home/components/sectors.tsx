import Image from "next/image";
import Link from "next/link";

import { GOUTTIERE } from "@/components/shared/container";
import { SectorSteps } from "@/features/home/components/sector-steps";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Props = { lang: Locale; dict: Dictionary };

// Photos par secteur (public/images/home), dans le MÊME ordre que `hero.demos` :
// paysagement, excavation, construction, rénovation, commerce local, déneigement,
// arboriculture. Couplage par index — garder les deux listes synchronisées.
const PHOTOS = [
  "sector-paysagement",
  "sector-excavation",
  "sector-construction",
  "sector-renovation",
  "sector-commerce",
  "sector-deneigement",
  "sector-arboriculture",
];

// Hauteur de l'en-tête de page collant (68px) + en-tête de la section : les cartes se
// collent juste dessous et la suivante recouvre la précédente en défilant.
// Sous 900px, l'en-tete de section n'est pas collant (trop haut) : les cartes se collent sous l'en-tete de page.
const HEADER_STICKY = "min-[900px]:sticky min-[900px]:top-[68px]";
const CARD_TOP = "top-[80px] min-[900px]:top-[calc(68px+var(--sectors-head)+16px)]";

/**
 * Secteurs (direction du 2026-09-17, d'après une vidéo de référence) : un en-tête collant
 * — titre à gauche, étapes numérotées à droite — puis sept grandes cartes empilées.
 * Chaque carte est `sticky` sous l'en-tête : en défilant, la suivante glisse par-dessus.
 * Photo bord à bord à gauche, sans filet ; secteur en surtitre, argument en grand et
 * bouton d'appel à droite.
 * Sous 900px, photo au-dessus du texte. Pas de JavaScript pour l'empilement ; seul
 * l'indicateur d'étape observe les cartes.
 */
export function Sectors({ lang, dict }: Props) {
  const t = dict.hero;

  return (
    <section className={`relative flex justify-center pb-[clamp(112px,16vw,240px)] [--sectors-head:128px] ${GOUTTIERE}`}>
      <div className="w-full max-w-[1400px]">
        <div className={`${HEADER_STICKY} z-[3] flex min-h-[var(--sectors-head)] flex-wrap items-center justify-between gap-x-[32px] gap-y-[14px] bg-fond py-[28px]`}>
          <div className="flex flex-col gap-[2px]">
            <span id="secteurs" className="text-[13px] leading-[20px] font-medium tracking-[0.08em] text-vert uppercase">
              {t.tradesKicker}
            </span>
            <h2 className="m-[0px] text-[clamp(22px,2vw,28px)] leading-[1.15] font-medium tracking-[-0.4px] text-encre">{t.tradesLabel}</h2>
          </div>
          <SectorSteps names={t.demos.map((demo) => demo.trade)} aria={t.stepAria} />
        </div>

        <ol className="m-[0px] mt-[16px] flex list-none flex-col gap-[clamp(16px,2vw,24px)] p-[0px]">
          {t.demos.map((demo, index) => {
            const photo = PHOTOS[index];
            if (!photo) return null;
            return (
              <li
                key={demo.trade}
                data-sector-card={index}
                className={`sticky ${CARD_TOP} grid min-h-[clamp(440px,64vh,620px)] grid-cols-[minmax(0,1fr)] overflow-hidden rounded-[24px] bg-surface min-[900px]:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]`}
              >
                {/* La photo couvre toute la moitie gauche de la carte, bord a bord. */}
                <div className="relative min-h-[260px] min-[900px]:min-h-[0px]">
                  <Image
                    src={`/images/home/${photo}.jpg`}
                    alt={demo.imgLabel}
                    fill
                    sizes="(max-width: 900px) 100vw, 720px"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col justify-center gap-[18px] p-[clamp(24px,3.2vw,56px)]">
                  <span className="text-[13px] leading-[20px] font-medium tracking-[0.14em] text-texte2 uppercase">{demo.trade}</span>
                  <p className="m-[0px] max-w-[560px] text-[clamp(20px,2.1vw,30px)] leading-[1.3] font-medium tracking-[-0.3px] text-encre text-pretty">{demo.pitch}</p>
                  <Link
                    href={`/${lang}/contact`}
                    className="mt-[6px] inline-flex min-h-[44px] w-fit items-center rounded-[10px] bg-vert px-[20px] text-[14px] leading-[20px] font-medium whitespace-nowrap text-sur-vert no-underline transition-colors hover:bg-vert-clair"
                  >
                    {t.ctaBook}
                  </Link>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
