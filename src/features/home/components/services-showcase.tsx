import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { SERVICE_ART } from "@/features/home/components/service-art";
import { features } from "@/config/site";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Item = Dictionary["services"]["items"][number];
type Props = { lang: Locale; items: Item[] };

// Requête `categorie`/`gamme` de la page Prix pour chaque service, dans l'ordre du dictionnaire.
const PRICING: string[] = [
  "categorie=site",
  "categorie=site",
  "categorie=host",
  "categorie=host",
  "categorie=logo",
  "categorie=vps",
  "categorie=site&gamme=croissance",
  "categorie=site&gamme=croissance",
];

// Tableaux de la maquette : chaque colonne fait défiler trois tableaux, d'une vignette haute
// ou de deux empilées. Les indices renvoient à `items`. `tw-vitrine` (globals.css) est écrite
// pour exactement trois tableaux.
const LEFT: number[][] = [[0], [3, 4], [6]];
const RIGHT: number[][] = [[1, 2], [5], [7]];

const TRACK_ANIM = {
  left: "flex [animation:tw-vitrine_11.4s_cubic-bezier(0.33,0,0.2,1)_0.32s_infinite]",
  right: "flex flex-col [animation:tw-vitrine-y_11.4s_cubic-bezier(0.33,0,0.2,1)_0s_infinite]",
};
const SIDE = "clamp(18px,1.8vw,26px)";

/**
 * Vitrine des services (maquette Accueil, 2026-09-24) : deux colonnes, chacune une piste de
 * trois tableaux plus une copie du premier pour boucler sans saut. À gauche les cartes
 * arrivent de la droite, à droite elles montent. Chaque carte : une illustration d'écran,
 * le nom, parfois une phrase, et le prix vers la page Prix. Pause au survol, arrêt sous
 * `prefers-reduced-motion`. La copie de bouclage est `aria-hidden` et non focusable.
 */
export function ServicesShowcase({ lang, items }: Props) {
  const card = (index: number, tall: boolean, clone: boolean) => {
    const item = items[index];
    const art = SERVICE_ART[index];
    if (!item || !art) return null;
    const pricing = PRICING[index];
    const priceLine = features.pricing && item.pricing ? item.pricing : null;

    return (
      <article key={`${index}-${clone ? "b" : "a"}`} className={`relative flex flex-col overflow-hidden rounded-[20px] bg-surface ${tall ? "h-full" : "min-h-[0px] flex-1"}`}>
        <div className="relative flex min-h-[0px] min-w-[0px] flex-1 items-center justify-start overflow-hidden" style={{ padding: `${SIDE} ${SIDE} 0` }}>
          {art(item.art)}
        </div>
        <div className="relative flex min-w-[0px] shrink-0 flex-col gap-[5px] pt-[13px] pb-[clamp(16px,1.6vw,20px)]" style={{ paddingInline: SIDE }}>
          <h3 className="m-[0px] max-w-full text-[clamp(15px,1.2vw,18px)] leading-[1.3] font-medium text-encre text-pretty">{item.name}</h3>
          {item.short && (
            <p className="m-[0px] line-clamp-2 max-w-full text-[clamp(12.5px,0.95vw,14px)] leading-[1.5] font-normal text-texte2 text-pretty">{item.short}</p>
          )}
          {priceLine && (
            <Link
              href={`/${lang}/prix?${pricing}`}
              aria-label={`${priceLine} — ${item.name}`}
              tabIndex={clone ? -1 : undefined}
              className="inline-flex min-h-[26px] w-fit items-center text-[clamp(12.5px,0.95vw,14px)] leading-[20px] font-normal text-vert no-underline transition-colors hover:text-vert-clair"
            >
              {priceLine}
              <ChevronRight size={15} strokeWidth={2} aria-hidden className="ml-[3px]" />
            </Link>
          )}
        </div>
      </article>
    );
  };

  const track = (side: "left" | "right") => {
    const scenes = side === "left" ? LEFT : RIGHT;
    const slides = [...scenes, scenes[0]];
    return (
      <div className="relative h-[400px] overflow-hidden [clip-path:inset(0_round_20px)] min-[620px]:h-full">
        <div className={`h-full w-full gap-[14px] group-hover:[animation-play-state:paused] motion-reduce:[animation:none] ${TRACK_ANIM[side]}`}>
          {slides.map((column, s) => {
            const clone = s === scenes.length;
            return (
              <div key={`${side}-${s}`} aria-hidden={clone || undefined} className="flex h-full w-full shrink-0 flex-col gap-[14px]">
                {column.map((index) => card(index, column.length === 1, clone))}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="group grid min-w-[0px] grid-cols-[minmax(0,1fr)] gap-[14px] min-[620px]:h-[clamp(380px,40vw,560px)] min-[620px]:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      {track("left")}
      {track("right")}
    </div>
  );
}
