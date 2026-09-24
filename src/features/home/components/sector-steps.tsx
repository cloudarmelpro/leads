"use client";

import { useEffect } from "react";

// Rétrécissement maximal d'une carte quand la suivante la recouvre entièrement (maquette).
const SHRINK = 0.12;
// Sur la toute fin du recouvrement, la carte du dessous ne dépasse plus que de quelques
// pixels : ce liseré aux coins arrondis se lit comme un défaut, on l'efface.
const FADE_FROM = 0.85;

/**
 * Effet d'empilement de la section Secteurs (maquette Accueil) : chaque carte se rétrécit
 * légèrement à mesure que la suivante glisse par-dessus (lecture de la position au
 * défilement, une frame à la fois, `transform` et `opacity` seulement). L'échelle part du
 * CENTRE de la carte : son bord haut descend donc sous la carte suivante au lieu de laisser
 * dépasser un liseré. Rien sous `prefers-reduced-motion`. Ne rend rien.
 */
export function SectorStack() {
  useEffect(() => {
    const cards = Array.from(document.querySelectorAll<HTMLElement>("[data-sector-card]"));
    if (cards.length === 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const paint = () => {
      frame = 0;
      const viewport = window.innerHeight;
      for (let i = 0; i < cards.length - 1; i++) {
        const next = cards[i + 1];
        const stuckTop = parseFloat(getComputedStyle(next).top) || 0;
        // 0 quand la carte suivante entre par le bas, 1 quand elle est collée à sa place.
        const progress = Math.min(1, Math.max(0, (viewport - next.getBoundingClientRect().top) / (viewport - stuckTop)));
        cards[i].style.transform = progress > 0 ? `scale(${1 - SHRINK * progress})` : "";
        cards[i].style.opacity = progress > FADE_FROM ? String((1 - progress) / (1 - FADE_FROM)) : "";
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };
    paint();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
      cards.forEach((card) => {
        card.style.transform = "";
        card.style.opacity = "";
      });
    };
  }, []);

  return null;
}
