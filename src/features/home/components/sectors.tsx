import Image from "next/image";

import { GOUTTIERE } from "@/components/shared/container";
import { SectionHead } from "@/components/shared/section-head";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Props = { dict: Dictionary };

// Photos par secteur (public/images/home), dans le MÊME ordre que `hero.demos` :
// paysagement, excavation, construction, rénovation, commerce local, déneigement,
// arboriculture. Couplage par index — garder les deux listes synchronisées.
// Emprise dans la grille : Paysagement 2×2, Rénovation et Arboriculture 2 de large.
const CARDS = [
  { photo: "sector-paysagement", area: "col-span-2 row-span-2" },
  { photo: "sector-excavation", area: "" },
  { photo: "sector-construction", area: "" },
  { photo: "sector-renovation", area: "col-span-2" },
  { photo: "sector-commerce", area: "" },
  { photo: "sector-deneigement", area: "" },
  { photo: "sector-arboriculture", area: "col-span-2" },
];

/**
 * Secteurs : sept cartes photo sur une grille de 4 colonnes (3 sous 760px, 2 sous
 * 620px), photo couvrante qui grossit au survol, dégradé de protection et libellé
 * en bas à gauche.
 */
export function Sectors({ dict }: Props) {
  const t = dict.hero;

  return (
    <section className={`relative flex justify-center pb-[clamp(112px,16vw,240px)] ${GOUTTIERE}`}>
      <div className="flex w-full max-w-[1100px] flex-col gap-[48px]">
        <SectionHead id="secteurs" label={t.tradesKicker} title={t.tradesLabel} intro={t.demoCaption} />

        <div className="grid auto-rows-[minmax(150px,auto)] grid-cols-[repeat(2,minmax(0,1fr))] gap-[14px] min-[620px]:auto-rows-[minmax(180px,auto)] min-[620px]:grid-cols-[repeat(3,minmax(0,1fr))] min-[760px]:auto-rows-[minmax(200px,auto)] min-[760px]:grid-cols-[repeat(4,minmax(0,1fr))]">
          {t.demos.map((demo, index) => {
            const card = CARDS[index];
            if (!card) return null;

            return (
              <figure
                key={demo.trade}
                className={`group relative m-[0px] min-h-[180px] overflow-hidden rounded-[24px] bg-surface ${card.area}`}
              >
                <Image
                  src={`/images/home/${card.photo}.jpg`}
                  alt={demo.imgLabel}
                  fill
                  sizes="(max-width: 620px) 50vw, (max-width: 760px) 33vw, 540px"
                  className="object-cover transition-transform duration-[600ms] ease-[cubic-bezier(0.2,0.7,0.2,1)] group-hover:scale-[1.04]"
                />
                <span aria-hidden className="absolute inset-[0px] block bg-[linear-gradient(180deg,rgba(1,24,35,0)_40%,rgba(1,24,35,0.88)_100%)]" />
                <figcaption className="absolute bottom-[18px] left-[20px] text-[15px] leading-[22px] font-medium text-white">
                  {demo.trade}
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
