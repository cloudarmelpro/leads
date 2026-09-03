"use client";

import { useRef } from "react";

import { gsap, reducedMotion, useGSAP } from "@/lib/gsap";

/**
 * Globe du hero animé. Le POSITIONNEMENT (centrage vertical) est en CSS sur le
 * wrapper → correct dès la première peinture, aucun décalage au chargement. GSAP
 * n'anime QUE l'intérieur : les images (balancement lent + flottement + entrée en
 * scale) et un calque intermédiaire qui S'INCLINE en 3D vers le curseur quand on
 * survole le globe (haut → bascule vers le haut, gauche → tourne vers la gauche),
 * amorti, sans quitter sa place. Ses transforms n'écrasent donc pas le centrage. Coupé sous
 * `prefers-reduced-motion`. Opacité gérée par CSS (clair/sombre préservé).
 */
export function HeroGlobe() {
  const ref = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (reducedMotion()) return;
      // Deux images (clair/sombre) : la même animation s'applique aux deux.
      const els = gsap.utils.toArray<HTMLElement>(".hero-globe-img");
      if (!els.length) return;

      gsap.set(els, { transformOrigin: "50% 50%" });
      gsap.from(els, { scale: 0.9, duration: 1.2, ease: "power3.out", delay: 0.15 });
      // Pas de tour complet : la masse de points de l'image est dans sa moitié haute,
      // un tour la ferait passer en bas et le globe semblerait « tombé ». Simple
      // balancement lent de ±6° autour de la position d'origine.
      gsap.fromTo(els, { rotation: -6 }, { rotation: 6, duration: 18, ease: "sine.inOut", repeat: -1, yoyo: true });
      gsap.to(els, { y: 14, duration: 7, ease: "sine.inOut", repeat: -1, yoyo: true });

      // Inclinaison 3D vers le curseur, écoutée sur le DISQUE du globe seulement
      // (zone circulaire, voir `clip-path` plus bas) : le pointeur en haut fait
      // basculer le globe vers le haut (rotateX), à gauche le tourne vers la gauche
      // (rotateY), jusqu'à ±TILT degrés, avec un amorti long. Retour à plat quand le
      // pointeur quitte le disque. Pointeur fin seulement.
      const layer = tiltRef.current;
      const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
      if (!layer || !finePointer) return;

      const TILT = 22;
      gsap.set(layer, { transformPerspective: 900, transformOrigin: "50% 50%" });
      const glide = { duration: 1, ease: "power3.out" };
      const toRotX = gsap.quickTo(layer, "rotationX", glide);
      const toRotY = gsap.quickTo(layer, "rotationY", glide);

      const onMove = (event: PointerEvent) => {
        const rect = layer.getBoundingClientRect();
        // Position du pointeur par rapport au CENTRE DU GLOBE (−1 … 1), bornée.
        const nx = gsap.utils.clamp(-1, 1, ((event.clientX - rect.left) / rect.width) * 2 - 1);
        const ny = gsap.utils.clamp(-1, 1, ((event.clientY - rect.top) / rect.height) * 2 - 1);
        toRotY(nx * TILT); // curseur à droite → la face droite s'éloigne
        toRotX(-ny * TILT); // curseur en haut → le haut du globe bascule vers l'arrière
      };
      const onLeave = () => {
        toRotX(0);
        toRotY(0);
      };
      layer.addEventListener("pointermove", onMove);
      layer.addEventListener("pointerleave", onLeave);
      return () => {
        layer.removeEventListener("pointermove", onMove);
        layer.removeEventListener("pointerleave", onLeave);
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
            {/* Survol : curseur « main » sur le disque du globe seulement (`clip-path`
          circulaire), les coins du carré restent transparents pour le titre. */}
      <div
        ref={tiltRef}
        className="will-change-transform [clip-path:circle(50%)] lg:pointer-events-auto lg:cursor-pointer"
      >
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
