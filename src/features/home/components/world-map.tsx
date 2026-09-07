"use client";

import { useRef } from "react";

import { gsap, reducedMotion, useGSAP } from "@/lib/gsap";

import nodesData from "./world-nodes.json";

type NodeKey = keyof typeof nodesData.nodes;

const { width: W, height: H, nodes } = nodesData;
const HUB: NodeKey = "quebec";
const SPOKES: NodeKey[] = ["montreal", "toronto", "newyork", "vancouver", "paris"];

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
 * recolorés par le thème, nœud principal au Québec avec halo pulsant, arcs fins
 * vers quelques villes qui se tracent en boucle (GSAP). Statique sous
 * `prefers-reduced-motion`. Décorative : `aria-hidden`.
 */
export function WorldMap({ className = "" }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      const svg = ref.current;
      if (!svg || reducedMotion()) return;

      const arcs = gsap.utils.toArray<SVGPathElement>("[data-arc]", svg);
      const halos = gsap.utils.toArray<SVGCircleElement>("[data-halo]", svg);

      // Halos : respiration lente, décalée par nœud.
      halos.forEach((halo, index) => {
        gsap.fromTo(
          halo,
          { attr: { r: Number(halo.dataset.r) }, opacity: 0.55 },
          { attr: { r: Number(halo.dataset.r) * 2.2 }, opacity: 0, duration: 2.6, ease: "sine.out", repeat: -1, delay: index * 0.45 },
        );
      });

      // Arcs : chaque trait se dessine du hub vers la ville, reste, puis s'efface ;
      // les cinq sont décalés pour qu'il y ait toujours du mouvement.
      arcs.forEach((arc, index) => {
        const length = arc.getTotalLength();
        gsap.set(arc, { strokeDasharray: length, strokeDashoffset: length, opacity: 1 });
        gsap
          .timeline({ repeat: -1, delay: index * 1.1, repeatDelay: 2.2 })
          .to(arc, { strokeDashoffset: 0, duration: 1.8, ease: "power2.inOut" })
          .to(arc, { opacity: 0, duration: 0.9, ease: "power1.in" }, "+=1.4")
          .set(arc, { strokeDashoffset: length, opacity: 1 });
      });
    },
    { scope: ref },
  );

  const hub = nodes[HUB];

  return (
    <div className={`relative ${className}`} style={{ aspectRatio: `${W} / ${H}` }} aria-hidden>
      {/* Points de terre : couleur = fond courant via le masque. */}
      <div className="absolute inset-0 bg-emeraude/60 dark:bg-[#bfd0d6]/32" style={dotsMask} />

      {/* Nœuds et arcs, dans les mêmes unités de grille que les points. */}
      <svg ref={ref} viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full overflow-visible">
        {SPOKES.map((key) => (
          <path
            key={key}
            data-arc
            d={arcPath(hub, nodes[key])}
            fill="none"
            strokeWidth={0.42}
            strokeLinecap="round"
            className="stroke-emeraude dark:stroke-accent-strong"
          />
        ))}

        {SPOKES.map((key) => {
          const [x, y] = nodes[key];
          return (
            <g key={key}>
              <circle data-halo data-r={1.75} cx={x} cy={y} r={1.75} className="fill-emeraude/40 dark:fill-accent-strong/40" />
              <circle cx={x} cy={y} r={0.95} className="fill-emeraude dark:fill-accent-strong" />
            </g>
          );
        })}

        <circle data-halo data-r={3.2} cx={hub[0]} cy={hub[1]} r={3.2} className="fill-emeraude/45 dark:fill-accent-strong/45" />
        <circle cx={hub[0]} cy={hub[1]} r={2} className="fill-fond" />
        <circle cx={hub[0]} cy={hub[1]} r={1.4} className="fill-emeraude dark:fill-accent-strong" />
      </svg>
    </div>
  );
}
