"use client";

import { useRef } from "react";

import { gsap, reducedMotion, useGSAP } from "@/lib/gsap";

/**
 * Globe du hero animé. Le POSITIONNEMENT (centrage vertical) est en CSS sur le
 * wrapper → correct dès la première peinture, aucun décalage au chargement. GSAP
 * n'anime QUE l'intérieur : les images (rotation lente + flottement + entrée en
 * scale) et un calque intermédiaire qui suit le curseur sur le hero (parallaxe
 * amortie, pointeur fin seulement). Ses transforms n'écrasent donc pas le centrage.
 * Coupé sous `prefers-reduced-motion`. Opacité gérée par CSS (clair/sombre préservé).
 */
export function HeroGlobe() {
  const ref = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);

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

      // Parallaxe au curseur : le globe glisse vers le pointeur (±32px) avec un
      // amorti long ; retour au centre quand le pointeur quitte le hero. Écouté sur
      // la <section> du hero (le globe lui-même est `pointer-events-none`).
      const layer = parallaxRef.current;
      const hero = ref.current?.closest("section");
      const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
      if (!layer || !hero || !finePointer) return;

      const AMPLITUDE = 32;
      const glide = { duration: 1.1, ease: "power3.out" };
      const toX = gsap.quickTo(layer, "x", glide);
      const toY = gsap.quickTo(layer, "y", glide);

      const onMove = (event: PointerEvent) => {
        const rect = hero.getBoundingClientRect();
        const nx = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        const ny = ((event.clientY - rect.top) / rect.height) * 2 - 1;
        toX(nx * AMPLITUDE);
        toY(ny * AMPLITUDE);
      };
      const onLeave = () => {
        toX(0);
        toY(0);
      };
      hero.addEventListener("pointermove", onMove);
      hero.addEventListener("pointerleave", onLeave);
      return () => {
        hero.removeEventListener("pointermove", onMove);
        hero.removeEventListener("pointerleave", onLeave);
      };
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
      <div ref={parallaxRef} className="will-change-transform">
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
