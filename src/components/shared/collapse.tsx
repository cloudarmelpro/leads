"use client";

import { useRef, type ComponentPropsWithoutRef, type ReactNode } from "react";

import { gsap, reducedMotion, useGSAP } from "@/lib/gsap";

// Ouverture, fermeture et flèche partagent durée et courbe : quand un panneau se
// ferme pendant qu'un autre s'ouvre, la hauteur totale évolue sans à-coup.
const DURATION = 0.45;
const EASE = "power2.inOut";
// Glissement du contenu pendant le dépliage : la carte descend en place au lieu
// d'apparaître coupée net par le bas du conteneur `overflow-hidden`.
const SLIDE = -12;

type CollapseProps = Omit<ComponentPropsWithoutRef<"div">, "children"> & {
  open: boolean;
  children: ReactNode;
};

/**
 * Panneau dépliable (accordéons FAQ / Méthode) animé en hauteur + fondu par GSAP.
 * Les transitions CSS sont coupées globalement (globals.css) ; GSAP écrit des
 * styles inline et n'est pas concerné. Le contenu reste monté : `inert` +
 * `aria-hidden` le retirent du focus et des lecteurs d'écran quand fermé.
 */
export function Collapse({ open, children, className = "", ...rest }: CollapseProps) {
  const ref = useRef<HTMLDivElement>(null);
  const mounted = useRef(false);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const instant = !mounted.current || reducedMotion();
      mounted.current = true;

      const inner = el.firstElementChild;
      const to = { height: open ? "auto" : 0, autoAlpha: open ? 1 : 0 };
      const slide = { y: open ? 0 : SLIDE };
      if (instant) {
        gsap.set(el, to);
        if (inner) gsap.set(inner, slide);
        return;
      }
      gsap.to(el, { ...to, duration: DURATION, ease: EASE, overwrite: true });
      if (inner) gsap.to(inner, { ...slide, duration: DURATION, ease: EASE, overwrite: true });
    },
    { scope: ref, dependencies: [open] },
  );

  // Les classes `data-[open=false]:*` couvrent le HTML serveur (fermé sans flash) ;
  // dès la première animation, les styles inline de GSAP prennent le dessus.
  return (
    <div
      ref={ref}
      data-open={open}
      inert={!open}
      aria-hidden={!open}
      className={`overflow-hidden data-[open=false]:invisible data-[open=false]:h-0 data-[open=false]:opacity-0 ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}

type RotateProps = {
  /** Angle cible en degrés. */
  deg: number;
  className?: string;
  children: ReactNode;
};

/**
 * Pivote son contenu (flèche d'accordéon) de l'angle précédent vers `deg`.
 * React pose l'angle final en inline (HTML serveur correct) ; GSAP repart de
 * l'angle précédent avant la peinture, d'où une rotation fluide sans flash.
 */
export function Rotate({ deg, className = "", children }: RotateProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const previous = useRef(deg);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const from = previous.current;
      previous.current = deg;
      if (from === deg || reducedMotion()) return;
      gsap.fromTo(el, { rotation: from }, { rotation: deg, duration: DURATION, ease: EASE, overwrite: true });
    },
    { scope: ref, dependencies: [deg] },
  );

  return (
    <span ref={ref} className={`inline-flex ${className}`} style={{ transform: `rotate(${deg}deg)` }}>
      {children}
    </span>
  );
}
