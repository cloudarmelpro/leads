"use client";

import type { CSSProperties, PointerEvent } from "react";

/** Position de départ du halo (centre haut), avant tout mouvement du pointeur. */
export const SPOT_STYLE = { ["--mx" as string]: "50%", ["--my" as string]: "40%" } as CSSProperties;

/** À poser en `onPointerMove` sur la section : le halo suit le pointeur. */
export function moveSpot(e: PointerEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
}

/** Halo vert des heros centrés (À propos, Contact, Prix), déborde de 140px sous l'en-tête. */
export function HeroSpot() {
  return <div aria-hidden className="pointer-events-none absolute inset-x-[0px] top-[-140px] bottom-[0px] bg-[radial-gradient(620px_circle_at_var(--mx)_var(--my),rgba(48,217,140,0.10),transparent_62%)]" />;
}
