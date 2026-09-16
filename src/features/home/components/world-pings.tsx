// Villes de la maquette (repère 230×151 de `world-dots.svg`), puis le nœud de Québec.
// Points fixes : les halos pulsés ont été retirés avec le reste des animations (2026-09-16).
const PINGS: [number, number][] = [
  [68, 75.34], [67.5, 79.67], [64, 77.08], [59, 78.81], [64, 90.93], [42, 70.15], [51.5, 95.26],
  [39.5, 84.87], [36, 71.88], [110.5, 84.87], [112.5, 79.67], [114.5, 69.28], [117, 71.88],
  [118, 70.15], [85.5, 122.98], [124, 68.42], [150, 90.93], [145, 120.38], [161.5, 95.26],
  [181, 106.52], [204.5, 83.14], [212, 130.77],
];

const HUB: [number, number] = [70, 73.61];

/** Calque SVG des points de villes, superposé à la carte en points (même repère). */
export function WorldPings() {
  return (
    <svg
      viewBox="0 0 230 151"
      preserveAspectRatio="xMaxYMid meet"
      aria-hidden
      className="absolute inset-0 h-full w-full overflow-visible"
    >
      {PINGS.map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="0.85" className="fill-vert" />
      ))}
      <circle cx={HUB[0]} cy={HUB[1]} r="2" className="fill-fond" />
      <circle cx={HUB[0]} cy={HUB[1]} r="1.4" className="fill-vert" />
    </svg>
  );
}
