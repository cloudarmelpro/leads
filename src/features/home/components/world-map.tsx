"use client";

import { useRef } from "react";

import { gsap, reducedMotion, useGSAP } from "@/lib/gsap";

import nodesData from "./world-nodes.json";

type NodeKey = keyof typeof nodesData.nodes;

const { width: W, height: H, nodes } = nodesData;
const HUB: NodeKey = "quebec";
const hub = nodes[HUB];
// Villes triées par distance au hub : l'entrée « fleurit » depuis le Québec.
const CITIES = (Object.keys(nodes) as NodeKey[])
  .filter((key) => key !== HUB)
  .sort((a, b) => Math.hypot(nodes[a][0] - hub[0], nodes[a][1] - hub[1]) - Math.hypot(nodes[b][0] - hub[0], nodes[b][1] - hub[1]));

const R = { cityHalo: 1.6, cityDot: 0.85, hubHalo: 3.2, hubRing: 2, hubDot: 1.4 };

// Le masque CSS recolore le SVG monochrome des points selon le thème.
const dotsMask = {
  maskImage: "url(/world-dots.svg)",
  WebkitMaskImage: "url(/world-dots.svg)",
  maskSize: "100% 100%",
  WebkitMaskSize: "100% 100%",
  maskRepeat: "no-repeat",
  WebkitMaskRepeat: "no-repeat",
} as const;

/**
 * Carte du monde en points (direction « infrastructure ») : points de terre
 * recolorés par le thème, nœud principal au Québec et villes-repères sur les
 * cinq continents. Animation GSAP : entrée (points, puis villes depuis le Québec),
 * puis chaque ville émet un « ping » (halo qui s'élargit et s'éteint) à son propre
 * rythme ; le hub respire en continu. Statique sous `prefers-reduced-motion`.
 * Décorative : `aria-hidden`.
 */
export function WorldMap({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;

      const dots = root.querySelector<HTMLElement>("[data-dots]");
      const nodeDots = gsap.utils.toArray<SVGCircleElement>("[data-node-dot]", root);
      const cityHalos = gsap.utils.toArray<SVGCircleElement>("[data-halo='city']", root);
      const hubHalo = root.querySelector<SVGCircleElement>("[data-halo='hub']");

      // Garde-fou : la carte ne reste jamais invisible, animation ou pas.
      if (reducedMotion()) {
        gsap.set([dots, nodeDots], { autoAlpha: 1 });
        return;
      }

      // État initial explicite (tout caché) : les tweens différés ci-dessous ont
      // `immediateRender: false`, sinon leur état « from » s'afficherait dès le départ.
      gsap.set(dots, { autoAlpha: 0, y: 14 });
      gsap.set(nodeDots, { autoAlpha: 0, attr: { r: 0 } });
      gsap.set([cityHalos, hubHalo], { opacity: 0 });

      // 1. Entrée : les points de terre montent en fondu, puis les villes éclosent
      //    dans l'ordre du DOM (= de la plus proche à la plus lointaine du Québec).
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .to(dots, { autoAlpha: 1, y: 0, duration: 1.4 }, 0.15)
        .to(
          nodeDots,
          {
            autoAlpha: 1,
            attr: { r: (_i: number, el: SVGCircleElement) => Number(el.dataset.r) },
            duration: 0.6,
            ease: "back.out(2.4)",
            stagger: 0.06,
          },
          0.7,
        );

      // 2. Respiration continue du hub (Québec).
      if (hubHalo) {
        gsap.fromTo(
          hubHalo,
          { attr: { r: R.hubHalo }, opacity: 0.5 },
          { attr: { r: R.hubHalo * 2.4 }, opacity: 0, duration: 2.8, ease: "sine.out", repeat: -1, delay: 1.2, immediateRender: false },
        );
      }

      // 3. Pings des villes : chacune à son rythme (délai et pause aléatoires), pour une
      //    activité continue mais jamais synchrone.
      cityHalos.forEach((halo) => {
        gsap.fromTo(
          halo,
          { attr: { r: R.cityHalo }, opacity: 0.65 },
          {
            attr: { r: R.cityHalo * 3.2 },
            opacity: 0,
            duration: 1.7,
            ease: "sine.out",
            repeat: -1,
            delay: 1.8 + gsap.utils.random(0, 4),
            repeatDelay: gsap.utils.random(2, 6),
            immediateRender: false,
          },
        );
      });

      // 4. Léger flottement de l'ensemble : la carte « respire » sans jamais distraire.
      gsap.to(root, { y: -6, duration: 5.5, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 1.5 });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={`relative ${className}`} style={{ aspectRatio: `${W} / ${H}` }} aria-hidden>
      {/* Points de terre : couleur = fond courant via le masque. */}
      <div data-dots className="absolute inset-0 bg-emeraude/60 opacity-0 dark:bg-[#bfd0d6]/32" style={dotsMask} />

      {/* Villes et hub, dans les mêmes unités de grille que les points. */}
      <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full overflow-visible">
        {CITIES.map((key) => {
          const [x, y] = nodes[key];
          return (
            <g key={key}>
              <circle data-halo="city" cx={x} cy={y} r={R.cityHalo} opacity={0} className="fill-emeraude dark:fill-accent-strong" />
              <circle data-node-dot data-r={R.cityDot} cx={x} cy={y} r={R.cityDot} className="fill-emeraude opacity-0 dark:fill-accent-strong" />
            </g>
          );
        })}

        <circle data-halo="hub" cx={hub[0]} cy={hub[1]} r={R.hubHalo} opacity={0} className="fill-emeraude dark:fill-accent-strong" />
        <circle data-node-dot data-r={R.hubRing} cx={hub[0]} cy={hub[1]} r={R.hubRing} className="fill-fond opacity-0" />
        <circle data-node-dot data-r={R.hubDot} cx={hub[0]} cy={hub[1]} r={R.hubDot} className="fill-emeraude opacity-0 dark:fill-accent-strong" />
      </svg>
    </div>
  );
}
