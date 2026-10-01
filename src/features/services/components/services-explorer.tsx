"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from "react";

import { DotMap } from "@/components/shared/dot-map";
import { HeroCentre } from "@/components/shared/hero-centre";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Props = { lang: Locale; dict: Pick<Dictionary, "servicesPage"> };
type Family = Dictionary["servicesPage"]["families"][number];

// Paramètre d'URL (identique FR/EN) : `?categorie=logo` ouvre la bonne famille.
const PARAM_FAMILY = "categorie";
// Sous ce décalage du haut de l'écran, la grille des catégories devient une barre fixe.
const COMPACT_AT = 78;
const BAR_TOP = 92;
// Hauteur d'une carte compacte (10px de marge + une ligne de 20px + 10px).
const COMPACT_H = 40;

const EASE_OUT = "cubic-bezier(0.22,1,0.36,1)";
const EASE_FOLD = "cubic-bezier(0.65,0,0.35,1)";
const RISE = "[animation:tw-rise_1.1s_cubic-bezier(0.22,1,0.36,1)_both] motion-reduce:[animation:none]";

// Glyphes des catégories (maquette), par clé.
const ICONS: Record<string, ReactNode> = {
  web: (
    <>
      <rect x="2.5" y="3.5" width="19" height="14" rx="2.5" />
      <path d="M8 21h8M12 17.5V21" />
    </>
  ),
  mobile: (
    <>
      <rect x="6" y="2" width="12" height="20" rx="2.5" />
      <path d="M11 18h2" />
    </>
  ),
  saas: <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />,
  integ: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />
    </>
  ),
  logo: (
    <>
      <path d="M15.7 21.3a1 1 0 0 1-1.4 0l-1.6-1.6a1 1 0 0 1 0-1.4l5.6-5.6a1 1 0 0 1 1.4 0l1.6 1.6a1 1 0 0 1 0 1.4z" />
      <path d="m18 13-1.4-6.9a1 1 0 0 0-.7-.8L3.2 2a1 1 0 0 0-1.2 1.2l3.3 12.7a1 1 0 0 0 .8.7L13 18" />
      <path d="m2.3 2.3 7.3 7.3" />
      <circle cx="11" cy="11" r="2" />
    </>
  ),
  host: (
    <>
      <rect width="20" height="8" x="2" y="2" rx="2" />
      <rect width="20" height="8" x="2" y="14" rx="2" />
      <path d="M6 6h.01M6 18h.01" />
    </>
  ),
};

/**
 * « 1 500 $ » → « 1 500 » + « $ » ; « 35 $ / mois » → « 35 » + « $ / mois » ; « $1,500 » reste
 * entier, « $35 / month » → « $35 » + « / month ».
 */
function splitPrice(price: string) {
  const fr = /^([\d\s  ]+?)\s*([^\d\s  ].*)$/.exec(price);
  if (fr) return { amount: fr[1], suffix: fr[2] };
  const en = price.indexOf(" /");
  if (en > 0) return { amount: price.slice(0, en), suffix: price.slice(en + 1) };
  return { amount: price, suffix: "" };
}

const subscribeNothing = () => () => {};
const readSearch = () => window.location.search;

function Check() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="mt-[2px] shrink-0 text-vert">
      <circle cx="12" cy="12" r="10" />
      <path d="m8.5 12.2 2.4 2.4 4.6-5" />
    </svg>
  );
}

/**
 * Page Services (maquette du 2026-09-30) : hero centré (halo, titre qui roule, texte
 * d'appui) avec la grille des six catégories, qui devient une barre fixe compacte sous
 * l'en-tête dès qu'elle atteint le haut de l'écran ; carte du monde en points ; puis les
 * services de la catégorie choisie en cartes (visuel, nom, phrase, prix de départ, bouton,
 * « Ce que vous obtenez »). Toutes les familles sont rendues côté serveur (les inactives
 * portent `hidden`) : chaque service et son prix sont indexés sans JavaScript. La catégorie
 * est lue dans l'URL au montage et y est réécrite à chaque choix.
 */
export function ServicesExplorer({ lang, dict }: Props) {
  const t = dict.servicesPage;
  const families: Family[] = t.families;
  const contact = `/${lang}/soumission`;

  const search = useSyncExternalStore(subscribeNothing, readSearch, () => "");
  const urlKey = useMemo(() => {
    const wanted = new URLSearchParams(search).get(PARAM_FAMILY);
    return (families.find((f) => f.key === wanted) ?? families[0]).key;
  }, [search, families]);
  const [picked, setPicked] = useState<string | null>(null);
  const famKey = picked ?? urlKey;
  const family = families.find((f) => f.key === famKey) ?? families[0];

  useEffect(() => {
    if (!picked) return;
    const url = new URL(window.location.href);
    if (picked === families[0].key) url.searchParams.delete(PARAM_FAMILY);
    else url.searchParams.set(PARAM_FAMILY, picked);
    window.history.replaceState(window.history.state, "", url);
  }, [picked, families]);

  // Barre compacte : la grille se fixe à 92px du haut ; son emplacement, mesuré en
  // permanence tant qu'elle est en place, glisse alors à la hauteur de la barre pour que
  // la carte et la suite remontent (demande du client, 2026-09-30) sans saut.
  const box = useRef<HTMLDivElement>(null);
  const grid = useRef<HTMLDivElement>(null);
  const [compact, setCompact] = useState(false);
  const compactRef = useRef(false);
  const [gridHeight, setGridHeight] = useState<number | null>(null);
  // Hauteur de la barre compacte (une rangée dès 1100px, trois en dessous) : règle la
  // bande de fond fixe qui couvre l'en-tête et la barre.
  const [barHeight, setBarHeight] = useState(COMPACT_H);
  useEffect(() => {
    const g = grid.current;
    if (!g) return;
    const ro = new ResizeObserver(() => {
      if (compactRef.current) setBarHeight(g.offsetHeight);
      else setGridHeight(g.offsetHeight);
    });
    ro.observe(g);
    return () => ro.disconnect();
  }, []);
  useEffect(() => {
    const onScroll = () => {
      const el = box.current;
      if (!el) return;
      const next = el.getBoundingClientRect().top <= COMPACT_AT;
      if (next !== compactRef.current) {
        compactRef.current = next;
        setCompact(next);
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const pick = (key: string) => {
    setPicked(key);
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        const target = document.getElementById("forfaits");
        if (!target) return;
        const bar = Math.max(grid.current?.offsetHeight ?? 0, 140);
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - bar + 2, behavior: reduce ? "auto" : "smooth" });
      }),
    );
  };

  const fold = compact ? "0fr" : "1fr";
  const foldStyle = { opacity: compact ? 0 : 1, transition: `grid-template-rows 820ms ${EASE_FOLD}, grid-template-columns 820ms ${EASE_FOLD}, opacity 420ms cubic-bezier(0.4,0,0.2,1)` };

  return (
    <>
      {/* Bande fixe derrière l'en-tête et la barre compacte (maquette `data-catbar`, sans son
          filet ni son flou : demande du client) : les cartes ne flottent pas sur le contenu qui
          défile. Sous la barre (z 56) et l'en-tête (z 60). */}
      <div
        aria-hidden
        className={`pointer-events-none fixed inset-x-[0px] top-[0px] z-[55] bg-fond/94 transition-opacity duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${compact ? "opacity-100" : "opacity-0"}`}
        style={{ height: BAR_TOP + barHeight + 14 }}
      />
      <HeroCentre title={t.title} lede={t.lede}>
          {/* L'animation d'entrée est retirée en mode compact : une animation de `transform`,
              même terminée, ferait de ce bloc le repère de la grille fixe.
              Marge haute plus aérée que la maquette (14–30px), demande du client du 2026-09-30 :
              avec les 22px de la colonne, le même écart que sous le hero de Soumission (72–140px). */}
          <div
            ref={box}
            className={`relative mt-[clamp(50px,8vw,118px)] w-full max-w-[1400px] [animation-delay:640ms] motion-safe:transition-[height] motion-safe:duration-[820ms] motion-safe:ease-[cubic-bezier(0.65,0,0.35,1)] ${compact ? "" : RISE}`}
            style={{ height: compact ? COMPACT_H : (gridHeight ?? "auto") }}
          >
            <div
              ref={grid}
              role="tablist"
              aria-label={t.catsAria}
              className={`z-[56] mx-auto grid max-w-[calc(100vw-2*(10px+clamp(18px,5vw,72px)))] gap-[clamp(10px,1vw,14px)] text-left ${
                compact
                  ? "fixed inset-x-[0px] top-[92px] w-[100vw] grid-cols-2 min-[1100px]:w-[min(1400px,calc(100vw-2*(10px+clamp(18px,5vw,72px))))] min-[1100px]:grid-cols-6"
                  : "relative w-full grid-cols-2 min-[1100px]:grid-cols-3"
              }`}
              style={{ top: compact ? BAR_TOP : undefined }}
            >
              {families.map((f, i) => {
                const on = f.key === family.key;
                return (
                  <button
                    key={f.key}
                    type="button"
                    role="tab"
                    aria-selected={on}
                    onClick={() => pick(f.key)}
                    style={{ transition: `padding 820ms ${EASE_FOLD}, border-radius 820ms ${EASE_FOLD}, background-color 560ms ${EASE_OUT}, box-shadow 560ms ${EASE_OUT}, transform 560ms ${EASE_OUT}` }}
                    className={`relative flex min-w-[0px] cursor-pointer flex-col overflow-hidden text-left backdrop-blur-[14px] hover:-translate-y-[3px] hover:shadow-[inset_0_0_0_1px_rgba(48,217,140,0.6),0_18px_44px_rgba(0,0,0,0.35)] ${
                      compact ? "rounded-[14px] px-[14px] py-[10px]" : "rounded-[16px] p-[clamp(16px,1.5vw,22px)]"
                    } ${
                      on
                        ? "bg-vert/10 shadow-[inset_0_0_0_1px_var(--color-vert),0_18px_44px_rgba(48,217,140,0.14)]"
                        : "bg-surface-2/90 shadow-[inset_0_0_0_1px_var(--color-contour)] dark:bg-[rgba(1,27,40,0.78)]"
                    }`}
                  >
                    <span aria-hidden className={`absolute inset-x-[0px] top-[0px] h-[2px] origin-left bg-vert transition-transform duration-[560ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${on ? "scale-x-100" : "scale-x-0"}`} />
                    {/* Barre compacte : icône et nom à gauche, centrés verticalement l'un sur l'autre
                        comme le logo de l'en-tête (demande du client). */}
                    <span className={`flex min-w-[0px] ${compact ? "items-center gap-[8px]" : "items-start gap-[10px]"}`} style={{ transition: `gap 820ms ${EASE_FOLD}` }}>
                      <span className={`flex h-[20px] w-[20px] shrink-0 items-center justify-center transition-colors duration-[560ms] ${on ? "text-vert" : "text-texte2"}`}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="block shrink-0">
                          {ICONS[f.key]}
                        </svg>
                      </span>
                      <span className="flex min-w-[0px] flex-1 flex-col">
                        <span className={`overflow-hidden font-semibold text-ellipsis whitespace-nowrap text-encre ${compact ? "mt-[2px] text-[14px] leading-[20px]" : "text-[15px] leading-[1.25]"}`} style={{ transition: `font-size 820ms ${EASE_FOLD}` }}>
                          {compact ? f.short : f.label}
                        </span>
                        <span className="grid" style={{ gridTemplateRows: fold, ...foldStyle }}>
                          <span className="min-h-[0px] overflow-hidden pt-[2px] text-[13px] leading-[18px] font-normal text-texte2">{f.count}</span>
                        </span>
                      </span>
                      <span className="grid" style={{ gridTemplateColumns: fold, ...foldStyle }}>
                        <span className={`min-w-[0px] overflow-hidden text-[12px] leading-[16px] font-medium tracking-[0.14em] ${on ? "text-vert" : "text-texte2"}`}>0{i + 1}</span>
                      </span>
                    </span>
                    <span className="grid" style={{ gridTemplateRows: fold, ...foldStyle }}>
                      <span className="min-h-[0px] overflow-hidden">
                        <span className="mt-[clamp(18px,2vw,26px)] flex items-end justify-between gap-[12px] border-t border-ligne pt-[14px] dark:border-[rgba(255,255,255,0.08)]">
                          <span className="flex flex-col gap-[2px]">
                            <span className="text-[11px] leading-[16px] font-medium tracking-[0.14em] text-texte2 uppercase">{t.labels.from}</span>
                            <span className="text-[clamp(20px,17.9px+0.55vw,26px)] leading-[1.1] font-semibold tracking-[-0.5px] whitespace-nowrap text-encre">
                              {f.price}
                              <span className="text-[13px] font-normal tracking-normal text-texte2">{f.unit}</span>
                            </span>
                          </span>
                          <span className={`flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full ${on ? "bg-bouton text-sur-bouton" : "bg-encre/6 text-encre"}`}>
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                              <path d="M12 5v14M19 12l-7 7-7-7" />
                            </svg>
                          </span>
                        </span>
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className={`relative mt-[10px] h-[360px] w-full max-w-[960px] [animation-delay:880ms] ${RISE}`}>
            <div className="mb-[clamp(-120px,-8vw,-48px)]">
              <DotMap label={t.mapAria} />
            </div>
          </div>
      </HeroCentre>

      <div id="prix" />

      <section id="forfaits" className="flex justify-center px-[calc(10px+clamp(18px,5vw,72px))] pt-[clamp(40px,4.5vw,72px)] pb-[clamp(96px,11vw,180px)]">
        <div className="w-full max-w-[1400px]">
          {families.map((f) => (
            <div key={f.key} hidden={f.key !== family.key} className="flex flex-col gap-[48px]">
              <div className="flex flex-wrap items-end justify-between gap-[40px]">
                <div className="flex flex-col gap-[2px]">
                  <span className="text-[13px] leading-[20px] font-medium tracking-[0.08em] text-vert uppercase">{t.labels.kicker}</span>
                  <h2 className="m-[0px] text-[clamp(22px,2.6vw,30px)] leading-[1.15] font-normal tracking-[-0.4px] text-encre">{f.title}</h2>
                </div>
                <p className="m-[0px] ml-auto max-w-[420px] text-right text-[14px] leading-[24px] font-normal text-texte2 text-pretty">{f.desc}</p>
              </div>

              <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,max(280px,calc((100%-32px)/3))),1fr))] gap-[16px]">
                {f.plans.map((plan) => {
                  const { amount, suffix } = splitPrice(plan.price);
                  return (
                    <div key={plan.name} className="flex min-w-[0px] flex-col gap-[12px]">
                      {/* Mode clair : le visuel clair détouré de l'accueil, posé sur la carte grise ;
                          mode sombre : la photo nuit de la maquette (demande du client, 2026-09-30). */}
                      <div className="relative aspect-[16/10] overflow-hidden rounded-[24px] bg-surface-2 dark:bg-[#011823]">
                        <span className="absolute inset-[22px] block dark:hidden">
                          <Image src={`/images/home/services/${plan.img}-clair.webp`} alt={plan.name} fill sizes="(max-width: 900px) 100vw, 460px" className="object-contain object-center" />
                        </span>
                        <Image src={`/images/home/services/${plan.img}.jpg`} alt={plan.name} fill sizes="(max-width: 900px) 100vw, 460px" className="hidden object-cover dark:block" />
                      </div>
                      <div className="flex min-h-[300px] flex-col gap-[14px] px-[4px] pt-[16px] pb-[20px]">
                        <div className="flex flex-col gap-[8px]">
                          <span className="text-[22px] leading-[28px] font-medium text-encre">{plan.name}</span>
                          <span className="text-[15px] leading-[23px] font-normal text-texte2 text-pretty">{plan.who}</span>
                        </div>
                        <div className="mt-auto flex flex-col gap-[4px]">
                          <span className="flex flex-wrap items-baseline gap-[6px]">
                            <span className="text-[clamp(36px,3.4vw,48px)] leading-[1.05] font-bold tracking-[-0.03em] whitespace-nowrap text-encre tabular-nums">{amount}</span>
                            {suffix && <span className="text-[16px] leading-[22px] font-normal whitespace-nowrap text-texte2">{suffix}</span>}
                          </span>
                          <span className="text-[14px] leading-[20px] font-normal text-texte2">{t.labels.minimum}</span>
                        </div>
                        <Link
                          href={contact}
                          aria-label={`${plan.cta} — ${plan.name}`}
                          className="flex min-h-[48px] items-center justify-center rounded-[10px] bg-bouton px-[20px] text-[15px] leading-[20px] font-medium text-sur-bouton no-underline transition-colors duration-[220ms] ease-[cubic-bezier(0.2,0.7,0.2,1)] hover:bg-bouton-clair"
                        >
                          {plan.cta}
                        </Link>
                      </div>
                      <div className="flex flex-1 flex-col gap-[16px] px-[4px] pb-[8px]">
                        <span className="text-[15px] leading-[22px] font-medium text-encre">{t.labels.youGet}</span>
                        <ul className="m-[0px] flex list-none flex-col gap-[10px] p-[0px]">
                          {plan.items.map((item) => (
                            <li key={item} className="flex items-start gap-[10px]">
                              <Check />
                              <span className="text-[14.5px] leading-[22px] font-normal text-texte-bascule text-pretty">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
