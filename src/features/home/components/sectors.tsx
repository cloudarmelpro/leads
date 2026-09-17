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

// En-tête de page collant (68px) + 16px de respiration : sans ce jour, le bloc se colle
// à l'en-tête de page et ses coins hauts arrondis passent pour un défaut.
// Les cartes se collent sous l'en-tête de la section ; la suivante recouvre la précédente.
// Sous 900px, l'en-tete de section n'est pas collant (trop haut) : les cartes se collent sous l'en-tete de page.
const HEADER_STICKY = "min-[900px]:sticky min-[900px]:top-[84px]";
const CARD_TOP = "top-[84px] min-[900px]:top-[calc(84px+var(--sectors-head))]";

/**
 * Secteurs (direction du 2026-09-17, mesurée image par image sur la vidéo de référence) :
 * en-tête collant — titre à gauche, étapes numérotées à droite — et sept grandes cartes
 * qui s'empilent dessous, le tout posé sur un seul bloc arrondi au fond un peu plus clair
 * (pas de filet). Ce fond doit passer DERRIÈRE les cartes : c'est lui qu'on aperçoit sur
 * les côtés quand la carte recouverte se rétrécit, et non la page (mesuré sur la référence).
 * Chaque carte est `sticky` sous l'en-tête : en défilant, la suivante glisse par-dessus.
 * La photo couvre toute la carte, sans fondu, texte en blanc ; secteur en surtitre,
 * argument en texte courant et bouton d'appel à droite.
 * Sous 900px, texte en bas de la photo. L'empilement est du CSS (sticky) ; le petit script
 * de `SectorSteps` tient l'étape active et rétrécit la carte recouverte, comme la référence.
 */
export function Sectors({ lang, dict }: Props) {
  const t = dict.hero;

  return (
    <section className={`relative flex justify-center pb-[clamp(112px,16vw,240px)] [--sectors-head:112px] ${GOUTTIERE}`}>
      <div className="w-full max-w-[1400px] rounded-[24px] bg-surface">
        <div className={`${HEADER_STICKY} z-[3] flex min-h-[var(--sectors-head)] flex-wrap items-center justify-between gap-x-[32px] gap-y-[14px] rounded-t-[24px] bg-surface px-[clamp(20px,3vw,48px)] py-[22px]`}>
          <div className="flex flex-col gap-[2px]">
            <span id="secteurs" className="text-[13px] leading-[20px] font-medium tracking-[0.08em] text-vert uppercase">
              {t.tradesKicker}
            </span>
            <h2 className="m-[0px] text-[clamp(22px,2vw,28px)] leading-[1.15] font-medium tracking-[-0.4px] text-encre">{t.tradesLabel}</h2>
          </div>
          <SectorSteps names={t.demos.map((demo) => demo.trade)} aria={t.stepAria} />
        </div>

        <ol className="m-[0px] flex list-none flex-col gap-[4px] p-[0px]">
          {t.demos.map((demo, index) => {
            const photo = PHOTOS[index];
            if (!photo) return null;
            return (
              <li
                key={demo.trade}
                data-sector-card={index}
                className={`sticky ${CARD_TOP} grid h-[560px] grid-cols-[minmax(0,1fr)] min-[900px]:h-[clamp(440px,64vh,620px)] overflow-hidden rounded-[24px] bg-surface min-[900px]:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]`}
              >
                {/* La photo couvre toute la carte, sans fondu (demande du client) ; un leger
                    assombrissement uniforme et le texte en blanc gardent l'argument lisible. */}
                <Image src={`/images/home/${photo}.jpg`} alt={demo.imgLabel} fill sizes="(max-width: 900px) 100vw, 1400px" className="object-cover" />
                <span aria-hidden className="absolute inset-[0px] bg-black/35" />
                <div className="relative flex flex-col justify-end gap-[18px] p-[clamp(24px,3.2vw,56px)] min-[900px]:col-start-2 min-[900px]:justify-center">
                  <span className="text-[13px] leading-[20px] font-normal tracking-[0.14em] text-white/75 uppercase">{demo.trade}</span>
                  <p className="m-[0px] max-w-[480px] text-[15px] leading-[26px] font-normal text-white/90 text-pretty">{demo.pitch}</p>
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
