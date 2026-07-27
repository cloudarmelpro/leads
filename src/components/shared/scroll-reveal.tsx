"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Révélation au scroll, façon « entrance animations ».
 * - Le contenu est masqué UNIQUEMENT si `html.reveal-ready` est posé (par le
 *   petit script inline du layout, avant peinture) → sans JS ou sous
 *   `prefers-reduced-motion`, tout reste visible (progressive enhancement).
 * - Chaque élément `[data-reveal]` reçoit `is-visible` quand il entre à l'écran ;
 *   le CSS (globals.css) gère le fondu + glissement directionnel + le délai
 *   (`--reveal-delay`) pour l'effet cascade.
 * - Ré-observe à chaque navigation client (App Router garde ce composant monté).
 */
export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    if (!root.classList.contains("reveal-ready")) return; // reduced-motion / no-JS

    // Rejeu : on (dé)révèle à CHAQUE entrée/sortie de vue (pas de `unobserve`) →
    // l'animation se relance quand on scrolle vers le bas puis qu'on remonte.
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          entry.target.classList.toggle("is-visible", entry.isIntersecting);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
    );

    // Laisse le DOM de la nouvelle page se peindre avant d'observer.
    const raf = requestAnimationFrame(() => {
      root.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
        const delay = el.dataset.revealDelay;
        if (delay) el.style.setProperty("--reveal-delay", `${delay}ms`);
        io.observe(el);
      });
    });

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [pathname]);

  return null;
}
