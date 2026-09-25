"use client";

import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react";

import { gsap, reducedMotion } from "@/lib/motion/gsap";

type Kind = "fade" | "up" | "left" | "scale";
type Props = {
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
  /** `fade` : monte de 36px ; `up` : sort d'un masque ; `left` : arrive de la gauche ; `scale` : grandit. */
  kind?: Kind;
  /** Décalage en ms, pour échelonner plusieurs éléments d'un même bloc. */
  delay?: number;
  /** Joue tout de suite (hero) au lieu d'attendre l'entrée à l'écran. */
  immediate?: boolean;
  /** Bloc purement décoratif, ignoré des lecteurs d'écran. */
  ariaHidden?: boolean;
};

const FROM: Record<Kind, gsap.TweenVars> = {
  fade: { y: 36, opacity: 0 },
  up: { yPercent: 110 },
  left: { x: -60, opacity: 0 },
  scale: { y: 50, scale: 0.94, opacity: 0 },
};
const TO: Record<Kind, gsap.TweenVars> = {
  fade: { y: 0, opacity: 1 },
  up: { yPercent: 0 },
  left: { x: 0, opacity: 1 },
  scale: { y: 0, scale: 1, opacity: 1 },
};

/**
 * Apparition d'un bloc (maquettes Claude Design, `data-reveal`) : une seule fois, quand
 * son haut passe 88 % de l'écran — ou tout de suite avec `immediate`. Masqué avant
 * l'hydratation (globals.css, `[data-reveal]`) pour ne pas clignoter ; rien sous
 * `prefers-reduced-motion`.
 */
export function Reveal({ as: Tag = "div", className, style, children, kind = "fade", delay = 0, immediate = false, ariaHidden }: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.dataset.in = "";
    if (reducedMotion()) return;
    const tween = gsap.fromTo(el, FROM[kind], {
      ...TO[kind],
      duration: kind === "up" ? 1.2 : 1.1,
      delay: delay / 1000,
      ease: kind === "up" ? "expo.out" : "power3.out",
      clearProps: "transform,opacity",
      scrollTrigger: immediate ? undefined : { trigger: el, start: "top 88%", once: true },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [kind, delay, immediate]);

  return (
    <Tag ref={ref} data-reveal={kind} aria-hidden={ariaHidden || undefined} className={className} style={style}>
      {children}
    </Tag>
  );
}
