"use client";

import { useEffect, useRef } from "react";

import { ActionLink } from "@/components/shared/action-link";
import { site, telHref } from "@/config/site";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Props = { dict: Pick<Dictionary, "final" | "placeholders"> };

// Méridiens et parallèles du globe filaire, repris tels quels de la maquette (viewBox 2000).
const MERIDIANS = [309.0, 587.8, 809.0, 951.1, 1000.0, 951.1, 809.0, 587.8, 309.0];
const PARALLELS: [number, number, number][] = [
  [691.0, 1309.0, 48.9],
  [412.2, 1587.8, 191.0],
  [191.0, 1809.0, 412.2],
  [48.9, 1951.1, 691.0],
  [0.0, 2000.0, 1000.0],
  [48.9, 1951.1, 1309.0],
  [191.0, 1809.0, 1587.8],
  [412.2, 1587.8, 1809.0],
  [691.0, 1309.0, 1951.1],
];

/**
 * Bandeau d'appel final (maquette Accueil, 2026-09-24) : grand panneau arrondi, un globe
 * filaire qui dépasse du haut, une épingle verte pulsante avec son faisceau, puis au centre
 * le titre, le texte, le bouton d'appel et la mention de délai. À la souris, le globe
 * glisse, son quadrillage tourne et l'épingle suit (rien sous `prefers-reduced-motion`).
 */
export function Cta({ dict }: Props) {
  const t = dict.final;
  const phone = site.phone ?? dict.placeholders.phone;
  const panel = useRef<HTMLDivElement>(null);
  const globe = useRef<SVGSVGElement>(null);
  const grid = useRef<SVGGElement>(null);
  const pin = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = panel.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const nx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      const ny = ((e.clientY - r.top) / r.height - 0.5) * 2;
      if (grid.current) grid.current.style.transform = `rotate(${(nx * 10).toFixed(2)}deg)`;
      globe.current?.style.setProperty("--move", `translate(${(nx * 18).toFixed(1)}px,${(ny * 12).toFixed(1)}px)`);
      if (pin.current) pin.current.style.transform = `translate(${(nx * 46).toFixed(1)}px,${(ny * 30).toFixed(1)}px)`;
    };
    const onLeave = () => {
      if (grid.current) grid.current.style.transform = "";
      globe.current?.style.removeProperty("--move");
      if (pin.current) pin.current.style.transform = "";
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <section id="contact" className="relative flex justify-center px-[10px]">
      <div
        ref={panel}
        className="relative isolate flex w-full items-center justify-center overflow-hidden rounded-[24px] bg-surface-2 dark:bg-surface px-[clamp(20px,5vw,72px)] py-[clamp(56px,8vw,120px)] min-[620px]:min-h-[min(82vh,820px)]"
      >
        <svg
          ref={globe}
          aria-hidden
          viewBox="0 0 2000 2000"
          className="pointer-events-none absolute top-[0px] left-1/2 block h-auto w-[220%] [--dy:-62%] [transform:translate(-50%,var(--dy))_var(--move,translate(0px,0px))] select-none min-[620px]:w-[min(118%,1300px)] min-[620px]:[--dy:-60%] min-[1100px]:[--dy:-52%]"
        >
          <defs>
            <clipPath id="tw-globe-clip">
              <circle cx="1000" cy="1000" r="998" />
            </clipPath>
          </defs>
          <circle cx="1000" cy="1000" r="1000" fill="var(--color-globe)" />
          <g
            ref={grid}
            clipPath="url(#tw-globe-clip)"
            fill="none"
            stroke="var(--color-globe-trait)"
            strokeWidth="2"
            className="[transform-box:view-box] [transform-origin:1000px_1000px] transition-transform duration-[900ms] ease-[cubic-bezier(0.2,0.7,0.2,1)]"
          >
            <line x1="1000" y1="0" x2="1000" y2="2000" />
            {MERIDIANS.map((rx, i) => (
              <ellipse key={`m${i}`} cx="1000" cy="1000" rx={rx} ry="1000" />
            ))}
            {PARALLELS.map(([x1, x2, y], i) => (
              <line key={`p${i}`} x1={x1} y1={y} x2={x2} y2={y} />
            ))}
          </g>
          <circle cx="1000" cy="1000" r="999" fill="none" stroke="var(--color-globe-bord)" strokeWidth="2" />
        </svg>

        <div
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-1/2 z-[1] [transform:translate(calc(-50%_-_90px),calc(-50%_-_150px))] min-[620px]:[transform:translate(calc(-50%_-_220px),calc(-50%_-_170px))]"
        >
          <div ref={pin} className="transition-transform duration-[700ms] ease-[cubic-bezier(0.2,0.7,0.2,1)]">
            <span className="absolute top-1/2 left-1/2 block h-[110px] w-[260px] origin-[0_50%] [transform:translateY(-50%)_rotate(28deg)] bg-[linear-gradient(90deg,rgba(48,217,140,0.28)_0%,rgba(48,217,140,0)_100%)] [clip-path:polygon(0_46%,100%_0,100%_100%,0_54%)]" />
            <span className="relative flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[rgba(255,255,255,0.85)] shadow-[0_10px_30px_rgba(15,29,23,0.16)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
              <span className="block h-[38px] w-[38px] rounded-full bg-[#30D98C] [animation:tw-pin-pulse_2.4s_ease-in-out_infinite]" />
            </span>
          </div>
        </div>

        <div className="relative z-[2] flex max-w-[640px] flex-col items-center gap-[28px] pt-[56px] text-center">
          <h2 className="m-[0px] text-[clamp(22px,2.2vw,30px)] leading-[1.2] font-semibold tracking-[-0.01em] text-encre text-balance">{t.title}</h2>
          <p className="m-[0px] max-w-[440px] text-[15px] leading-[26px] font-normal text-texte2 text-pretty">{t.body}</p>
          <ActionLink
            href={telHref(site.phone)}
            unavailableLabel={`${t.callLabel} — ${phone}`}
            className="inline-flex h-[48px] items-center gap-[10px] rounded-[8px] bg-vert px-[22px] text-[15px] leading-[1] font-medium whitespace-nowrap text-sur-vert no-underline transition-[background-color,transform] duration-200 ease-[cubic-bezier(0.2,0.7,0.2,1)] hover:-translate-y-[2px] hover:bg-vert-clair active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-55"
          >
            {t.callLabel} · {phone}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </ActionLink>
          <span className="text-[13px] leading-[18px] font-normal text-texte-note">{t.note}</span>
        </div>
      </div>
    </section>
  );
}
