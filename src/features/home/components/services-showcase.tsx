import { Blend, Box, ChevronRight, Globe, Layers, Mail, RefreshCw, Share2, TrendingUp, type LucideIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { features } from "@/config/site";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Item = Dictionary["services"]["items"][number];
type Props = { lang: Locale; items: Item[] };

// Une entrée par service, dans l'ordre du dictionnaire : glyphe, motif de fond et, pour
// les services vendus sur la page Prix, la requête `categorie`/`gamme` (identique FR/EN).
const CARDS: { Icon: LucideIcon; motif: string; pricing?: string }[] = [
  { Icon: Globe, motif: "svc-globe", pricing: "categorie=site" },
  { Icon: RefreshCw, motif: "svc-rings", pricing: "categorie=site" },
  { Icon: Layers, motif: "svc-stack", pricing: "categorie=host" },
  { Icon: Mail, motif: "svc-mail", pricing: "categorie=host" },
  { Icon: Blend, motif: "svc-identity", pricing: "categorie=logo" },
  { Icon: Box, motif: "svc-cube", pricing: "categorie=vps" },
  { Icon: Share2, motif: "svc-network", pricing: "categorie=site&gamme=croissance" },
  { Icon: TrendingUp, motif: "svc-growth", pricing: "categorie=site&gamme=croissance" },
];

// Trois tableaux, comme la référence : chacun deux colonnes, une vignette haute ou deux
// empilées. Les indices renvoient à `items` / `CARDS`. `tw-vitrine` (globals.css) est
// écrite pour exactement trois tableaux.
const SCENES: { left: number[]; right: number[] }[] = [
  { left: [0], right: [1, 2] },
  { left: [3, 4], right: [5] },
  { left: [6], right: [7] },
];

const MOTIF_MASK = "linear-gradient(135deg, transparent 0%, rgba(0,0,0,0.35) 45%, #000 100%)";

/**
 * Vitrine des services : trois tableaux de vignettes se succèdent toutes les ~3 s, comme
 * la référence. Colonne gauche : les cartes arrivent de la droite et poussent les
 * précédentes vers la gauche (`tw-vitrine`). Colonne droite : elles arrivent du bas et
 * poussent vers le haut (`tw-vitrine-y`), un temps après. Chaque colonne est une piste
 * (les trois tableaux + une copie du premier pour boucler), sur `transform` seulement. Pause au
 * survol, arrêt sous `prefers-reduced-motion`. Les huit services sont une fois dans le
 * HTML ; la copie de bouclage est `aria-hidden` et non focusable.
 */
export function ServicesShowcase({ lang, items }: Props) {
  const tile = (index: number, tall: boolean, clone: boolean) => {
    const item = items[index];
    const card = CARDS[index];
    if (!item || !card) return null;
    const { Icon, motif, pricing } = card;
    const priceLine = features.pricing && pricing && item.pricing ? item.pricing : null;

    return (
      <article
        key={`${index}-${clone ? "b" : "a"}`}
        className={`relative flex min-h-[0px] flex-col gap-[10px] overflow-hidden rounded-[20px] bg-surface p-[clamp(16px,1.6vw,24px)] ring-1 ring-ligne ring-inset dark:ring-0 ${
          tall ? "h-full" : "flex-1"
        }`}
      >
        <Image
          src={`/images/home/${motif}.jpg`}
          alt=""
          aria-hidden
          fill
          sizes="(max-width: 900px) 50vw, 520px"
          className="pointer-events-none object-cover object-right-bottom opacity-[0.55] mix-blend-screen select-none"
          style={{ maskImage: MOTIF_MASK, WebkitMaskImage: MOTIF_MASK }}
        />
        <span className="relative flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-[12px] bg-surface-2 text-vert">
          <Icon size={19} strokeWidth={1.6} aria-hidden />
        </span>
        <h3 className="relative m-[0px] text-[clamp(15px,1.2vw,18px)] leading-[1.3] font-normal text-encre">{item.name}</h3>
        <p className={`relative m-[0px] text-[clamp(12.5px,0.95vw,14px)] leading-[1.55] font-normal text-texte2 text-pretty ${tall ? "line-clamp-6" : "line-clamp-3"}`}>{item.note}</p>
        {priceLine && (
          <Link
            href={`/${lang}/prix?${pricing}`}
            aria-label={`${priceLine} — ${item.name}`}
            tabIndex={clone ? -1 : undefined}
            className="relative mt-auto flex min-h-[32px] w-fit items-center text-[clamp(12.5px,0.95vw,14px)] leading-[20px] font-medium text-vert no-underline transition-colors hover:text-vert-clair"
          >
            <span className="text-pretty">
              {priceLine}
              <ChevronRight size={15} strokeWidth={2} aria-hidden className="ml-[3px] inline-block align-[-3px]" />
            </span>
          </Link>
        )}
      </article>
    );
  };

  // Une piste par colonne, avec les trois tableaux puis la copie du premier pour boucler.
  // Colonne gauche : les cartes arrivent de la droite et poussent vers la gauche.
  // Colonne droite : elles arrivent du bas et poussent vers le haut, un temps après.
  const track = (side: "left" | "right") => {
    const slides = [...SCENES, SCENES[0]];
    const horizontal = side === "left";
    return (
      <div className="h-full overflow-hidden">
        <div
          className={`h-full w-full motion-reduce:[animation:none] group-hover:[animation-play-state:paused] ${
            horizontal
              ? "flex gap-[14px] [animation:tw-vitrine_12.6s_cubic-bezier(0.65,0,0.35,1)_infinite]"
              : "flex flex-col gap-[14px] [animation:tw-vitrine-y_12.6s_cubic-bezier(0.65,0,0.35,1)_infinite] [animation-delay:160ms]"
          }`}
        >
          {slides.map((scene, s) => {
            const clone = s === SCENES.length;
            const column = scene[side];
            return (
              <div
                key={`${side}-${s}`}
                aria-hidden={clone || undefined}
                className="flex h-full w-full shrink-0 flex-col gap-[14px]"
              >
                {column.map((index) => tile(index, column.length === 1, clone))}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="group grid h-[clamp(380px,40vw,560px)] grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-[14px]">
      {track("left")}
      {track("right")}
    </div>
  );
}
