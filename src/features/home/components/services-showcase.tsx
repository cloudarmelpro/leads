"use client";

import { Blend, Box, ChevronRight, Globe, Layers, Mail, Pause, Play, RefreshCw, Share2, TrendingUp, type LucideIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { features } from "@/config/site";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Item = Dictionary["services"]["items"][number];
type Props = { lang: Locale; items: Item[]; controls: Dictionary["services"]["controls"] };

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

// Colonnes de la piste, comme la référence : une vignette haute, puis deux empilées, en alternance.
const COLUMNS: number[][] = [[0], [1, 2], [3], [4, 5], [6], [7]];

const MOTIF_MASK = "linear-gradient(135deg, transparent 0%, rgba(0,0,0,0.35) 45%, #000 100%)";

/**
 * Vitrine des services : piste horizontale de six colonnes de vignettes qui défile en
 * continu vers la gauche et boucle (deux copies de la piste, translation de -50 %,
 * animation CSS `tw-marquee` sur `transform` seulement). Pause au survol, par le bouton,
 * et à l'arrêt sous `prefers-reduced-motion`. Les huit services sont dans le HTML une
 * seule fois pour le référencement : la seconde copie est `aria-hidden` et non focusable.
 */
export function ServicesShowcase({ lang, items, controls }: Props) {
  const [paused, setPaused] = useState(false);

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
          sizes="340px"
          className="pointer-events-none object-cover object-right-bottom opacity-[0.55] mix-blend-screen select-none"
          style={{ maskImage: MOTIF_MASK, WebkitMaskImage: MOTIF_MASK }}
        />
        <span className="relative flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-[12px] bg-surface-2 text-vert">
          <Icon size={19} strokeWidth={1.6} aria-hidden />
        </span>
        <h3 className="relative m-[0px] text-[clamp(15px,1.2vw,17px)] leading-[1.3] font-medium text-encre">{item.name}</h3>
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

  // Chaque copie porte à droite le même écart qu'entre ses colonnes : la piste fait alors
  // exactement deux longueurs identiques et -50 % boucle sans à-coup.
  const copy = (clone: boolean) => (
    <div aria-hidden={clone || undefined} className="flex h-full shrink-0 gap-[14px] pr-[14px]">
      {COLUMNS.map((column, c) => (
        <div key={`${c}-${clone ? "b" : "a"}`} className={`flex h-full shrink-0 flex-col gap-[14px] ${column.length === 1 ? "w-[clamp(240px,23vw,340px)]" : "w-[clamp(220px,21vw,300px)]"}`}>
          {column.map((index) => tile(index, column.length === 1, clone))}
        </div>
      ))}
    </div>
  );

  return (
    <div className="group flex flex-col gap-[14px]">
      <div className="relative h-[clamp(380px,40vw,560px)] overflow-hidden">
        <div
          className="flex h-full w-max [animation:tw-marquee_52s_linear_infinite] group-hover:[animation-play-state:paused] motion-reduce:[animation:none]"
          style={paused ? { animationPlayState: "paused" } : undefined}
        >
          {copy(false)}
          {copy(true)}
        </div>
      </div>
      <button
        type="button"
        onClick={() => setPaused((p) => !p)}
        aria-pressed={paused}
        aria-label={paused ? controls.play : controls.pause}
        className="flex h-[38px] w-[38px] cursor-pointer items-center justify-center rounded-[8px] bg-surface-2 text-encre ring-1 ring-contour ring-inset transition-colors hover:bg-surface-3"
      >
        {paused ? <Play size={16} strokeWidth={2} aria-hidden /> : <Pause size={16} strokeWidth={2} aria-hidden />}
      </button>
    </div>
  );
}
