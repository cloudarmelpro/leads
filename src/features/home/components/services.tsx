import { Blend, Box, Globe, Layers, Mail, RefreshCw, Share2, TrendingUp } from "lucide-react";
import Image from "next/image";

import { GOUTTIERE } from "@/components/shared/container";
import { SectionHead } from "@/components/shared/section-head";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Props = { dict: Dictionary };

// Une entrée par service, dans l'ordre du dictionnaire : glyphe, motif de fond et
// place dans la grille de 10 colonnes (5 · 5 / 3 · 3 · 4 / 4 · 3 · 3).
const CARDS = [
  { Icon: Globe, motif: "svc-globe", span: "min-[1000px]:col-span-5" },
  { Icon: RefreshCw, motif: "svc-rings", span: "min-[1000px]:col-span-5" },
  { Icon: Layers, motif: "svc-stack", span: "min-[1000px]:col-span-3" },
  { Icon: Mail, motif: "svc-mail", span: "min-[1000px]:col-span-3" },
  { Icon: Blend, motif: "svc-identity", span: "min-[1000px]:col-span-4" },
  { Icon: Box, motif: "svc-cube", span: "min-[1000px]:col-span-4" },
  { Icon: Share2, motif: "svc-network", span: "min-[1000px]:col-span-3" },
  { Icon: TrendingUp, motif: "svc-growth", span: "min-[1000px]:col-span-3" },
];

const MOTIF_MASK = "linear-gradient(135deg, transparent 0%, rgba(0,0,0,0.35) 45%, #000 100%)";

/**
 * Services : huit cartes en bento. Chaque carte porte un motif généré en fond
 * (couvrant, ancré en bas à droite, fondu vers le haut à gauche) qui se renforce au
 * survol, une plaque d'icône, un titre et un paragraphe.
 */
export function Services({ dict }: Props) {
  const t = dict.services;

  return (
    <section className={`relative flex justify-center pb-[clamp(112px,16vw,240px)] ${GOUTTIERE}`}>
      <div className="flex w-full max-w-[1100px] flex-col gap-[48px]">
        <SectionHead id="services" label={t.kicker} title={`${t.titleA} ${t.titleB}`} intro={t.intro} />

        <div className="grid grid-cols-[minmax(0,1fr)] items-stretch gap-[14px] min-[700px]:grid-cols-[repeat(2,minmax(0,1fr))] min-[1000px]:grid-cols-[repeat(10,minmax(0,1fr))]">
          {t.items.map((item, index) => {
            const card = CARDS[index];
            if (!card) return null;
            const { Icon, motif, span } = card;

            return (
              <article
                key={item.name}
                className={`group relative flex flex-col gap-[16px] overflow-hidden rounded-[24px] bg-surface p-[28px] ring-1 ring-ligne ring-inset dark:ring-0 transition-colors duration-[220ms] ease-[cubic-bezier(0.2,0.7,0.2,1)] hover:bg-surface-2 ${span}`}
              >
                <Image
                  src={`/images/home/${motif}.jpg`}
                  alt=""
                  aria-hidden
                  fill
                  sizes="(max-width: 700px) 100vw, (max-width: 1000px) 50vw, 540px"
                  className="pointer-events-none object-cover object-right-bottom opacity-[0.42] mix-blend-screen transition-[opacity,filter] duration-[260ms] ease-[cubic-bezier(0.2,0.7,0.2,1)] select-none group-hover:opacity-85 group-hover:blur-[0.3px] motion-safe:will-change-[opacity,filter]"
                  style={{ maskImage: MOTIF_MASK, WebkitMaskImage: MOTIF_MASK }}
                />
                <span className="relative flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-[16px] bg-surface-2 text-vert">
                  <Icon size={22} strokeWidth={1.6} aria-hidden />
                </span>
                <h3 className="relative m-[0px] text-[17px] leading-[24px] font-medium text-encre">{item.name}</h3>
                <p className="relative m-[0px] text-[14px] leading-[24px] font-normal text-texte2 text-pretty">{item.note}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
