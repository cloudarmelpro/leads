"use client";

import { useRef, type ComponentType, type ElementType, type ReactNode, type Ref } from "react";

import { gsap, reducedMotion, SplitText, useGSAP } from "@/lib/gsap";

type Props = {
  children: ReactNode;
  /** Balise rendue (h1, h2, p…). */
  as?: ElementType;
  className?: string;
  /** "lines" = titres/paragraphes ; "chars" = petits labels (eyebrow). */
  split?: "lines" | "chars";
  /** false = joue au chargement (hero) ; true = déclenché au scroll. */
  scroll?: boolean;
  delay?: number;
};

/**
 * Reveal de texte ligne par ligne « derrière un masque » (technique GSAP
 * SplitText + mask:"lines" du site the-racquet-house). Sous
 * `prefers-reduced-motion`, le texte s'affiche sans animation.
 */
export function SplitReveal({
  children,
  as = "p",
  className = "",
  split = "lines",
  scroll = true,
  delay = 0,
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      // TOUJOURS rendre le texte visible d'abord : si SplitText échoue ou tarde,
      // le texte ne reste jamais bloqué en opacity-0 (garde-fou anti-blocage).
      gsap.set(el, { autoAlpha: 1 });

      // A11y : pas d'animation si l'utilisateur réduit les animations.
      if (reducedMotion()) return;

      try {
        SplitText.create(el, {
          // "lines" → une div par ligne ; mask:"lines" ajoute le wrapper
          // overflow:clip qui cache la ligne pendant qu'elle monte.
          type: split === "chars" ? "lines,chars" : "lines",
          mask: "lines",
          autoSplit: true, // re-split propre au resize / au chargement des polices
          // "none" : SplitText poserait sinon un aria-label sur le <h1>/<p>
          // parent — attribut interdit par ARIA sur ces rôles (aria-prohibited-attr).
          aria: "none",
          onSplit(self) {
            const targets = split === "chars" ? self.chars : self.lines;
            // immediateRender place les lignes sous le masque avant la 1re peinture
            // (pas de flash de texte complet avant l'animation).
            return gsap.from(targets, {
              yPercent: 115, // la ligne part sous le masque
              duration: split === "chars" ? 0.45 : 0.75,
              ease: "osmo",
              delay,
              stagger: split === "chars" ? { each: 0.02 } : 0.07,
              scrollTrigger: scroll ? { trigger: el, start: "top 88%", once: true } : undefined,
            });
          },
        });
      } catch {
        // Le texte est déjà visible (autoAlpha:1) — on abandonne juste l'animation.
      }
    },
    { scope: ref, dependencies: [split, scroll, delay] },
  );

  const Tag = as as unknown as ComponentType<{
    ref: Ref<HTMLElement>;
    className?: string;
    children?: ReactNode;
  }>;

  return (
    <Tag ref={ref} className={`opacity-0 ${className}`}>
      {children}
    </Tag>
  );
}
