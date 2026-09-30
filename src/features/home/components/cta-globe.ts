/**
 * Globe de la section d'appel (port de `CtaGlobe.tsx` fourni par le client, 2026-09-30) :
 * sphère en fil de fer dessinée dans un canvas 2D (projection orthographique), pays et
 * frontières (Natural Earth via `world-atlas`, domaine public, chargés à part), pings
 * sur les terres dont certains envoient un arc vers le point vert au-dessus du titre,
 * faisceau qui suit le curseur, lampe à la souris, parallaxe. Survol du bouton : rafale
 * d'arcs ; clic : onde sur le globe. Entrée jouée une fois quand la section est visible.
 * Boucle arrêtée hors écran ; sous `prefers-reduced-motion`, image fixe.
 *
 * Repères lus dans la carte : `[data-cg-content]` (bloc texte), `[data-cg-title]`
 * (enveloppe du titre, sa taille de police règle le point), `[data-cg-anchor]` (le point),
 * `[data-cg-btn]` (bouton), `[data-cg-reveal="0..3"]` (éléments révélés en cascade).
 * Tous les réglages sont dans `C`.
 */

export type GlobeHemisphere = "south" | "north";

// Deux palettes (mode clair demandé le 2026-09-30) : la maquette n'a que la nuit. En clair,
// lignes ardoise, vert plus profond, et les calques « lighter » (additifs, qui blanchissent
// sur fond clair) passent en fusion normale — voir `blendLight()`.
const PALETTES = {
  dark: {
    line: "150, 186, 206",
    accent: "47, 210, 134",
    pinDisc: "228, 234, 238",
    highlight: "214, 255, 234",
    atmosphere: "110, 185, 230",
    spotlight: "185, 215, 232",
  },
  light: {
    line: "84, 104, 122",
    accent: "23, 126, 79",
    pinDisc: "255, 255, 255",
    highlight: "120, 215, 165",
    atmosphere: "90, 150, 200",
    spotlight: "40, 78, 104",
  },
} as const;
const isDark = (): boolean => document.documentElement.classList.contains("dark");
const colors = () => (isDark() ? PALETTES.dark : PALETTES.light);
const blendLight = (): GlobalCompositeOperation => (isDark() ? "lighter" : "source-over");

const C = {
  globe: {
    hemisphere: "south" as GlobeHemisphere,
    /** Longitude face à nous au démarrage, selon l'hémisphère. */
    startLonDeg: { south: -25, north: -75 },
    radiusByWidth: 0.575,
    radiusByHeight: 0.9,
    /** Distance du pôle visible au bord de la section (fraction de la hauteur). */
    poleY: 1.13,
    tiltDeg: 0,
    meridianStepDeg: 20,
    parallelStepDeg: 20,
    sampleStepDeg: 2,
    spinDegPerSec: 2,
    lineWidth: 1,
    lineAlpha: 0.2,
    outline: true,
  },
  countries: { enabled: true, landAlpha: 0.05, coastAlpha: 0.5, coastWidth: 1, borderAlpha: 0.26, borderWidth: 0.75 },
  atmosphere: { enabled: true, alpha: 0.14, width: 0.07 },
  spotlight: { enabled: true, radius: 210, gridAlpha: 0.45, coastAlpha: 0.9, borderAlpha: 0.55, landAlpha: 0.1, glowAlpha: 0.045, response: 9 },
  hover: { burstPings: 7, burstMinDistance: 0.18, burstStaggerSec: 0.09, burstCooldownSec: 1.2, intervalFactor: 0.35, extraActive: 6, pulseBoost: 1.6, beamBoost: 0.9, response: 6 },
  click: { rippleSec: 1.6, rippleAngleDeg: 55, flashBoost: 1.6 },
  parallax: { yawDeg: 4, pitchDeg: 2.5, response: 3 },
  pings: { minIntervalSec: 1.5, maxIntervalSec: 3, lifeSec: 2.6, maxActive: 4, maxActiveMobile: 2, onLandOnly: true, connectChance: 0.5, dotRadius: 2.4, ringRadius: 22, edgeMargin: 0.07 },
  arcs: { delaySec: 0.3, drawSec: 1.05, holdSec: 0.1, retractSec: 0.7, liftPerRad: 0.28, minLift: 0.04, maxLift: 0.3, lineWidth: 1.4, alpha: 0.85 },
  pin: { outerEm: 0.62, innerEm: 0.32, pulseSec: 2.6, pulseScale: 2.5, flashSec: 0.7 },
  beam: { halfAngleDeg: 12, minHalfWidth: 18, maxHalfWidth: 56, restLength: 1.6, followCursor: true, cursorGap: 44, minLength: 60, response: 5, alpha: 0.3, breatheSec: 4.5, shimmerSec: 3.8 },
  textMask: { strength: 0.8, scaleX: 1.25, scaleY: 1.4 },
  entrance: { linesSec: 1.2, pinAt: 0.35, pinSec: 0.5, beamAt: 0.6, beamSec: 0.65, textAtMs: 450, textStaggerMs: 130, pingsAt: 1.5, triggerRatio: 0.3 },
  mobileBreakpoint: 768,
  maxDpr: 2,
} as const;

const DEG = Math.PI / 180;
const TAU = Math.PI * 2;
const EASE_CSS = "cubic-bezier(0.2, 0.7, 0.2, 1)";
const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";
const FINE_POINTER_QUERY = "(hover: hover) and (pointer: fine)";
const ARC_TOTAL = C.arcs.drawSec + C.arcs.holdSec + C.arcs.retractSec;

/* ── Types ── */

interface Vec2 {
  x: number;
  y: number;
}
interface Vec3 extends Vec2 {
  z: number;
}
interface Bounds {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}
interface Globe {
  cx: number;
  cy: number;
  r: number;
  tilt: number;
}
interface View {
  spin: number;
  tilt: number;
}
/** Point projeté : position écran, profondeur (> 0 = face visible) et normale. */
interface SurfacePoint extends Vec2 {
  z: number;
  nx: number;
  ny: number;
}
interface Layout {
  width: number;
  height: number;
  dpr: number;
  mobile: boolean;
  globe: Globe;
  pin: Vec2;
  pinOuter: number;
  pinInner: number;
  beamTarget: Vec2;
  text: { cx: number; cy: number; rx: number; ry: number };
}
interface SpherePoint {
  cosLat: number;
  sinLat: number;
  sinLon: number;
  cosLon: number;
}
type SphereLine = SpherePoint[];
type LonLat = [number, number];
interface LandPolygon {
  rings: SphereLine[];
  lonLat: LonLat[][];
  bbox: [number, number, number, number];
}
interface World {
  land: LandPolygon[];
  coast: SphereLine[];
  borders: SphereLine[];
}
interface Ping {
  lat: number;
  lon: number;
  born: number;
  dieAt: number;
  arcAt: number | null;
  arrived: boolean;
}
interface Spotlight {
  x: number;
  y: number;
  tx: number;
  ty: number;
  on: number;
  target: number;
}
interface SceneState {
  time: number;
  spin: number;
  yaw: number;
  pitch: number;
  targetYaw: number;
  targetPitch: number;
  entranceStart: number | null;
  nextPingAt: number;
  pings: Ping[];
  pinFlashAt: number;
  flashScale: number;
  hot: boolean;
  heat: number;
  pulsePhase: number;
  breathePhase: number;
  shimmerPhase: number;
  rippleAt: number;
  lastBurstAt: number;
  spot: Spotlight;
  beam: { angle: number; length: number; ready: boolean };
}
interface SpotLayer {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
}

/* ── Utilitaires ── */

const clamp = (v: number, min = 0, max = 1): number => Math.min(max, Math.max(min, v));
const progress = (t: number, start: number, duration: number): number => clamp((t - start) / duration);
const easeOutCubic = (t: number): number => 1 - (1 - clamp(t)) ** 3;
const easeInOutSine = (t: number): number => (1 - Math.cos(Math.PI * clamp(t))) / 2;
const easeOutBack = (t: number): number => {
  const x = clamp(t) - 1;
  return 1 + 2.70158 * x ** 3 + 1.70158 * x ** 2;
};
const rgba = (rgb: string, alpha: number): string => `rgba(${rgb}, ${clamp(alpha).toFixed(3)})`;
const rand = (min: number, max: number): number => min + Math.random() * (max - min);
const viewOf = (s: SceneState, g: Globe): View => ({ spin: s.spin + s.yaw, tilt: g.tilt + s.pitch });
const toSpherePoint = (lonDeg: number, latDeg: number): SpherePoint => ({
  cosLat: Math.cos(latDeg * DEG),
  sinLat: Math.sin(latDeg * DEG),
  sinLon: Math.sin(lonDeg * DEG),
  cosLon: Math.cos(lonDeg * DEG),
});
const fullBounds = (layout: Layout): Bounds => ({ x0: 0, y0: 0, x1: layout.width, y1: layout.height });

/* ── Projection ── */

function project(lat: number, lon: number, view: View, g: Globe): SurfacePoint {
  const cosLat = Math.cos(lat);
  const l = lon + view.spin;
  const x = cosLat * Math.sin(l);
  const y = Math.sin(lat);
  const z = cosLat * Math.cos(l);
  const ct = Math.cos(view.tilt);
  const st = Math.sin(view.tilt);
  const y2 = y * ct - z * st;
  const z2 = y * st + z * ct;
  return { x: g.cx + g.r * x, y: g.cy - g.r * y2, z: z2, nx: x, ny: y2 };
}

/** Point écran → latitude/longitude sur la face visible (null hors du globe). */
function unproject(sx: number, sy: number, view: View, g: Globe): { lat: number; lon: number } | null {
  const x = (sx - g.cx) / g.r;
  const y2 = (g.cy - sy) / g.r;
  const d = 1 - x * x - y2 * y2;
  if (d <= 0) return null;
  const z2 = Math.sqrt(d);
  const ct = Math.cos(view.tilt);
  const st = Math.sin(view.tilt);
  const y = y2 * ct + z2 * st;
  const z = z2 * ct - y2 * st;
  return { lat: Math.asin(clamp(y, -1, 1)), lon: Math.atan2(x, z) - view.spin };
}

function buildGraticule(): SphereLine[] {
  const g = C.globe;
  const lines: SphereLine[] = [];
  for (let lon = 0; lon < 360; lon += g.meridianStepDeg) {
    const line: SphereLine = [];
    for (let lat = -90; lat <= 90; lat += g.sampleStepDeg) line.push(toSpherePoint(lon, lat));
    lines.push(line);
  }
  // Parallèles alignés sur l'équateur : 0°, ±20°, ±40°…
  const first = -Math.floor((90 - 1e-6) / g.parallelStepDeg) * g.parallelStepDeg;
  for (let lat = first; lat < 90; lat += g.parallelStepDeg) {
    const line: SphereLine = [];
    for (let lon = 0; lon <= 360; lon += g.sampleStepDeg) line.push(toSpherePoint(lon, lat));
    lines.push(line);
  }
  return lines;
}

/* ── Pays (TopoJSON world-atlas) ── */

type TopoGeometry =
  | { type: "Polygon"; arcs: number[][] }
  | { type: "MultiPolygon"; arcs: number[][][] }
  | { type: "GeometryCollection"; geometries: TopoGeometry[] }
  | { type: string };
interface Topology {
  transform: { scale: [number, number]; translate: [number, number] };
  arcs: number[][][];
  objects: Record<string, TopoGeometry>;
}

/** Rend les longitudes continues quand un anneau traverse l'antiméridien. */
function unwrap(ring: LonLat[]): LonLat[] {
  let offset = 0;
  let prev: number | null = null;
  return ring.map(([lon, lat]) => {
    if (prev !== null) {
      const d = lon - prev;
      if (d > 180) offset -= 360;
      else if (d < -180) offset += 360;
    }
    prev = lon;
    return [lon + offset, lat];
  });
}

function topoArcs(topo: Topology): LonLat[][] {
  const [sx, sy] = topo.transform.scale;
  const [tx, ty] = topo.transform.translate;
  return topo.arcs.map((arc) => {
    let x = 0;
    let y = 0;
    return arc.map(([dx = 0, dy = 0]) => {
      x += dx;
      y += dy;
      return [x * sx + tx, y * sy + ty] as LonLat;
    });
  });
}

function stitch(arcs: LonLat[][], index: number[]): LonLat[] {
  const out: LonLat[] = [];
  index.forEach((i, k) => {
    let arc = i < 0 ? [...(arcs[~i] ?? [])].reverse() : (arcs[i] ?? []);
    if (k > 0) arc = arc.slice(1);
    for (const p of arc) out.push(p);
  });
  return out;
}

function polygonsOf(geometry: TopoGeometry, out: number[][][]): void {
  if (geometry.type === "Polygon" && "arcs" in geometry) out.push(geometry.arcs as number[][]);
  else if (geometry.type === "MultiPolygon" && "arcs" in geometry) for (const p of geometry.arcs as number[][][]) out.push(p);
  else if (geometry.type === "GeometryCollection" && "geometries" in geometry) for (const g of geometry.geometries) polygonsOf(g, out);
}

function buildWorld(landTopo: Topology, countriesTopo: Topology | null): World {
  const land: LandPolygon[] = [];
  const landArcs = topoArcs(landTopo);
  const polygons: number[][][] = [];
  const landObject = landTopo.objects.land;
  if (landObject) polygonsOf(landObject, polygons);
  for (const polygon of polygons) {
    const lonLat = polygon.map((ring) => unwrap(stitch(landArcs, ring)));
    let minLon = Number.POSITIVE_INFINITY;
    let minLat = Number.POSITIVE_INFINITY;
    let maxLon = Number.NEGATIVE_INFINITY;
    let maxLat = Number.NEGATIVE_INFINITY;
    for (const ring of lonLat) {
      for (const [lon, lat] of ring) {
        if (lon < minLon) minLon = lon;
        if (lon > maxLon) maxLon = lon;
        if (lat < minLat) minLat = lat;
        if (lat > maxLat) maxLat = lat;
      }
    }
    land.push({ rings: lonLat.map((ring) => ring.map(([lon, lat]) => toSpherePoint(lon, lat))), lonLat, bbox: [minLon, minLat, maxLon, maxLat] });
  }
  const borders: SphereLine[] = [];
  const countries = countriesTopo?.objects.countries;
  if (countriesTopo && countries && "geometries" in countries) {
    // Une frontière = un arc partagé par deux pays.
    const arcs = topoArcs(countriesTopo);
    const users = new Map<number, Set<number>>();
    countries.geometries.forEach((geometry, gi) => {
      const rings: number[][][] = [];
      polygonsOf(geometry, rings);
      for (const polygon of rings) {
        for (const ring of polygon) {
          for (const i of ring) {
            const k = i < 0 ? ~i : i;
            const set = users.get(k) ?? new Set<number>();
            set.add(gi);
            users.set(k, set);
          }
        }
      }
    });
    users.forEach((set, k) => {
      const arc = arcs[k];
      if (set.size > 1 && arc) borders.push(arc.map(([lon, lat]) => toSpherePoint(lon, lat)));
    });
  }
  return { land, coast: land.flatMap((p) => p.rings), borders };
}

let worldPromise: Promise<World> | null = null;
function loadWorld(): Promise<World> {
  if (!worldPromise) {
    worldPromise = Promise.all([
      import("world-atlas/land-110m.json").then((m) => m.default as unknown as Topology),
      import("world-atlas/countries-110m.json").then((m) => m.default as unknown as Topology).catch(() => null),
    ]).then(([land, countries]) => buildWorld(land, countries));
  }
  return worldPromise;
}

function insidePolygon(lon: number, lat: number, rings: LonLat[][]): boolean {
  let inside = false;
  for (const ring of rings) {
    let prev = ring[ring.length - 1];
    if (!prev) continue;
    for (const cur of ring) {
      if (cur[1] > lat !== prev[1] > lat && lon < ((prev[0] - cur[0]) * (lat - cur[1])) / (prev[1] - cur[1]) + cur[0]) inside = !inside;
      prev = cur;
    }
  }
  return inside;
}

/** Vrai si le point (en radians) est sur une terre, Antarctique exclue. */
function isOnLand(latRad: number, lonRad: number, world: World): boolean {
  const lat = latRad / DEG;
  const lon = ((((lonRad / DEG + 180) % 360) + 360) % 360) - 180;
  for (const polygon of world.land) {
    const [minLon, minLat, maxLon, maxLat] = polygon.bbox;
    if (maxLat < -60 || lat < minLat || lat > maxLat) continue;
    for (const candidate of [lon, lon + 360, lon - 360]) {
      if (candidate < minLon || candidate > maxLon) continue;
      if (insidePolygon(candidate, lat, polygon.lonLat)) return true;
    }
  }
  return false;
}

/* ── Dessin ── */

const DEPTH_ALPHA = [0.2, 0.45, 0.72, 1] as const;
const depthBucket = (z: number): 0 | 1 | 2 | 3 => (z < 0.1 ? 0 : z < 0.28 ? 1 : z < 0.5 ? 2 : 3);

/** Trace des lignes posées sur la sphère : face visible seulement, fondu de profondeur. */
function strokeSphereLines(ctx: CanvasRenderingContext2D, lines: readonly SphereLine[], layout: Layout, view: View, rgb: string, alpha: number, width: number, bounds: Bounds): void {
  const g = layout.globe;
  const m = 8;
  // Code de zone : un segment dont les deux bouts sont du même côté hors zone est ignoré.
  const zone = (x: number, y: number): number => (x < bounds.x0 - m ? 1 : 0) | (x > bounds.x1 + m ? 2 : 0) | (y < bounds.y0 - m ? 4 : 0) | (y > bounds.y1 + m ? 8 : 0);
  const paths: [Path2D, Path2D, Path2D, Path2D] = [new Path2D(), new Path2D(), new Path2D(), new Path2D()];
  const cs = Math.cos(view.spin);
  const ss = Math.sin(view.spin);
  const ct = Math.cos(view.tilt);
  const st = Math.sin(view.tilt);

  for (const line of lines) {
    let hasPrev = false;
    let px = 0;
    let py = 0;
    let pz = 0;
    let open = -1;
    for (const p of line) {
      const sinL = p.sinLon * cs + p.cosLon * ss;
      const cosL = p.cosLon * cs - p.sinLon * ss;
      const z0 = p.cosLat * cosL;
      const sx = g.cx + g.r * p.cosLat * sinL;
      const sy = g.cy - g.r * (p.sinLat * ct - z0 * st);
      const sz = p.sinLat * st + z0 * ct;
      if (hasPrev && (pz > 0 || sz > 0)) {
        let ax = px;
        let ay = py;
        let bx = sx;
        let by = sy;
        let fresh = open === -1;
        if (pz <= 0) {
          const t = pz / (pz - sz);
          ax = px + (sx - px) * t;
          ay = py + (sy - py) * t;
          fresh = true;
        } else if (sz <= 0) {
          const t = pz / (pz - sz);
          bx = px + (sx - px) * t;
          by = py + (sy - py) * t;
        }
        if ((zone(ax, ay) & zone(bx, by)) !== 0) {
          open = -1;
        } else {
          const bucket = depthBucket((Math.max(pz, 0) + Math.max(sz, 0)) / 2);
          const path = paths[bucket];
          if (fresh || bucket !== open) path.moveTo(ax, ay);
          path.lineTo(bx, by);
          open = sz > 0 ? bucket : -1;
        }
      } else {
        open = -1;
      }
      px = sx;
      py = sy;
      pz = sz;
      hasPrev = true;
    }
  }

  ctx.lineWidth = width;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  for (const b of [0, 1, 2, 3] as const) {
    ctx.strokeStyle = rgba(rgb, alpha * DEPTH_ALPHA[b]);
    ctx.stroke(paths[b]);
  }
}

function drawGraticule(ctx: CanvasRenderingContext2D, graticule: readonly SphereLine[], layout: Layout, view: View, bounds: Bounds): void {
  strokeSphereLines(ctx, graticule, layout, view, colors().line, C.globe.lineAlpha, C.globe.lineWidth, bounds);
  if (C.globe.outline) {
    const g = layout.globe;
    ctx.strokeStyle = rgba(colors().line, C.globe.lineAlpha);
    ctx.beginPath();
    ctx.arc(g.cx, g.cy, g.r, 0, TAU);
    ctx.stroke();
  }
}

/** Remplit les terres ; les parties cachées sont rabattues sur le contour du globe. */
function fillLand(ctx: CanvasRenderingContext2D, land: readonly LandPolygon[], layout: Layout, view: View, rgb: string, alpha: number, bounds: Bounds): void {
  const g = layout.globe;
  const cs = Math.cos(view.spin);
  const ss = Math.sin(view.spin);
  const ct = Math.cos(view.tilt);
  const st = Math.sin(view.tilt);
  ctx.fillStyle = rgba(rgb, alpha);

  for (const polygon of land) {
    const path = new Path2D();
    let visible = false;
    let minX = Number.POSITIVE_INFINITY;
    let minY = Number.POSITIVE_INFINITY;
    let maxX = Number.NEGATIVE_INFINITY;
    let maxY = Number.NEGATIVE_INFINITY;
    for (const ring of polygon.rings) {
      let first = true;
      let hasPrev = false;
      let px = 0;
      let py = 0;
      let pz = 0;
      const add = (sx: number, sy: number): void => {
        if (first) {
          path.moveTo(sx, sy);
          first = false;
        } else {
          path.lineTo(sx, sy);
        }
        if (sx < minX) minX = sx;
        if (sx > maxX) maxX = sx;
        if (sy < minY) minY = sy;
        if (sy > maxY) maxY = sy;
      };
      const addOnLimb = (x: number, y: number): void => {
        const len = Math.hypot(x, y);
        if (len > 1e-9) add(g.cx + (g.r * x) / len, g.cy - (g.r * y) / len);
      };
      for (const p of ring) {
        const sinL = p.sinLon * cs + p.cosLon * ss;
        const cosL = p.cosLon * cs - p.sinLon * ss;
        const x = p.cosLat * sinL;
        const z0 = p.cosLat * cosL;
        const y = p.sinLat * ct - z0 * st;
        const z = p.sinLat * st + z0 * ct;
        if (hasPrev && pz > 0 !== z > 0) {
          const t = pz / (pz - z);
          addOnLimb(px + (x - px) * t, py + (y - py) * t);
        }
        if (z > 0) {
          add(g.cx + g.r * x, g.cy - g.r * y);
          visible = true;
        } else {
          addOnLimb(x, y);
        }
        px = x;
        py = y;
        pz = z;
        hasPrev = true;
      }
      if (!first) path.closePath();
    }
    if (!visible || maxX < bounds.x0 || minX > bounds.x1 || maxY < bounds.y0 || minY > bounds.y1) continue;
    ctx.fill(path, "evenodd");
  }
}

/** Halo d'atmosphère : lueur douce de part et d'autre du contour du globe. */
function drawAtmosphere(ctx: CanvasRenderingContext2D, layout: Layout): void {
  if (!C.atmosphere.enabled) return;
  const g = layout.globe;
  const color = colors().atmosphere;
  const inner = g.r * (1 - C.atmosphere.width);
  const outer = g.r * (1 + C.atmosphere.width);
  const limb = (g.r - inner) / (outer - inner);
  const grad = ctx.createRadialGradient(g.cx, g.cy, inner, g.cx, g.cy, outer);
  grad.addColorStop(0, rgba(color, 0));
  grad.addColorStop(limb, rgba(color, C.atmosphere.alpha));
  grad.addColorStop(limb + (1 - limb) * 0.3, rgba(color, C.atmosphere.alpha * 0.45));
  grad.addColorStop(1, rgba(color, 0));
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(g.cx, g.cy, outer, 0, TAU);
  ctx.arc(g.cx, g.cy, inner, 0, TAU, true);
  ctx.fill();
}

/** Lampe de la souris : redessine lignes et pays plus clairs dans un cercle adouci. */
function drawSpotlight(ctx: CanvasRenderingContext2D, layer: SpotLayer, layout: Layout, view: View, graticule: readonly SphereLine[], world: World | null, light: Spotlight): void {
  const L = C.spotlight;
  const color = colors().spotlight;
  const r = L.radius;
  const bounds: Bounds = { x0: light.x - r, y0: light.y - r, x1: light.x + r, y1: light.y + r };
  const sctx = layer.ctx;
  // Le calque ne couvre que le carré autour du curseur (pixels entiers pour rester net).
  const dpr = layout.dpr;
  const ox = Math.round(bounds.x0 * dpr);
  const oy = Math.round(bounds.y0 * dpr);
  sctx.setTransform(1, 0, 0, 1, 0, 0);
  sctx.globalCompositeOperation = "source-over";
  sctx.clearRect(0, 0, layer.canvas.width, layer.canvas.height);
  sctx.setTransform(dpr, 0, 0, dpr, -ox, -oy);
  const globe = layout.globe;
  sctx.save();
  sctx.beginPath();
  sctx.arc(globe.cx, globe.cy, globe.r, 0, TAU);
  sctx.clip();
  sctx.fillStyle = rgba(color, L.glowAlpha);
  sctx.fillRect(bounds.x0, bounds.y0, r * 2, r * 2);
  sctx.restore();
  if (world) fillLand(sctx, world.land, layout, view, color, L.landAlpha, bounds);
  strokeSphereLines(sctx, graticule, layout, view, color, L.gridAlpha, C.globe.lineWidth, bounds);
  if (world) {
    strokeSphereLines(sctx, world.coast, layout, view, color, L.coastAlpha, C.countries.coastWidth, bounds);
    strokeSphereLines(sctx, world.borders, layout, view, color, L.borderAlpha, C.countries.borderWidth, bounds);
  }
  const on = clamp(light.on);
  const g = sctx.createRadialGradient(light.x, light.y, 0, light.x, light.y, r);
  g.addColorStop(0, `rgba(0, 0, 0, ${on})`);
  g.addColorStop(0.45, `rgba(0, 0, 0, ${on * 0.55})`);
  g.addColorStop(1, "rgba(0, 0, 0, 0)");
  sctx.globalCompositeOperation = "destination-in";
  sctx.fillStyle = g;
  sctx.fillRect(bounds.x0 - 2, bounds.y0 - 2, r * 2 + 4, r * 2 + 4);
  sctx.globalCompositeOperation = "source-over";

  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalCompositeOperation = blendLight();
  ctx.drawImage(layer.canvas, ox, oy);
  ctx.restore();
}

/** Entrée : révèle les lignes par un cercle qui grandit depuis le centre du texte. */
function revealFromCenter(ctx: CanvasRenderingContext2D, layout: Layout, p: number): void {
  const { width: w, height: h, text } = layout;
  const maxR = Math.hypot(Math.max(text.cx, w - text.cx), Math.max(text.cy, h - text.cy)) + 160;
  const r = Math.max(1, maxR * easeOutCubic(p));
  const soft = Math.min(160, r);
  const g = ctx.createRadialGradient(text.cx, text.cy, 0, text.cx, text.cy, r);
  g.addColorStop(0, "rgba(0, 0, 0, 1)");
  g.addColorStop(clamp((r - soft) / r), "rgba(0, 0, 0, 1)");
  g.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.save();
  ctx.globalCompositeOperation = "destination-in";
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  ctx.restore();
}

/** Estompe les lignes derrière le bloc de texte pour garder la lisibilité. */
function eraseBehindText(ctx: CanvasRenderingContext2D, layout: Layout): void {
  const { text } = layout;
  const strength = C.textMask.strength;
  if (strength <= 0 || text.rx <= 0 || text.ry <= 0) return;
  ctx.save();
  ctx.globalCompositeOperation = "destination-out";
  ctx.translate(text.cx, text.cy);
  ctx.scale(text.rx * C.textMask.scaleX, text.ry * C.textMask.scaleY);
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
  g.addColorStop(0, `rgba(0, 0, 0, ${strength})`);
  g.addColorStop(0.6, `rgba(0, 0, 0, ${strength * 0.75})`);
  g.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(0, 0, 1, 0, TAU);
  ctx.fill();
  ctx.restore();
}

function glow(ctx: CanvasRenderingContext2D, at: Vec2, radius: number, alpha: number): void {
  if (alpha <= 0 || radius <= 0) return;
  const g = ctx.createRadialGradient(at.x, at.y, 0, at.x, at.y, radius);
  g.addColorStop(0, rgba(colors().highlight, alpha));
  g.addColorStop(0.35, rgba(colors().accent, alpha * 0.6));
  g.addColorStop(1, rgba(colors().accent, 0));
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(at.x, at.y, radius, 0, TAU);
  ctx.fill();
}

/** [ouverture relative, intensité] de chaque couche du faisceau. */
const BEAM_LAYERS = [
  [1.5, 0.12],
  [1.22, 0.3],
  [1, 1],
] as const;

/** Faisceau au repos : du point principal vers le centre du titre. */
function restBeam(layout: Layout): { angle: number; length: number } {
  const dx = layout.beamTarget.x - layout.pin.x;
  const dy = layout.beamTarget.y - layout.pin.y;
  return { angle: Math.atan2(dy, dx), length: Math.hypot(dx, dy) * C.beam.restLength };
}

/** Écart d'angle le plus court, entre −π et π. */
const angleDelta = (from: number, to: number): number => {
  const d = (to - from) % TAU;
  return d > Math.PI ? d - TAU : d < -Math.PI ? d + TAU : d;
};

function drawBeam(ctx: CanvasRenderingContext2D, layout: Layout, s: SceneState, geometry: { angle: number; length: number }, extend: number, animate: boolean): void {
  if (extend <= 0) return;
  const { pin } = layout;
  const heat = animate ? s.heat : 0;
  const len = geometry.length * easeOutCubic(extend) * (1 + 0.08 * heat);
  if (len < 1) return;
  const halfWidth = clamp(len * Math.tan(C.beam.halfAngleDeg * DEG), C.beam.minHalfWidth, C.beam.maxHalfWidth);
  // Le bout s'estompe sur ~70 px, quelle que soit la longueur.
  const fadeStart = clamp(1 - 70 / len, 0.45, 0.9);
  const breathe = animate ? 0.8 + 0.2 * Math.sin(s.breathePhase * TAU) : 0.9;
  const boost = 1 + C.hover.beamBoost * heat;
  const accent = colors().accent;

  const wedge = (spread: number): void => {
    const w = halfWidth * spread;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(len, -w);
    ctx.lineTo(len, w);
    ctx.closePath();
  };
  const body = (alpha: number): CanvasGradient => {
    const g = ctx.createLinearGradient(0, 0, len, 0);
    g.addColorStop(0, rgba(accent, alpha));
    g.addColorStop(fadeStart, rgba(accent, alpha * 0.35));
    g.addColorStop(1, rgba(accent, 0));
    return g;
  };

  ctx.save();
  ctx.translate(pin.x, pin.y);
  ctx.rotate(geometry.angle);
  for (const [spread, strength] of BEAM_LAYERS) {
    wedge(spread);
    ctx.fillStyle = body(C.beam.alpha * strength * breathe * boost);
    ctx.fill();
  }
  // Reflet qui glisse le long du faisceau.
  if (animate) {
    const cycle = s.shimmerPhase;
    const travel = 0.55;
    if (cycle < travel) {
      const pos = easeInOutSine(cycle / travel);
      const band = 0.14;
      const endFade = 1 - clamp((pos - 0.6) / 0.35);
      const g = ctx.createLinearGradient(0, 0, len, 0);
      g.addColorStop(clamp(pos - band), rgba(colors().highlight, 0));
      g.addColorStop(clamp(pos), rgba(colors().highlight, 0.18 * endFade * breathe * boost));
      g.addColorStop(clamp(pos + band), rgba(colors().highlight, 0));
      ctx.globalCompositeOperation = blendLight();
      wedge(1);
      ctx.fillStyle = g;
      ctx.fill();
    }
  }
  ctx.restore();
}

function drawPing(ctx: CanvasRenderingContext2D, p: SurfacePoint, age: number, life: number): void {
  const a = progress(age, 0, 0.25) * (1 - progress(age, life - 0.6, 0.6)) * clamp(p.z * 2.5);
  if (a <= 0) return;
  const accent = colors().accent;
  glow(ctx, p, 11, 0.45 * a);
  ctx.fillStyle = rgba(accent, a);
  ctx.beginPath();
  ctx.arc(p.x, p.y, C.pings.dotRadius, 0, TAU);
  ctx.fill();
  // Anneaux « posés » sur la sphère : aplatis selon l'orientation de la surface.
  const rotation = Math.atan2(-p.ny, p.nx);
  const squash = Math.max(0.15, p.z);
  ctx.lineWidth = 1.2;
  for (const offset of [0, 0.55]) {
    const rt = (age - 0.05 - offset) / 1.6;
    if (rt <= 0 || rt >= 1) continue;
    const rr = C.pings.dotRadius + easeOutCubic(rt) * (C.pings.ringRadius - C.pings.dotRadius);
    ctx.strokeStyle = rgba(accent, (1 - rt) * 0.6 * a);
    ctx.beginPath();
    ctx.ellipse(p.x, p.y, Math.max(0.01, rr * squash), rr, rotation, 0, TAU);
    ctx.stroke();
  }
}

/** Point de la sphère juste sous le point principal (repère de la vue). */
function pinSurface(layout: Layout): Vec3 {
  const g = layout.globe;
  let x = (layout.pin.x - g.cx) / g.r;
  let y = (g.cy - layout.pin.y) / g.r;
  const d = x * x + y * y;
  if (d >= 1) {
    const k = 1 / Math.sqrt(d);
    x *= k;
    y *= k;
    return { x, y, z: 0 };
  }
  return { x, y, z: Math.sqrt(1 - d) };
}

const ARC_CHUNKS = 8;
const ARC_STEPS_PER_CHUNK = 4;

/** Arc 3D (grand cercle qui décolle de la surface) du ping au point principal. */
function drawArc3D(ctx: CanvasRenderingContext2D, layout: Layout, a: SurfacePoint, b: Vec3, head: number, tail: number, heat: number): void {
  const g = layout.globe;
  const omega = Math.acos(clamp(a.nx * b.x + a.ny * b.y + a.z * b.z, -1, 1));
  if (omega < 1e-3 || head <= tail) return;
  const sinO = Math.sin(omega);
  const lift = clamp(C.arcs.liftPerRad * omega, C.arcs.minLift, C.arcs.maxLift);
  const at = (t: number): { x: number; y: number; hidden: boolean } => {
    const k1 = Math.sin((1 - t) * omega) / sinO;
    const k2 = Math.sin(t * omega) / sinO;
    const h = 1 + lift * Math.sin(Math.PI * t);
    const x = (k1 * a.nx + k2 * b.x) * h;
    const y = (k1 * a.ny + k2 * b.y) * h;
    const z = (k1 * a.z + k2 * b.z) * h;
    return { x: g.cx + g.r * x, y: g.cy - g.r * y, hidden: z < 0 && x * x + y * y < 1 };
  };
  const steps = ARC_CHUNKS * ARC_STEPS_PER_CHUNK;
  const alpha = C.arcs.alpha * (1 + 0.2 * heat);
  ctx.lineWidth = C.arcs.lineWidth * (1 + 0.35 * heat);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  let prev = at(tail);
  for (let c = 0; c < ARC_CHUNKS; c++) {
    // Traînée : transparente côté queue, lumineuse côté tête.
    const f = (c + 1) / ARC_CHUNKS;
    ctx.strokeStyle = rgba(colors().accent, alpha * (0.06 + 0.94 * f * f));
    ctx.beginPath();
    let open = false;
    for (let i = 1; i <= ARC_STEPS_PER_CHUNK; i++) {
      const cur = at(tail + (head - tail) * ((c * ARC_STEPS_PER_CHUNK + i) / steps));
      if (!prev.hidden && !cur.hidden) {
        if (!open) {
          ctx.moveTo(prev.x, prev.y);
          open = true;
        }
        ctx.lineTo(cur.x, cur.y);
      } else {
        open = false;
      }
      prev = cur;
    }
    ctx.stroke();
  }
  if (head < 1) glow(ctx, at(head), 9 + 3 * heat, alpha);
}

function drawPings(ctx: CanvasRenderingContext2D, layout: Layout, view: View, s: SceneState, target: Vec3): void {
  for (const ping of s.pings) {
    const p = project(ping.lat, ping.lon, view, layout.globe);
    if (p.z <= 0) continue;
    drawPing(ctx, p, s.time - ping.born, ping.dieAt - ping.born);
    if (ping.arcAt === null) continue;
    const a = s.time - ping.arcAt;
    const head = easeInOutSine(progress(a, 0, C.arcs.drawSec));
    const tail = easeInOutSine(progress(a, C.arcs.drawSec + C.arcs.holdSec, C.arcs.retractSec));
    if (head > 0 && tail < 1) drawArc3D(ctx, layout, p, target, head, tail, s.heat);
  }
}

/** [retard (s), intensité] des ondes du clic. */
const RIPPLE_WAVES = [
  [0, 1],
  [0.22, 0.6],
] as const;

/** Clic : deux ondes qui partent du point principal et parcourent la surface du globe. */
function drawRipple(ctx: CanvasRenderingContext2D, layout: Layout, b: Vec3, age: number): void {
  const duration = C.click.rippleSec;
  if (age < 0 || age > duration + 0.3) return;
  // Base orthonormée (u, v) perpendiculaire à b.
  let ux = -b.y;
  let uy = b.x;
  const ul = Math.hypot(ux, uy);
  if (ul < 1e-6) {
    ux = 1;
    uy = 0;
  } else {
    ux /= ul;
    uy /= ul;
  }
  const vx = -b.z * uy;
  const vy = b.z * ux;
  const vz = b.x * uy - b.y * ux;
  const g = layout.globe;
  const samples = 96;
  for (const [delay, strength] of RIPPLE_WAVES) {
    const p = (age - delay) / duration;
    if (p <= 0 || p >= 1) continue;
    const rho = (1 - (1 - p) ** 2) * C.click.rippleAngleDeg * DEG;
    const cr = Math.cos(rho);
    const sr = Math.sin(rho);
    const fade = (1 - p) * strength;
    ctx.beginPath();
    let open = false;
    for (let i = 0; i <= samples; i++) {
      const th = (i / samples) * TAU;
      const c = Math.cos(th);
      const sn = Math.sin(th);
      const z = cr * b.z + sr * sn * vz;
      if (z <= 0) {
        open = false;
        continue;
      }
      const x = cr * b.x + sr * (c * ux + sn * vx);
      const y = cr * b.y + sr * (c * uy + sn * vy);
      const sx = g.cx + g.r * x;
      const sy = g.cy - g.r * y;
      if (open) {
        ctx.lineTo(sx, sy);
      } else {
        ctx.moveTo(sx, sy);
        open = true;
      }
    }
    // Trait large et diffus, puis trait fin et net.
    ctx.lineWidth = 7;
    ctx.strokeStyle = rgba(colors().accent, 0.12 * fade);
    ctx.stroke();
    ctx.lineWidth = 1.6;
    ctx.strokeStyle = rgba(colors().accent, 0.8 * fade);
    ctx.stroke();
  }
}

function drawPin(ctx: CanvasRenderingContext2D, layout: Layout, s: SceneState, appear: number, flash: number, animate: boolean): void {
  if (appear <= 0) return;
  const { pin, pinOuter, pinInner } = layout;
  const scale = easeOutBack(appear);
  const fade = clamp(appear * 2);
  const accent = colors().accent;
  const heat = animate ? s.heat : 0;
  const flashScale = s.flashScale;

  // Pulsation radar continue (plus rapide et plus visible au survol du bouton).
  if (animate) {
    ctx.lineWidth = 1.5;
    for (const offset of [0, 0.5]) {
      const phase = (s.pulsePhase + offset) % 1;
      const rr = pinOuter * (1 + phase * (C.pin.pulseScale - 1));
      ctx.strokeStyle = rgba(accent, (1 - phase) * (1 - phase) * 0.55 * fade * (1 + 0.5 * heat));
      ctx.beginPath();
      ctx.arc(pin.x, pin.y, rr, 0, TAU);
      ctx.stroke();
    }
  }
  // Flash quand un arc arrive (plus grand au clic).
  if (flash > 0) {
    const fr = pinOuter * (1.4 + (1 - flash) * 1.6 * flashScale);
    const g = ctx.createRadialGradient(pin.x, pin.y, pinOuter * 0.6, pin.x, pin.y, fr);
    g.addColorStop(0, rgba(accent, 0.55 * flash * fade * flashScale));
    g.addColorStop(1, rgba(accent, 0));
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(pin.x, pin.y, fr, 0, TAU);
    ctx.fill();
  }
  ctx.fillStyle = rgba(colors().pinDisc, 0.92 * fade);
  ctx.beginPath();
  ctx.arc(pin.x, pin.y, Math.max(0, pinOuter * scale), 0, TAU);
  ctx.fill();
  ctx.fillStyle = rgba(accent, fade);
  ctx.beginPath();
  ctx.arc(pin.x, pin.y, Math.max(0, pinInner * scale * (1 + 0.15 * flash * flashScale)), 0, TAU);
  ctx.fill();
}

function renderScene(ctx: CanvasRenderingContext2D, layout: Layout, graticule: readonly SphereLine[], world: World | null, s: SceneState, reduced: boolean, spot: SpotLayer | null): void {
  const e = reduced ? Number.POSITIVE_INFINITY : s.entranceStart === null ? -1 : s.time - s.entranceStart;
  const lines = progress(e, 0, C.entrance.linesSec);
  if (lines <= 0) return;
  const view = viewOf(s, layout.globe);
  const full = fullBounds(layout);

  // 1. Globe : atmosphère, terres, grille, côtes, frontières.
  drawAtmosphere(ctx, layout);
  if (world) fillLand(ctx, world.land, layout, view, colors().line, C.countries.landAlpha, full);
  drawGraticule(ctx, graticule, layout, view, full);
  if (world) {
    strokeSphereLines(ctx, world.coast, layout, view, colors().line, C.countries.coastAlpha, C.countries.coastWidth, full);
    strokeSphereLines(ctx, world.borders, layout, view, colors().line, C.countries.borderAlpha, C.countries.borderWidth, full);
  }
  // 2. Lampe de la souris, pings, arcs 3D et onde du clic.
  const target = pinSurface(layout);
  if (!reduced) {
    if (spot && s.spot.on > 0.01) drawSpotlight(ctx, spot, layout, view, graticule, world, s.spot);
    drawPings(ctx, layout, view, s, target);
    drawRipple(ctx, layout, target, s.time - s.rippleAt);
  }
  // 3. Entrée, puis fondu derrière le texte.
  if (lines < 1) revealFromCenter(ctx, layout, lines);
  eraseBehindText(ctx, layout);
  // 4. Faisceau et point principal, toujours nets.
  const beam = !reduced && s.beam.ready ? s.beam : restBeam(layout);
  drawBeam(ctx, layout, s, beam, progress(e, C.entrance.beamAt, C.entrance.beamSec), !reduced);
  const flash = reduced ? 0 : 1 - progress(s.time - s.pinFlashAt, 0, C.pin.flashSec * s.flashScale);
  drawPin(ctx, layout, s, progress(e, C.entrance.pinAt, C.entrance.pinSec), flash, !reduced);
}

/* ── Pings ── */

/** Cherche un endroit pour un ping : sur terre, hors du texte, loin des autres pings. */
function findPingSpot(s: SceneState, layout: Layout, view: View, world: World | null, minPinDistance = 0, gapFactor = 0.1): { lat: number; lon: number; clear: boolean } | null {
  const { width: w, height: h, text, globe } = layout;
  const margin = w * C.pings.edgeMargin;
  const rx = text.rx * C.textMask.scaleX * 1.05;
  const ry = text.ry * C.textMask.scaleY * 1.05;
  const minGap = Math.max(40, w * gapFactor);
  for (let attempt = 0; attempt < 32; attempt++) {
    const sx = rand(margin, w - margin);
    const sy = rand(margin * 0.8, h - margin * 0.8);
    const ex = (sx - text.cx) / rx;
    const ey = (sy - text.cy) / ry;
    if (ex * ex + ey * ey < 1) continue; // jamais derrière le texte
    if (Math.hypot(sx - layout.pin.x, sy - layout.pin.y) < minPinDistance) continue;
    const tooClose = s.pings.some((p) => {
      const q = project(p.lat, p.lon, view, globe);
      return Math.hypot(q.x - sx, q.y - sy) < minGap;
    });
    if (tooClose) continue;
    const ll = unproject(sx, sy, view, globe);
    if (!ll) continue;
    if (C.pings.onLandOnly && world && !isOnLand(ll.lat, ll.lon, world)) continue;
    // « clear » : l'arc vers le point principal ne traverse pas le texte.
    const clear = sy < text.cy - text.ry * 0.2 || Math.abs(sx - text.cx) > text.rx * 1.1;
    return { lat: ll.lat, lon: ll.lon, clear };
  }
  return null;
}

const createPing = (spot: { lat: number; lon: number }, born: number): Ping => ({ lat: spot.lat, lon: spot.lon, born, dieAt: born + C.pings.lifeSec, arcAt: null, arrived: false });

function scheduleArc(p: Ping, at: number): void {
  p.arcAt = at;
  p.dieAt = Math.max(p.dieAt, at + ARC_TOTAL + 0.35);
}

function updatePings(s: SceneState, layout: Layout, world: World | null): void {
  s.pings = s.pings.filter((p) => s.time < p.dieAt);
  for (const p of s.pings) {
    if (p.arcAt === null || p.arrived || s.time < p.arcAt + C.arcs.drawSec) continue;
    p.arrived = true;
    // Un arc qui arrive ne coupe pas un flash de clic encore plus fort.
    const remaining = (1 - progress(s.time - s.pinFlashAt, 0, C.pin.flashSec * s.flashScale)) * s.flashScale;
    if (remaining <= 1) {
      s.pinFlashAt = s.time;
      s.flashScale = 1;
    }
  }
  if (s.entranceStart === null || s.time < s.nextPingAt) return;
  const heat = s.heat;
  const max = (layout.mobile ? C.pings.maxActiveMobile : C.pings.maxActive) + Math.round(C.hover.extraActive * heat);
  if (s.pings.length >= max) {
    s.nextPingAt = s.time + 0.3;
    return;
  }
  const spot = findPingSpot(s, layout, viewOf(s, layout.globe), world);
  if (spot) {
    const ping = createPing(spot, s.time);
    const chance = C.pings.connectChance + (1 - C.pings.connectChance) * heat;
    if ((spot.clear || heat > 0.5) && Math.random() < chance) scheduleArc(ping, s.time + C.arcs.delaySec);
    s.pings.push(ping);
  }
  const interval = rand(C.pings.minIntervalSec, C.pings.maxIntervalSec) * (1 - (1 - C.hover.intervalFactor) * heat);
  s.nextPingAt = s.time + (spot ? interval : 0.3);
}

/** Survol du bouton : tous les pings envoient leur arc, et quelques pings de plus. */
function burst(s: SceneState, layout: Layout, world: World | null): void {
  if (s.entranceStart === null || s.time - s.entranceStart < C.entrance.pingsAt) return;
  if (s.time - s.lastBurstAt < C.hover.burstCooldownSec) return;
  s.lastBurstAt = s.time;
  const stagger = C.hover.burstStaggerSec;
  let k = 0;
  for (const p of s.pings) {
    if (p.arcAt !== null) continue;
    scheduleArc(p, s.time + 0.05 + k * stagger);
    k++;
  }
  const view = viewOf(s, layout.globe);
  for (let i = 0; i < C.hover.burstPings; i++) {
    const spot = findPingSpot(s, layout, view, world, layout.width * C.hover.burstMinDistance, 0.05);
    if (!spot) continue;
    const ping = createPing(spot, s.time + k * stagger);
    scheduleArc(ping, ping.born + 0.2);
    s.pings.push(ping);
    k++;
  }
  s.nextPingAt = Math.max(s.nextPingAt, s.time + 0.6);
}

/* ── Montage ── */

type Phase = "static" | "hidden" | "shown";

/**
 * Monte le globe dans `card` (le canvas est créé ici) et renvoie la fonction de démontage.
 * Ne fait rien si un repère manque.
 */
export function attachCtaGlobe(card: HTMLElement, hemisphere: GlobeHemisphere = C.globe.hemisphere): () => void {
  const content = card.querySelector<HTMLElement>("[data-cg-content]");
  const titleEl = card.querySelector<HTMLElement>("[data-cg-title]");
  const anchor = card.querySelector<HTMLElement>("[data-cg-anchor]");
  const button = card.querySelector<HTMLElement>("[data-cg-btn]");
  const reveals = Array.from(card.querySelectorAll<HTMLElement>("[data-cg-reveal]"));
  if (!content || !titleEl || !anchor) return () => {};

  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none;z-index:0";
  card.prepend(canvas);
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    canvas.remove();
    return () => {};
  }

  const reduceQuery = window.matchMedia(REDUCED_QUERY);
  const pointerQuery = window.matchMedia(FINE_POINTER_QUERY);
  const north = hemisphere === "north";
  let reduced = reduceQuery.matches;
  let layout: Layout | null = null;
  let world: World | null = null;
  let spotLayer: SpotLayer | null = null;
  const graticule = buildGraticule();
  let visible = false;
  let entered = false;
  let destroyed = false;
  let raf = 0;
  let last = 0;

  const state: SceneState = {
    time: 0,
    spin: -C.globe.startLonDeg[hemisphere] * DEG,
    yaw: 0,
    pitch: 0,
    targetYaw: 0,
    targetPitch: 0,
    entranceStart: null,
    nextPingAt: Number.POSITIVE_INFINITY,
    pings: [],
    pinFlashAt: Number.NEGATIVE_INFINITY,
    flashScale: 1,
    hot: false,
    heat: 0,
    pulsePhase: 0,
    breathePhase: 0,
    shimmerPhase: 0,
    rippleAt: Number.NEGATIVE_INFINITY,
    lastBurstAt: Number.NEGATIVE_INFINITY,
    spot: { x: 0, y: 0, tx: 0, ty: 0, on: 0, target: 0 },
    beam: { angle: 0, length: 0, ready: false },
  };

  // Texte révélé en cascade à l'entrée ; caché d'abord si la section n'est pas à l'écran.
  const setPhase = (phase: Phase): void => {
    for (const el of reveals) {
      const order = Number(el.getAttribute("data-cg-reveal")) || 0;
      if (phase === "hidden") {
        el.style.transition = "none";
        el.style.opacity = "0";
        el.style.transform = "translate3d(0, 14px, 0)";
      } else if (phase === "shown") {
        const delay = C.entrance.textAtMs + order * C.entrance.textStaggerMs;
        el.style.transition = `opacity 700ms ${EASE_CSS} ${delay}ms, transform 900ms ${EASE_CSS} ${delay}ms`;
        el.style.opacity = "1";
        el.style.transform = "none";
      } else {
        el.style.transition = "";
        el.style.opacity = "";
        el.style.transform = "";
      }
    }
  };
  let hiddenText = false;
  if (!reduced) {
    const r = card.getBoundingClientRect();
    if (!(r.top < window.innerHeight && r.bottom > 0)) {
      setPhase("hidden");
      hiddenText = true;
    }
  }

  const sizeSpotLayer = (): void => {
    if (!spotLayer) return;
    const dpr = Math.min(window.devicePixelRatio || 1, C.maxDpr);
    const size = Math.ceil(C.spotlight.radius * 2 * dpr) + 2;
    if (spotLayer.canvas.width !== size) spotLayer.canvas.width = size;
    if (spotLayer.canvas.height !== size) spotLayer.canvas.height = size;
  };

  const measure = (): void => {
    const box = card.getBoundingClientRect();
    if (box.width < 1 || box.height < 1) {
      layout = null;
      return;
    }
    const dpr = Math.min(window.devicePixelRatio || 1, C.maxDpr);
    const bw = Math.round(box.width * dpr);
    const bh = Math.round(box.height * dpr);
    if (canvas.width !== bw || canvas.height !== bh) {
      canvas.width = bw;
      canvas.height = bh;
    }
    sizeSpotLayer();
    const rel = (el: Element) => {
      const b = el.getBoundingClientRect();
      return { x: b.left - box.left, y: b.top - box.top, w: b.width, h: b.height };
    };
    const c = rel(content);
    const t = rel(titleEl);
    const a = rel(anchor);
    const em = Number.parseFloat(window.getComputedStyle(titleEl).fontSize) || 40;
    const r = Math.max(box.width * C.globe.radiusByWidth, box.height * C.globe.radiusByHeight);
    // Le pôle visible est sous la section (sud) ou au-dessus (nord).
    const tilt = C.globe.tiltDeg * DEG * (north ? -1 : 1);
    const poleOffset = r * Math.cos(tilt);
    const cy = north ? box.height * (1 - C.globe.poleY) + poleOffset : box.height * C.globe.poleY - poleOffset;
    layout = {
      width: box.width,
      height: box.height,
      dpr,
      mobile: box.width < C.mobileBreakpoint,
      globe: { cx: box.width / 2, cy, r, tilt },
      pin: { x: a.x, y: a.y },
      pinOuter: em * C.pin.outerEm,
      pinInner: em * C.pin.innerEm,
      beamTarget: { x: t.x + t.w * 0.5, y: t.y + t.h * 0.55 },
      text: { cx: c.x + c.w / 2, cy: c.y + c.h / 2, rx: c.w / 2, ry: c.h / 2 },
    };
  };

  const render = (): void => {
    if (!layout) return;
    ctx.setTransform(layout.dpr, 0, 0, layout.dpr, 0, 0);
    ctx.clearRect(0, 0, layout.width, layout.height);
    renderScene(ctx, layout, graticule, world, state, reduced, spotLayer);
  };

  const step = (dt: number): void => {
    if (!layout) return;
    state.time += dt;
    state.spin = (state.spin + C.globe.spinDegPerSec * DEG * dt) % TAU;
    const k = 1 - Math.exp(-C.parallax.response * dt);
    state.yaw += (state.targetYaw - state.yaw) * k;
    state.pitch += (state.targetPitch - state.pitch) * k;
    state.heat += ((state.hot ? 1 : 0) - state.heat) * (1 - Math.exp(-C.hover.response * dt));
    const heat = state.heat;
    state.pulsePhase = (state.pulsePhase + (dt / C.pin.pulseSec) * (1 + C.hover.pulseBoost * heat)) % 1;
    state.breathePhase = (state.breathePhase + (dt / C.beam.breatheSec) * (1 + heat)) % 1;
    state.shimmerPhase = (state.shimmerPhase + (dt / C.beam.shimmerSec) * (1 + 1.5 * heat)) % 1;
    const spot = state.spot;
    const ks = 1 - Math.exp(-C.spotlight.response * dt);
    spot.x += (spot.tx - spot.x) * ks;
    spot.y += (spot.ty - spot.y) * ks;
    spot.on += (spot.target - spot.on) * (1 - Math.exp(-5 * dt));
    // Faisceau : vers le curseur (en gardant une distance) ou vers le titre au repos.
    const rest = restBeam(layout);
    let targetAngle = rest.angle;
    let targetLength = rest.length;
    if (C.beam.followCursor && spot.target > 0.5 && !layout.mobile) {
      const dx = spot.tx - layout.pin.x;
      const dy = spot.ty - layout.pin.y;
      targetAngle = Math.atan2(dy, dx);
      targetLength = Math.max(C.beam.minLength, Math.hypot(dx, dy) - C.beam.cursorGap);
    }
    const beam = state.beam;
    if (!beam.ready) {
      beam.angle = targetAngle;
      beam.length = targetLength;
      beam.ready = true;
    } else {
      const kb = 1 - Math.exp(-C.beam.response * dt);
      beam.angle += angleDelta(beam.angle, targetAngle) * kb;
      beam.length += (targetLength - beam.length) * kb;
    }
    updatePings(state, layout, world);
  };

  const frame = (now: number): void => {
    raf = window.requestAnimationFrame(frame);
    const dt = last === 0 ? 0 : Math.min((now - last) / 1000, 0.05);
    last = now;
    step(dt);
    render();
  };
  const start = (): void => {
    if (raf !== 0 || reduced || destroyed) return;
    last = 0;
    raf = window.requestAnimationFrame(frame);
  };
  const stop = (): void => {
    if (raf !== 0) window.cancelAnimationFrame(raf);
    raf = 0;
  };
  const enter = (): void => {
    if (entered) return;
    entered = true;
    state.entranceStart = state.time;
    state.nextPingAt = state.time + C.entrance.pingsAt;
    if (hiddenText) {
      hiddenText = false;
      requestAnimationFrame(() => setPhase("shown"));
    }
  };

  const intersection = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        visible = entry.isIntersecting;
        if (visible && entry.intersectionRatio >= C.entrance.triggerRatio) enter();
      }
      if (reduced) render();
      else if (visible) start();
      else stop();
    },
    { threshold: [0, C.entrance.triggerRatio, 0.6, 1] },
  );
  const resize = new ResizeObserver(() => {
    measure();
    if (raf === 0) render();
  });

  let pointer: Vec2 | null = null;
  const trackPointer = (): void => {
    if (!pointer || reduced || !pointerQuery.matches || !layout || layout.mobile) return;
    const rect = card.getBoundingClientRect();
    const x = pointer.x - rect.left;
    const y = pointer.y - rect.top;
    const inside = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;
    const spot = state.spot;
    if (inside && C.spotlight.enabled && !spotLayer) {
      const layerCanvas = document.createElement("canvas");
      const layerCtx = layerCanvas.getContext("2d");
      if (layerCtx) {
        spotLayer = { canvas: layerCanvas, ctx: layerCtx };
        sizeSpotLayer();
      }
    }
    if (spot.on < 0.02) {
      spot.x = x;
      spot.y = y;
    }
    spot.tx = x;
    spot.ty = y;
    spot.target = inside ? 1 : 0;
  };
  const onPointerMove = (event: PointerEvent): void => {
    if (reduced || !pointerQuery.matches || !layout || layout.mobile) return;
    const nx = clamp((event.clientX / window.innerWidth) * 2 - 1, -1, 1);
    const ny = clamp((event.clientY / window.innerHeight) * 2 - 1, -1, 1);
    state.targetYaw = nx * C.parallax.yawDeg * DEG;
    state.targetPitch = -ny * C.parallax.pitchDeg * DEG;
    pointer = { x: event.clientX, y: event.clientY };
    trackPointer();
  };
  const onPointerLeave = (): void => {
    pointer = null;
    state.targetYaw = 0;
    state.targetPitch = 0;
    state.spot.target = 0;
  };
  const onReduceChange = (): void => {
    reduced = reduceQuery.matches;
    if (reduced) {
      stop();
      setPhase("static");
      render();
    } else if (visible) {
      start();
    }
  };

  const setHot = (hot: boolean): void => {
    if (reduced || state.hot === hot) return;
    state.hot = hot;
    if (hot && layout) burst(state, layout, world);
  };
  const ring = (): void => {
    if (reduced) return;
    state.rippleAt = state.time;
    state.pinFlashAt = state.time;
    state.flashScale = C.click.flashBoost;
  };
  const onButtonEnter = (event: PointerEvent): void => {
    if (event.pointerType !== "touch") setHot(true);
  };
  const onButtonLeave = (): void => setHot(false);
  const onButtonFocus = (event: FocusEvent): void => {
    const el = event.currentTarget;
    if (el instanceof Element && el.matches(":focus-visible")) setHot(true);
  };
  if (button) {
    button.addEventListener("pointerenter", onButtonEnter);
    button.addEventListener("pointerleave", onButtonLeave);
    button.addEventListener("focus", onButtonFocus);
    button.addEventListener("blur", onButtonLeave);
    button.addEventListener("click", ring);
  }

  measure();
  render();
  resize.observe(card);
  resize.observe(content);
  resize.observe(titleEl);
  intersection.observe(card);
  window.addEventListener("pointermove", onPointerMove, { passive: true });
  window.addEventListener("scroll", trackPointer, { passive: true });
  document.documentElement.addEventListener("pointerleave", onPointerLeave);
  reduceQuery.addEventListener("change", onReduceChange);
  void document.fonts.ready.then(() => {
    if (destroyed) return;
    measure();
    if (raf === 0) render();
  });
  // Contours des pays : chargés à part pour ne pas alourdir le premier affichage.
  if (C.countries.enabled) {
    loadWorld()
      .then((data) => {
        if (destroyed) return;
        world = data;
        if (raf === 0) render();
      })
      .catch(() => {
        // Données indisponibles : le globe reste affiché sans les pays.
      });
  }

  return () => {
    destroyed = true;
    stop();
    intersection.disconnect();
    resize.disconnect();
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("scroll", trackPointer);
    document.documentElement.removeEventListener("pointerleave", onPointerLeave);
    reduceQuery.removeEventListener("change", onReduceChange);
    if (button) {
      button.removeEventListener("pointerenter", onButtonEnter);
      button.removeEventListener("pointerleave", onButtonLeave);
      button.removeEventListener("focus", onButtonFocus);
      button.removeEventListener("blur", onButtonLeave);
      button.removeEventListener("click", ring);
    }
    setPhase("static");
    canvas.remove();
  };
}
