"use client";

import { useEffect, useRef } from "react";

import { ActionLink } from "@/components/shared/action-link";
import { site, telHref } from "@/config/site";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Props = { dict: Pick<Dictionary, "final" | "placeholders"> };

// Quadrillage du globe (viewBox 2000, rayon 1000) : pôle nord basculé vers nous de TILT,
// projection orthographique, face avant seulement. Parallèles et méridiens tous les 15°.
const TILT = (22 * Math.PI) / 180;
const RAD = Math.PI / 180;

function project(lat: number, lon: number): [number, number, number] {
  const x = Math.cos(lat * RAD) * Math.sin(lon * RAD);
  const y = Math.sin(lat * RAD);
  const z = Math.cos(lat * RAD) * Math.cos(lon * RAD);
  const ty = y * Math.cos(TILT) - z * Math.sin(TILT);
  const tz = y * Math.sin(TILT) + z * Math.cos(TILT);
  return [1000 + 1000 * x, 1000 - 1000 * ty, tz];
}

function trace(points: [number, number, number][]): string {
  let d = "";
  let pen = false;
  for (const [x, y, z] of points) {
    if (z <= 0) {
      pen = false;
      continue;
    }
    d += `${pen ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`;
    pen = true;
  }
  return d;
}

const range = (from: number, to: number, step: number) => Array.from({ length: Math.floor((to - from) / step) + 1 }, (_, i) => from + i * step);
const GRID = [
  ...range(-75, 75, 15).map((lat) => trace(range(-180, 180, 2).map((lon) => project(lat, lon)))),
  ...range(0, 345, 15).map((lon) => trace(range(-90, 90, 2).map((lat) => project(lat, lon)))),
].filter(Boolean);

/**
 * Bandeau d'appel final (maquette Accueil, 2026-09-24) : grand panneau arrondi, un globe
 * filaire qui dépasse du haut, une épingle verte pulsante avec son faisceau, puis au centre
 * le titre, le texte, le bouton d'appel et la mention de délai. À la souris, le globe
 * glisse, son quadrillage tourne et l'épingle suit (rien sous `prefers-reduced-motion`).
 * Dès 1100px, le globe déborde du panneau et n'en montre que la calotte basse. Dès 620px, la
 * hauteur mini du panneau vaut la partie visible du globe (largeur × (1 − `--dy`)) + une marge,
 * 540px au moins sous 1100px pour que l'épingle ne touche pas le bord : toucher à la largeur
 * ou à `--dy` oblige à la recalculer.
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
        className="relative isolate flex w-full items-center justify-center overflow-hidden rounded-[24px] bg-surface-2 dark:bg-surface px-[clamp(20px,5vw,72px)] py-[clamp(56px,8vw,120px)] min-[620px]:min-h-[max(540px,calc(0.4*1.18*(100vw-20px)+60px))] min-[1100px]:min-h-[calc(0.36*1.2*(100vw-20px)+80px)] min-[1440px]:min-h-[calc(0.31*1.2*(100vw-20px)+80px)]"
      >
        <svg
          ref={globe}
          aria-hidden
          viewBox="0 0 2000 2000"
          className="pointer-events-none absolute top-[0px] left-1/2 block h-auto w-[220%] [--dy:-62%] [transform:translate(-50%,var(--dy))_var(--move,translate(0px,0px))] select-none min-[620px]:w-[118%] min-[620px]:[--dy:-60%] min-[1100px]:w-[120%] min-[1100px]:[--dy:-64%] min-[1440px]:[--dy:-69%]"
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
            {GRID.map((d, i) => (
              <path key={i} d={d} />
            ))}
          </g>
          <circle cx="1000" cy="1000" r="999" fill="none" stroke="var(--color-globe-bord)" strokeWidth="2" />
        </svg>

        <div
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-1/2 z-[1] max-[619px]:scale-[0.8] [transform:translate(calc(-50%_-_90px),calc(-50%_-_150px))] min-[620px]:[transform:translate(calc(-50%_-_220px),calc(-50%_-_170px))]"
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
          <p className="m-[0px] max-w-[440px] text-[clamp(14px,13.48px+0.14vw,15px)] leading-[1.7] font-normal text-texte2 text-pretty">{t.body}</p>
          <ActionLink
            href={telHref(site.phone)}
            unavailableLabel={`${t.callLabel} — ${phone}`}
            className="tap-44 inline-flex h-[clamp(40px,35.86px+1.1vw,48px)] items-center gap-[clamp(7px,5.45px+0.41vw,10px)] rounded-[8px] bg-vert px-[clamp(16px,12.9px+0.83vw,22px)] text-[clamp(13px,11.97px+0.28vw,15px)] leading-[1] [&>svg]:size-[clamp(14px,12.97px+0.28vw,16px)] font-medium whitespace-nowrap text-sur-vert no-underline transition-[background-color,transform] duration-200 ease-[cubic-bezier(0.2,0.7,0.2,1)] hover:-translate-y-[2px] hover:bg-vert-clair active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-55"
          >
            {t.callLabel} · {phone}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="m9 6 6 6-6 6" />
            </svg>
          </ActionLink>
          <span className="text-[13px] leading-[18px] font-normal text-texte-note">{t.note}</span>
        </div>
      </div>
    </section>
  );
}
