"use client";

import { Blend, Box, ChevronLeft, ChevronRight, Globe, Layers, Mail, Pause, Play, RefreshCw, Share2, TrendingUp, type LucideIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

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

const VISIBLE = 4;
const STEP_MS = 3800;
// Les quatre emplacements de la mosaïque 2 × 2, en % du cadre.
const SLOTS = [
  { left: "0%", top: "0%" },
  { left: "51%", top: "0%" },
  { left: "0%", top: "51%" },
  { left: "51%", top: "51%" },
];
const MOTIF_MASK = "linear-gradient(135deg, transparent 0%, rgba(0,0,0,0.35) 45%, #000 100%)";
const CONTROL =
  "flex h-[38px] w-[38px] cursor-pointer items-center justify-center rounded-[8px] bg-surface-2 text-encre ring-1 ring-contour ring-inset transition-colors hover:bg-surface-3";

/**
 * Mosaïque 2 × 2 des huit services : quatre vignettes visibles, les quatre autres
 * attendent sous leur futur emplacement (fondu + léger décalage) et prennent la place
 * toutes les 3,8 s. Les huit sont dans le HTML (référencement) ; seules les visibles sont
 * cliquables. Pause au survol, au focus et sous `prefers-reduced-motion` ; boutons
 * précédent / suivant / pause pour la commande manuelle. Transitions CSS seulement.
 */
export function ServicesShowcase({ lang, items, controls }: Props) {
  const [offset, setOffset] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const count = items.length;

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  const running = !paused && !hovering && !reduced;
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setOffset((o) => (o + 2) % count), STEP_MS);
    return () => clearInterval(id);
  }, [running, count]);

  const step = (delta: number) => setOffset((o) => (o + delta + count) % count);

  return (
    <div className="flex flex-col gap-[14px]" onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)} onFocus={() => setHovering(true)} onBlur={() => setHovering(false)}>
      <div className="relative aspect-[1/1] w-full min-[620px]:aspect-[1.08/1]">
        {items.map((item, index) => {
          const card = CARDS[index];
          if (!card) return null;
          const { Icon, motif, pricing } = card;
          const slot = (index - offset + count) % count;
          const shown = slot < VISIBLE;
          const pos = SLOTS[slot % VISIBLE];
          const priceLine = features.pricing && pricing && item.pricing ? item.pricing : null;

          return (
            <article
              key={item.name}
              aria-hidden={!shown}
              style={{ left: pos.left, top: pos.top }}
              className={`absolute flex h-[49%] w-[49%] flex-col gap-[10px] overflow-hidden rounded-[20px] bg-surface p-[clamp(14px,1.6vw,22px)] ring-1 ring-ligne ring-inset transition-[opacity,transform] duration-[520ms] ease-[cubic-bezier(0.2,0.7,0.2,1)] dark:ring-0 ${
                shown ? "translate-y-[0px] opacity-100" : "pointer-events-none translate-y-[18px] opacity-0"
              }`}
            >
              <Image
                src={`/images/home/${motif}.jpg`}
                alt=""
                aria-hidden
                fill
                sizes="(max-width: 620px) 50vw, 400px"
                className="pointer-events-none object-cover object-right-bottom opacity-[0.5] mix-blend-screen select-none"
                style={{ maskImage: MOTIF_MASK, WebkitMaskImage: MOTIF_MASK }}
              />
              <span className="relative flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-[12px] bg-surface-2 text-vert">
                <Icon size={19} strokeWidth={1.6} aria-hidden />
              </span>
              <h3 className="relative m-[0px] text-[clamp(14px,1.25vw,17px)] leading-[1.3] font-medium text-encre">{item.name}</h3>
              <p className="relative m-[0px] hidden text-[clamp(12px,1vw,14px)] leading-[1.55] font-normal text-texte2 text-pretty min-[620px]:line-clamp-4 min-[620px]:block">{item.note}</p>
              {priceLine && (
                <Link
                  href={`/${lang}/prix?${pricing}`}
                  aria-label={`${priceLine} — ${item.name}`}
                  tabIndex={shown ? undefined : -1}
                  className="relative mt-auto flex min-h-[32px] w-fit items-center text-[clamp(12px,1vw,14px)] leading-[20px] font-medium text-vert no-underline transition-colors hover:text-vert-clair"
                >
                  <span className="text-pretty">
                    {priceLine}
                    <ChevronRight size={15} strokeWidth={2} aria-hidden className="ml-[3px] inline-block align-[-3px]" />
                  </span>
                </Link>
              )}
            </article>
          );
        })}
      </div>

      <div className="flex items-center gap-[8px]">
        <button type="button" onClick={() => step(-2)} aria-label={controls.prev} className={CONTROL}>
          <ChevronLeft size={18} strokeWidth={2} aria-hidden />
        </button>
        <button type="button" onClick={() => step(2)} aria-label={controls.next} className={CONTROL}>
          <ChevronRight size={18} strokeWidth={2} aria-hidden />
        </button>
        <button type="button" onClick={() => setPaused((p) => !p)} aria-pressed={paused} aria-label={paused ? controls.play : controls.pause} className={CONTROL}>
          {paused ? <Play size={16} strokeWidth={2} aria-hidden /> : <Pause size={16} strokeWidth={2} aria-hidden />}
        </button>
      </div>
    </div>
  );
}
