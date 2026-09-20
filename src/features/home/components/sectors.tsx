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

// En-tête de page collant (68px) + l'air demandé par le client (2026-09-18) : le bloc se
// fige à 156px, soit la même respiration au repos qu'une fois collé.
// Les cartes se collent sous l'en-tête de la section ; la suivante recouvre la précédente.
// Sous 900px, l'en-tete de section n'est pas collant (trop haut) : les cartes se collent sous l'en-tete de page.
const HEADER_STICKY = "min-[900px]:sticky min-[900px]:top-[156px]";
const CARD_TOP = "top-[84px] min-[900px]:top-[calc(156px+var(--sectors-head))]";

/**
 * Secteurs (direction du 2026-09-17, mesurée image par image sur la vidéo de référence) :
 * en-tête collant — titre à gauche, étapes numérotées à droite — et sept grandes cartes
 * qui s'empilent dessous, le tout posé sur un seul bloc arrondi au fond un peu plus clair
 * (pas de filet). Ce fond doit passer DERRIÈRE les cartes : c'est lui qu'on aperçoit sur
 * les côtés quand la carte recouverte se rétrécit, et non la page (mesuré sur la référence).
 * Chaque carte est `sticky` sous l'en-tête : en défilant, la suivante glisse par-dessus.
 * Elle porte vers le haut un trait de 4px a la couleur du bloc : c'est lui qui separe les
 * deux photos, comme la gouttiere de la reference. Ombre et pas filet : les cartes n'en ont pas.
 * Les cartes passent devant l'en-tête (aucun z-index ne l'élève) : à la fin de la section,
 * la dernière remonte et le recouvre au lieu de le laisser réapparaître au-dessus d'elle.
 * La photo couvre toute la carte, sans fondu, texte en blanc ; secteur en surtitre,
 * argument en texte courant et bouton d'appel à droite.
 * Sous 900px, texte en bas de la photo. L'empilement est du CSS (sticky) ; le petit script
 * de `SectorSteps` tient l'étape active et rétrécit la carte recouverte, comme la référence.
 */
export function Sectors({ lang, dict }: Props) {
  const t = dict.hero;

  return (
    <section className={`relative flex justify-center pb-[clamp(112px,16vw,240px)] [--sectors-head:140px] ${GOUTTIERE}`}>
      <div className="relative isolate w-full max-w-[1400px] rounded-[24px] bg-surface">
        {/* Le fond clair du bloc defile avec lui : une fois l'en-tete de section colle, il
            remplirait l'air garde sous l'en-tete de page. Ce bandeau colle juste sous
            l'en-tete de page le recouvre a la couleur de la page. z-[-1] : au-dessus du fond
            du bloc, sous l'en-tete et les cartes (d'ou `isolate` sur le conteneur). */}
        <span aria-hidden className="pointer-events-none sticky top-[68px] z-[-1] -mb-[88px] block h-[88px] bg-fond">
          {/* Deux quarts de disque a la couleur de la page redonnent au bloc ses coins hauts
              arrondis : sans eux le bandeau laisse une arete droite. */}
          <span className="absolute top-full left-[0px] block h-[24px] w-[24px] bg-[radial-gradient(circle_24px_at_100%_100%,transparent_98%,var(--color-fond))]" />
          <span className="absolute top-full right-[0px] block h-[24px] w-[24px] bg-[radial-gradient(circle_24px_at_0%_100%,transparent_98%,var(--color-fond))]" />
        </span>
        <div className={`${HEADER_STICKY} flex min-h-[var(--sectors-head)] flex-wrap items-center justify-between gap-x-[32px] gap-y-[14px] rounded-t-[24px] bg-surface px-[clamp(20px,3vw,48px)] py-[22px]`}>
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
                className={`sticky ${CARD_TOP} grid h-[560px] grid-cols-[minmax(0,1fr)] min-[900px]:h-[clamp(390px,calc(100vh-330px),620px)] overflow-hidden rounded-[24px] bg-surface shadow-[0_-4px_0_var(--color-surface)] min-[900px]:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]`}
              >
                {/* La photo couvre toute la carte, sans fondu (demande du client) ; c'est
                    l'assombrissement uniforme (55%) qui garde l'argument blanc lisible,
                    y compris sur les photos claires comme le deneigement. */}
                {/* La carte est `sticky` : Next refuse ce positionnement comme parent d'une
                    image `fill`. On l'enveloppe donc dans un calque absolu. */}
                <span className="absolute inset-[0px]">
                  <Image src={`/images/home/${photo}.jpg`} alt={demo.imgLabel} fill sizes="(max-width: 900px) 100vw, 1400px" className="object-cover" />
                </span>
                <span aria-hidden className="absolute inset-[0px] bg-black/55" />
                <div className="relative flex flex-col justify-end gap-[18px] p-[clamp(24px,3.2vw,56px)] min-[900px]:col-start-2 min-[900px]:justify-center">
                  <span className="text-[13px] leading-[20px] font-normal tracking-[0.14em] text-white/75 uppercase">{demo.trade}</span>
                  <p className="m-[0px] max-w-[480px] text-[15px] leading-[26px] font-normal text-white text-pretty">{demo.pitch}</p>
                  <Link
                    href={`/${lang}/contact`}
                    className="mt-[6px] inline-flex min-h-[44px] w-fit items-center rounded-[8px] bg-vert px-[20px] text-[14px] leading-[20px] font-medium whitespace-nowrap text-sur-vert no-underline transition-colors hover:bg-vert-clair"
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
