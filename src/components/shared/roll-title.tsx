"use client";

import { useEffect, useRef, type ElementType } from "react";

import { gsap, reducedMotion } from "@/lib/motion/gsap";

type Props = {
  as?: ElementType;
  text: string;
  className?: string;
  /** Joue la révélation tout de suite (hero) plutôt qu'à l'entrée dans l'écran. */
  immediate?: boolean;
  /** Décalage (s) avant la révélation. */
  delay?: number;
};

const EASE = "cubic-bezier(0.76,0,0.24,1)";

/**
 * Grand titre des maquettes (`data-roll-h`) : chaque lettre est dans une fenêtre haute
 * d'une ligne ; au survol, les lettres roulent vers le haut l'une après l'autre et
 * reviennent par le bas (260ms chacune). À l'arrivée, les lignes sortent d'un masque
 * comme dans `LineReveal` (mots regroupés par ligne rendue, puis chaque ligne monte de
 * 115 %). Le texte est lu tel quel par les lecteurs d'écran (`aria-label`).
 */
export function RollTitle({ as: Tag = "h2", text, className, immediate = false, delay = 0 }: Props) {
  const ref = useRef<HTMLElement>(null);
  const rolling = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.dataset.in = "";
    if (reducedMotion()) return;

    // Regroupe les mots par ligne rendue et met chaque ligne sous un masque.
    const words = Array.from(el.querySelectorAll<HTMLElement>("[data-word]"));
    const lines: HTMLElement[][] = [];
    let last: number | null = null;
    for (const w of words) {
      const top = Math.round(w.getBoundingClientRect().top);
      if (last === null || Math.abs(top - last) > 4) {
        lines.push([]);
        last = top;
      }
      lines[lines.length - 1]?.push(w);
    }
    const centered = getComputedStyle(el).textAlign === "center";
    const wraps: HTMLElement[] = [];
    el.textContent = "";
    el.style.display = "flex";
    el.style.flexDirection = "column";
    el.style.alignItems = centered ? "center" : "stretch";
    for (const line of lines) {
      const wrap = document.createElement("span");
      wrap.style.cssText = "display:block;overflow:clip;padding:0.32em 0.06em 0.1em;margin:-0.32em -0.06em -0.1em";
      const inner = document.createElement("span");
      inner.style.cssText = `display:flex;flex-wrap:nowrap;gap:0.24em;justify-content:${centered ? "center" : "flex-start"};will-change:transform`;
      for (const w of line) inner.appendChild(w);
      wrap.appendChild(inner);
      el.appendChild(wrap);
      wraps.push(inner);
    }
    const tween = gsap.fromTo(
      wraps,
      { yPercent: 115 },
      { yPercent: 0, duration: 1.3, ease: "expo.out", stagger: 0.12, delay, clearProps: "transform", scrollTrigger: immediate ? undefined : { trigger: el, start: "top 88%", once: true } },
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
    // Le découpage reconstruit le DOM : on ne le refait qu'au montage.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const roll = () => {
    const el = ref.current;
    if (!el || rolling.current || reducedMotion()) return;
    const letters = el.querySelectorAll<HTMLElement>("[data-roll]");
    const n = letters.length;
    const step = n > 12 ? Math.max(18, 700 / n) : 70;
    const dur = 260;
    rolling.current = true;
    letters.forEach((letter, i) => {
      window.setTimeout(() => {
        letter.style.transition = `transform ${dur}ms ${EASE}`;
        letter.style.transform = "translateY(-100%)";
      }, i * step);
      window.setTimeout(() => {
        letter.style.transition = "none";
        letter.style.transform = "translateY(0)";
      }, i * step + dur + 20);
    });
    window.setTimeout(() => {
      rolling.current = false;
    }, (n - 1) * step + dur + 40);
  };

  return (
    <Tag ref={ref} aria-label={text} data-reveal="up" onPointerEnter={roll} className={`cursor-default ${className ?? ""}`}>
      {text.split(" ").map((word, wi) => (
        <span key={wi} data-word aria-hidden className="inline-block whitespace-nowrap">
          {Array.from(word).map((ch, ci) => (
            <span key={ci} className="relative inline-block h-[1.1em] overflow-clip px-[0.01em] align-top leading-[1.1em]">
              <span data-roll className="block h-[1.1em] will-change-transform">
                {ch}
                <span aria-hidden className="absolute inset-x-[0px] top-full block">
                  {ch}
                </span>
              </span>
            </span>
          ))}
        </span>
      ))}
    </Tag>
  );
}
