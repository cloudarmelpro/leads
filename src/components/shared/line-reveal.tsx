"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

import { gsap, SplitText } from "@/lib/motion/gsap";

type Props = {
  as?: ElementType;
  className?: string;
  children: ReactNode;
  /** Décalage (s) après l'entrée à l'écran, pour enchaîner titre puis texte. */
  delay?: number;
  /** Au survol, chaque lettre roule vers le haut, remplacée par son double qui monte du bas. */
  rollOnHover?: boolean;
};

// Roulement au survol (maquette À propos, `rollIn`) : 70 ms entre les lettres (resserré
// au-delà de 12 lettres), 260 ms par lettre, la lettre sort 0,3em plus haut que sa hauteur.
const ROLL_OFF = "0.3em";
const ROLL_DUR = 0.26;

function rollLetters(el: HTMLElement, lines: SplitText, done: () => void) {
  // Le découpage en lignes (révélation déjà jouée) est défait d'abord : un second
  // découpage sur le même élément le défait de toute façon, autant le faire proprement.
  // Chaque lettre a son masque, élargi de 0,14em comme celui des lignes (accent du À), un
  // double posé sous elle ; tout remonte d'un cran, puis le découpage est défait.
  if (lines.isSplit) lines.revert();
  const chars = SplitText.create(el, { type: "chars", mask: "chars", aria: "none" });
  for (const c of chars.chars) {
    const mask = c.parentElement;
    if (mask) mask.style.cssText += ";padding-block:0.14em;margin-block:-0.14em";
    const twin = document.createElement("span");
    twin.setAttribute("aria-hidden", "true");
    twin.textContent = c.textContent;
    twin.style.cssText = `position:absolute;left:0;right:0;top:calc(100% + ${ROLL_OFF});display:block`;
    c.appendChild(twin);
  }
  const n = chars.chars.length;
  const step = n > 12 ? Math.max(0.018, 0.7 / n) : 0.07;
  gsap.to(chars.chars, {
    yPercent: -100,
    y: `-${ROLL_OFF}`,
    duration: ROLL_DUR,
    ease: "power3.inOut",
    stagger: step,
    onComplete: () => {
      chars.revert();
      done();
    },
  });
}

/**
 * Révélation ligne par ligne (« masked line reveal ») : SplitText découpe le texte en
 * lignes, chacune dans un masque `overflow: clip`, et chaque ligne monte depuis sous son
 * masque quand l'élément entre à l'écran. Le découpage se refait tout seul si la largeur
 * change ou quand la police arrive (`autoSplit`). Sous `prefers-reduced-motion`, rien ne
 * bouge. Le texte reste masqué jusqu'au découpage (globals.css, `[data-line-reveal]`).
 */
export function LineReveal({ as: Tag = "p", className, children, delay = 0, rollOnHover = false }: Props) {
  const ref = useRef<HTMLElement>(null);
  const rolling = useRef(false);

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

    // Le roulement attend la fin de la révélation, sinon les deux animations se disputent
    // les mêmes lignes.
    const onEnter = () => {
      if (!rollOnHover || rolling.current || !played || tween?.isActive()) return;
      rolling.current = true;
      rollLetters(el, split, () => {
        rolling.current = false;
      });
    };
    el.addEventListener("pointerenter", onEnter);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      el.removeEventListener("pointerenter", onEnter);
      split.revert();
    };
  }, [delay, rollOnHover]);

  return (
    <Tag ref={ref} data-line-reveal className={className}>
      {children}
    </Tag>
  );
}
