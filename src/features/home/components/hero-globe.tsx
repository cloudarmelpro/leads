"use client";

import { useRef } from "react";

import { Draggable, gsap, reducedMotion, useGSAP } from "@/lib/gsap";

/**
 * Globe du hero animé. Le POSITIONNEMENT (centrage vertical) est en CSS sur le
 * wrapper → correct dès la première peinture, aucun décalage au chargement. GSAP
 * n'anime QUE l'intérieur : les images (rotation lente + flottement + entrée en
 * scale) et un calque intermédiaire que l'on fait TOURNER à la souris (saisir et
 * glisser, inertie au relâchement) — le globe reste à sa place. Ses transforms
 * n'écrasent donc pas le centrage. Coupé sous `prefers-reduced-motion`. Opacité
 * gérée par CSS (clair/sombre préservé).
 */
export function HeroGlobe() {
  const ref = useRef<HTMLDivElement>(null);
  const spinRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (reducedMotion()) return;
      // Deux images (clair/sombre) : la même animation s'applique aux deux.
      const els = gsap.utils.toArray<HTMLElement>(".hero-globe-img");
      if (!els.length) return;

      gsap.set(els, { transformOrigin: "50% 50%" });
      gsap.from(els, { scale: 0.9, duration: 1.2, ease: "power3.out", delay: 0.15 });
      gsap.to(els, { rotation: 360, duration: 120, ease: "none", repeat: -1 });
      gsap.to(els, { y: 14, duration: 7, ease: "sine.inOut", repeat: -1, yoyo: true });

      // Rotation à la souris : Draggable en mode « rotation » sur le calque
      // intermédiaire — on saisit le globe et on le fait tourner dans le sens du geste,
      // l'inertie prolonge le mouvement au relâchement. Pointeur fin seulement ; sous
      // `lg` le globe est un fond derrière le texte et reste inerte.
      const layer = spinRef.current;
      const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
      if (!layer || !finePointer) return;

      const [drag] = Draggable.create(layer, {
        type: "rotation",
        inertia: true,
        throwResistance: 1500,
        cursor: "grab",
        activeCursor: "grabbing",
        zIndexBoost: false,
      });
      return () => drag.kill();
    },
    { scope: ref },
  );

  // Sous `lg` (mise en page burger) : fond centré derrière le texte, atténué. Le
  // contenu du hero est centré verticalement ; top-[54%] pose le globe sur ce centre,
  // un peu plus bas, car la masse visuelle de l'image est dans sa moitié haute.
  // Dès `lg`, ancré à DROITE du conteneur. Le décalage = gouttière − débordement,
  // où le débordement croît avec l'espace libre hors conteneur (0 sous 1080px,
  // plafonné à 10rem) : jamais coupé par le viewport, mais respire sur grand écran.
  return (
    <div
      ref={ref}
      className="pointer-events-none absolute top-[54%] left-1/2 w-[135%] max-w-[560px] -translate-x-1/2 -translate-y-1/2 select-none lg:top-[57%] lg:right-[calc(clamp(1rem,4vw,3.5rem)-clamp(0px,(100vw-67.5rem)/2,10rem))] lg:left-auto lg:w-[56%] lg:max-w-[680px] lg:translate-x-0"
    >
      {/* `clip-path: circle` : la zone de saisie épouse le globe, pas les coins du carré
          (sinon on attraperait le globe en cliquant la fin du titre). */}
      <div ref={spinRef} className="will-change-transform [clip-path:circle(50%)] lg:pointer-events-auto">
        {/* Clair : globe vectoriel émeraude. Sombre : masqué. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/VectorLight.svg"
          alt=""
          aria-hidden
          width={627}
          height={621}
          fetchPriority="high"
          decoding="async"
          className="hero-globe-img w-full opacity-[0.1] lg:opacity-25 dark:hidden"
        />
        {/* Sombre : globe original. Clair : masqué. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero-globe.webp"
          alt=""
          aria-hidden
          width={1254}
          height={1242}
          decoding="async"
          className="hero-globe-img hidden w-full dark:block dark:opacity-20 lg:dark:opacity-90"
        />
      </div>
    </div>
  );
}
