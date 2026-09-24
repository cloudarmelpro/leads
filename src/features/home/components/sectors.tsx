import Image from "next/image";
import Link from "next/link";

import { SectorStack } from "@/features/home/components/sector-steps";
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

// Dès 1100px (maquette) : l'en-tête de section se colle à 136px (78px d'en-tête de page +
// 58px d'air), les cartes 140px plus bas, juste sous lui. `--card` est la hauteur d'une
// carte, `--pad` la marge basse de la liste ; le fond du bloc et la marge de la section en
// dépendent, d'où les variables.
const VARS = "[--card:380px] [--pad:clamp(12px,1.4vw,20px)] min-[620px]:[--card:460px] min-[1100px]:[--card:clamp(360px,calc(100vh-380px),520px)]";

/**
 * Secteurs (maquette Accueil, 2026-09-24) : un bloc arrondi dont l'en-tête (surtitre et
 * titre) reste collé, et sept grandes cartes photo qui s'empilent dessous — la suivante
 * glisse sur la précédente, qui rétrécit (script de `SectorStack`). Texte alterné à gauche
 * puis à droite, sur un voile qui assombrit ce côté de la photo.
 * Le fond du bloc n'est qu'un calque collé derrière l'en-tête et une carte : il ne
 * couvre donc jamais l'air laissé sous l'en-tête de page. Il déborde sous la section d'une
 * hauteur de carte, que la marge basse de la section et la marge négative de la liste
 * compensent : la dernière carte reste ainsi collée jusqu'au bout.
 * Sous 1100px : en-tête non collant, cartes collées à 88px, texte en bas de la photo ;
 * cartes de 380px sous 620px pour raccourcir la section sur téléphone.
 */
export function Sectors({ lang, dict }: Props) {
  const t = dict.hero;

  return (
    <section
      id="secteurs"
      className={`relative flex justify-center px-[clamp(16px,4vw,56px)] pb-[clamp(96px,11vw,180px)] min-[1100px]:pb-[calc(clamp(96px,11vw,180px)+var(--card)+var(--pad))] ${VARS}`}
    >
      <div className="relative isolate w-full max-w-[1400px] rounded-[24px]">
        <div aria-hidden className="pointer-events-none absolute inset-x-[0px] top-[0px] bottom-[0px] z-0 min-[1100px]:bottom-[calc(-1*(var(--card)+var(--pad)))]">
          <span className="block h-full rounded-[24px] bg-surface-2 dark:bg-surface min-[1100px]:sticky min-[1100px]:top-[136px] min-[1100px]:h-[calc(140px+var(--card)+var(--pad))]" />
        </div>

        <div className="relative z-[2] flex min-h-[140px] flex-wrap items-center justify-between gap-x-[32px] gap-y-[14px] rounded-t-[24px] bg-surface-2 dark:bg-surface px-[clamp(20px,3vw,48px)] py-[22px] min-[1100px]:sticky min-[1100px]:top-[136px]">
          <div className="flex flex-col gap-[2px]">
            <span className="text-[13px] leading-[20px] font-normal tracking-[0.08em] text-vert uppercase">{t.tradesKicker}</span>
            <h2 className="m-[0px] text-[clamp(22px,2.2vw,30px)] leading-[1.2] font-semibold tracking-[-0.01em] text-encre text-pretty">{t.tradesLabel}</h2>
          </div>
        </div>

        <ol className="relative z-[1] m-[0px] flex list-none flex-col gap-[4px] px-[var(--pad)] pt-[0px] pb-[var(--pad)] min-[1100px]:mb-[calc(-1*(var(--card)+var(--pad)))]">
          {t.demos.map((demo, index) => {
            const photo = PHOTOS[index];
            if (!photo) return null;
            const right = index % 2 === 1;
            return (
              <li
                key={demo.trade}
                data-sector-card={index}
                className="sticky top-[88px] grid h-[var(--card)] grid-cols-[minmax(0,1fr)] overflow-hidden rounded-[24px] bg-surface transition-opacity duration-[120ms] ease-linear min-[1100px]:top-[276px] min-[1100px]:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]"
              >
                {/* La carte est `sticky` : Next refuse ce positionnement comme parent d'une
                    image `fill`. On l'enveloppe donc dans un calque absolu. */}
                <span className="absolute inset-[0px] bg-[#01212F]">
                  <Image src={`/images/home/${photo}.jpg`} alt={demo.imgLabel} fill sizes="(max-width: 1100px) 100vw, 1400px" className="object-cover" />
                </span>
                <span
                  aria-hidden
                  className={`absolute inset-[0px] bg-[linear-gradient(180deg,rgba(1,17,24,0.20)_0%,rgba(1,17,24,0.78)_52%,rgba(1,17,24,0.94)_100%)] ${
                    right
                      ? "min-[1100px]:bg-[linear-gradient(270deg,rgba(1,17,24,0.94)_0%,rgba(1,17,24,0.82)_44%,rgba(1,17,24,0.12)_100%)]"
                      : "min-[1100px]:bg-[linear-gradient(90deg,rgba(1,17,24,0.94)_0%,rgba(1,17,24,0.82)_44%,rgba(1,17,24,0.12)_100%)]"
                  }`}
                />
                <div
                  className={`relative flex flex-col justify-end gap-[14px] p-[clamp(24px,3.2vw,56px)] min-[1100px]:justify-center ${right ? "min-[1100px]:col-start-2" : "min-[1100px]:col-start-1"}`}
                >
                  <span className="text-[13px] leading-[20px] font-medium tracking-[0.14em] text-[#30D98C] uppercase">
                    {t.sectorNum.replace("{n}", String(index + 1).padStart(2, "0"))}
                  </span>
                  <h3 className="m-[0px] text-[clamp(26px,3vw,40px)] leading-[1.05] font-normal tracking-[-0.8px] text-white">{demo.trade}</h3>
                  <p className="m-[0px] max-w-[480px] text-[15px] leading-[26px] font-normal text-white text-pretty">{demo.pitch}</p>
                  <Link
                    href={`/${lang}/contact`}
                    className="tap-44 mt-[6px] inline-flex h-[34px] w-fit items-center rounded-[8px] bg-[#30D98C] px-[20px] text-[13px] leading-[1] font-normal whitespace-nowrap text-[#011823] no-underline transition-[background] duration-[240ms] ease-[cubic-bezier(0.2,0.7,0.2,1)] hover:bg-[#7FEFC0]"
                  >
                    {t.ctaBook}
                  </Link>
                </div>
              </li>
            );
          })}
        </ol>
        <SectorStack />
      </div>
    </section>
  );
}
