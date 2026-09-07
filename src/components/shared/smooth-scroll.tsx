"use client";

import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { useEffect } from "react";

import { gsap, reducedMotion, ScrollTrigger } from "@/lib/gsap";

/**
 * Smooth scroll (Lenis) piloté par le ticker GSAP — indispensable pour que
 * ScrollTrigger reste synchronisé avec le défilement lissé (technique du site
 * de référence). Les liens d'ancre de la page (`<a href="#…">`, pas `<Link>`)
 * défilent en douceur jusqu'à la cible ; Lenis respecte déjà le
 * `scroll-margin-top` des sections, ne pas ajouter d'offset. Désactivé sous `prefers-reduced-motion`. Ne rend rien.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (reducedMotion()) return;

    const lenis = new Lenis({ autoRaf: false, anchors: { duration: 1.2 } });
    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
