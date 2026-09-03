"use client";

import { useRef, type ComponentType, type ElementType, type ReactNode, type Ref } from "react";

import { gsap, reducedMotion, useGSAP } from "@/lib/gsap";

type Props = {
  children: ReactNode;
  /** Balise rendue (div par défaut). */
  as?: ElementType;
  className?: string;
  /** Distance de translation verticale (px). */
  y?: number;
  delay?: number;
  /** Décalage entre les enfants directs (grille de cartes, boutons…). */
  stagger?: number;
  /** false = joue au chargement ; true = déclenché au scroll. */
  scroll?: boolean;
};

/**
 * Reveal de blocs (cartes, boutons) : les enfants directs montent + apparaissent
 * en fondu, avec stagger. Même ease « osmo » que `SplitReveal`. Sous
 * `prefers-reduced-motion`, tout est affiché sans animation.
 */
export function Reveal({
  children,
  as = "div",
  className = "",
  y = 18,
  delay = 0,
  stagger = 0.08,
  scroll = true,
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const targets = el.children;
      if (!targets.length) return;

      if (reducedMotion()) {
        gsap.set(targets, { autoAlpha: 1, y: 0 });
        return;
      }

      gsap.from(targets, {
        y,
        autoAlpha: 0,
        duration: 0.65,
        ease: "osmo",
        delay,
        stagger,
        scrollTrigger: scroll ? { trigger: el, start: "top 85%", once: true } : undefined,
      });
    },
    { scope: ref, dependencies: [y, delay, stagger, scroll] },
  );

  const Tag = as as unknown as ComponentType<{
    ref: Ref<HTMLElement>;
    className?: string;
    children?: ReactNode;
  }>;

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
