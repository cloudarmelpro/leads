"use client";

import { useEffect, useRef } from "react";

/**
 * Filet de progression en haut de page (maquettes des pages intérieures) : 2px, dégradé
 * vert, qui s'étire de gauche à droite avec le défilement.
 */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = ref.current;
    if (!bar) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const de = document.scrollingElement ?? document.documentElement;
      const max = Math.max(1, de.scrollHeight - window.innerHeight);
      bar.style.transform = `scaleX(${Math.min(1, Math.max(0, de.scrollTop / max)).toFixed(4)})`;
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-x-[0px] top-[0px] z-[80] h-[2px] origin-left scale-x-0 bg-[linear-gradient(90deg,#1FA56A,#30D98C,#7FEFC0)] shadow-[0_0_10px_rgba(48,217,140,0.7)]"
    />
  );
}
