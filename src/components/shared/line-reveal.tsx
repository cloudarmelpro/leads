"use client";

import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { useEffect, useRef, type ElementType, type ReactNode } from "react";

gsap.registerPlugin(SplitText);

type Props = {
  as?: ElementType;
  className?: string;
  children: ReactNode;
  /** Décalage (s) après l'entrée à l'écran, pour enchaîner titre puis texte. */
  delay?: number;
};

/**
 * Révélation ligne par ligne (« masked line reveal ») : SplitText découpe le texte en
 * lignes, chacune dans un masque `overflow: clip`, et chaque ligne monte depuis sous son
 * masque quand l'élément entre à l'écran. Le découpage se refait tout seul si la largeur
 * change ou quand la police arrive (`autoSplit`). Sous `prefers-reduced-motion`, rien ne
 * bouge. Le texte reste masqué jusqu'au découpage (globals.css, `[data-line-reveal]`).
 */
export function LineReveal({ as: Tag = "p", className, children, delay = 0 }: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.dataset.revealed = "";
      return;
    }

    let played = false;
    let tween: gsap.core.Tween | null = null;
    // `aria: "none"` : le texte reste lu tel quel ; un aria-label sur un <span> ou un <p>
    // ne serait pas annoncé, et les lignes seraient cachées aux lecteurs d'écran.
    const split = SplitText.create(el, {
      type: "lines",
      mask: "lines",
      linesClass: "tw-line",
      aria: "none",
      autoSplit: true,
      onSplit(self) {
        tween = gsap.from(self.lines, { yPercent: 110, duration: 1.1, ease: "expo.out", stagger: 0.09, delay, paused: !played });
        return tween;
      },
    });
    el.dataset.revealed = "";

    let raf = 0;
    const play = () => {
      // Écran de bienvenue encore affiché : on attend qu'il parte, sinon l'animation se joue dessous.
      if (document.querySelector("[data-splash]")) {
        raf = requestAnimationFrame(play);
        return;
      }
      played = true;
      tween?.play();
    };
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        io.disconnect();
        play();
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      split.revert();
    };
  }, [delay]);

  return (
    <Tag ref={ref} data-line-reveal className={className}>
      {children}
    </Tag>
  );
}
