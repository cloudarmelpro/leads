"use client";

import { useRef } from "react";

import { gsap, reducedMotion, useGSAP } from "@/lib/gsap";

import nodesData from "./world-nodes.json";

type NodeKey = keyof typeof nodesData.nodes;

const { width: W, height: H, nodes } = nodesData;
const HUB: NodeKey = "quebec";
// Ordre = ordre d'apparition des liaisons : les longues d'abord, pour que ça bouge vite.
const SPOKES: NodeKey[] = ["paris", "vancouver", "newyork", "toronto", "montreal"];
const hub = nodes[HUB];

const R = { spokeHalo: 1.75, spokeDot: 0.95, hubHalo: 3.2, hubRing: 2, hubDot: 1.4, packet: 0.8, glow: 2 };

// Arc quadratique du hub vers un nœud, bombé vers le haut (plus long = plus haut).
function arcPath([x1, y1]: number[], [x2, y2]: number[]) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lift = Math.min(19, Math.hypot(dx, dy) * 0.35);
  const cx = (x1 + x2) / 2;
  const cy = Math.min(y1, y2) - lift;
  return `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
}

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
 * recolorés par le thème, nœud principal au Québec, arcs vers quelques villes.
 * Animation GSAP : entrée (points, puis nœuds) calée sur celle du titre du hero,
 * puis boucle — chaque arc se trace avec un « paquet » lumineux qui voyage du hub
 * vers la ville et la fait pulser à l'arrivée. Statique sous `prefers-reduced-motion`.
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
      const arcs = gsap.utils.toArray<SVGPathElement>("[data-arc]", root);
      const packets = gsap.utils.toArray<SVGGElement>("[data-packet]", root);
      const spokeHalos = gsap.utils.toArray<SVGCircleElement>("[data-halo='spoke']", root);
      const hubHalo = root.querySelector<SVGCircleElement>("[data-halo='hub']");

      // Garde-fou : la carte ne reste jamais invisible, animation ou pas.
      if (reducedMotion()) {
        gsap.set([dots, nodeDots], { autoAlpha: 1 });
        gsap.set(arcs, { opacity: 0.55 });
        return;
      }

      // État initial explicite (tout caché) : les tweens différés ci-dessous ont
      // `immediateRender: false`, sinon leur état « from » s'afficherait dès le départ.
      gsap.set(dots, { autoAlpha: 0, y: 14 });
      gsap.set(nodeDots, { autoAlpha: 0, attr: { r: 0 } });
      gsap.set([spokeHalos, hubHalo, packets], { opacity: 0 });

      // 1. Entrée : les points de terre montent en fondu, puis les nœuds éclosent.
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .to(dots, { autoAlpha: 1, y: 0, duration: 1.4 }, 0.15)
        .to(
          nodeDots,
          {
            autoAlpha: 1,
            attr: { r: (_i: number, el: SVGCircleElement) => Number(el.dataset.r) },
            duration: 0.7,
            ease: "back.out(2.4)",
            stagger: 0.09,
          },
          0.75,
        );

      // 2. Respiration continue du hub (Québec).
      if (hubHalo) {
        gsap.fromTo(
          hubHalo,
          { attr: { r: R.hubHalo }, opacity: 0.5 },
          { attr: { r: R.hubHalo * 2.4 }, opacity: 0, duration: 2.8, ease: "sine.out", repeat: -1, delay: 1.2, immediateRender: false },
        );
      }

      // 3. Boucle des liaisons : le trait se dessine pendant qu'un paquet file du hub
      //    à la ville ; à l'arrivée, le halo de la ville pulse ; le trait reste puis s'efface.
      arcs.forEach((arc, index) => {
        const length = arc.getTotalLength();
        const packet = packets[index];
        const halo = spokeHalos[index];
        const progress = { t: 0 };
        const place = () => {
          const point = arc.getPointAtLength(progress.t * length);
          gsap.set(packet, { x: point.x - hub[0], y: point.y - hub[1] });
        };

        gsap.set(arc, { strokeDasharray: length, strokeDashoffset: length, opacity: 1 });
        place();

        gsap
          .timeline({ repeat: -1, delay: 1.5 + index * 0.95, repeatDelay: 2 })
          .set(packet, { opacity: 1 })
          .to(arc, { strokeDashoffset: 0, duration: 1.8, ease: "power2.inOut" }, 0)
          .to(progress, { t: 1, duration: 1.8, ease: "power2.inOut", onUpdate: place }, 0)
          .to(packet, { opacity: 0, duration: 0.3 }, 1.7)
          .fromTo(
            halo,
            { attr: { r: R.spokeHalo }, opacity: 0.7 },
            { attr: { r: R.spokeHalo * 3 }, opacity: 0, duration: 1, ease: "sine.out", immediateRender: false },
            1.75,
          )
          .to(arc, { opacity: 0, duration: 0.9, ease: "power1.in" }, 3.1)
          .set(arc, { strokeDashoffset: length, opacity: 1 })
          .set(progress, { t: 0, onComplete: place });
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

      {/* Nœuds et arcs, dans les mêmes unités de grille que les points. */}
      <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full overflow-visible">
        {SPOKES.map((key) => (
          <g key={key}>
            <path
              data-arc
              d={arcPath(hub, nodes[key])}
              fill="none"
              strokeWidth={0.5}
              strokeLinecap="round"
              className="stroke-emeraude dark:stroke-accent-strong"
            />
            {/* Paquet : point vif + lueur, déplacés ensemble le long de l'arc (transform). */}
            <g data-packet opacity={0}>
              <circle cx={hub[0]} cy={hub[1]} r={R.glow} className="fill-emeraude/35 dark:fill-accent-strong/35" />
              <circle cx={hub[0]} cy={hub[1]} r={R.packet} className="fill-emeraude dark:fill-accent-strong" />
            </g>
          </g>
        ))}

        {SPOKES.map((key) => {
          const [x, y] = nodes[key];
          return (
            <g key={key}>
              <circle data-halo="spoke" cx={x} cy={y} r={R.spokeHalo} opacity={0} className="fill-emeraude dark:fill-accent-strong" />
              <circle data-node-dot data-r={R.spokeDot} cx={x} cy={y} r={R.spokeDot} className="fill-emeraude opacity-0 dark:fill-accent-strong" />
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
