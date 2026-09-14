// Points pulsés de la maquette (repère 230×151 de `world-dots.svg`) : 22 villes,
// délais échelonnés, puis le nœud de Québec (halo plus lent, plus large).
const PINGS: [number, number, string][] = [
  [68, 75.34, "1.80s"],
  [67.5, 79.67, "2.63s"],
  [64, 77.08, "3.46s"],
  [59, 78.81, "4.29s"],
  [64, 90.93, "5.12s"],
  [42, 70.15, "5.95s"],
  [51.5, 95.26, "6.78s"],
  [39.5, 84.87, "2.61s"],
  [36, 71.88, "3.44s"],
  [110.5, 84.87, "4.27s"],
  [112.5, 79.67, "5.10s"],
  [114.5, 69.28, "5.93s"],
  [117, 71.88, "6.76s"],
  [118, 70.15, "2.59s"],
  [85.5, 122.98, "3.42s"],
  [124, 68.42, "4.25s"],
  [150, 90.93, "5.08s"],
  [145, 120.38, "5.91s"],
  [161.5, 95.26, "6.74s"],
  [181, 106.52, "2.57s"],
  [204.5, 83.14, "3.40s"],
  [212, 130.77, "4.23s"],
];

const HUB: [number, number] = [70, 73.61];

/** Calque SVG des points pulsés, superposé à la carte en points (même repère). */
export function WorldPings() {
  return (
    <svg
      viewBox="0 0 230 151"
      preserveAspectRatio="xMaxYMid meet"
      aria-hidden
      className="absolute inset-0 h-full w-full overflow-visible"
    >
      {PINGS.map(([cx, cy, delay]) => (
        <g key={`${cx}-${cy}`}>
          <circle
            cx={cx}
            cy={cy}
            r="1.6"
            className="fill-vert opacity-0 motion-safe:[animation:tw-ping_1.7s_ease-out_infinite]"
            style={{ animationDelay: delay }}
          />
          <circle cx={cx} cy={cy} r="0.85" className="fill-vert" />
        </g>
      ))}
      <circle
        cx={HUB[0]}
        cy={HUB[1]}
        r="3.2"
        className="fill-vert opacity-0 motion-safe:[animation:tw-hub_2.8s_ease-out_1.2s_infinite]"
      />
      <circle cx={HUB[0]} cy={HUB[1]} r="2" className="fill-fond" />
      <circle cx={HUB[0]} cy={HUB[1]} r="1.4" className="fill-vert" />
    </svg>
  );
}
