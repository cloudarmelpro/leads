// Génère une fois la carte du monde en points pour le hero (features/home).
// Sorties :
//  - public/world-dots.svg : les points de terre, monochromes — servis en image et
//    recolorés par `mask-image` selon le thème (comme le monogramme) ;
//  - src/features/home/components/world-nodes.json : dimensions de la grille et
//    position des nœuds (villes) dans la même grille, pour l'overlay des arcs.
// Relancer (`node scripts/generate-world-dots.mjs`) si l'on change la densité ou les villes.
import fs from "node:fs";
import DottedMap from "dotted-map";

const NODES = {
  // Hub
  quebec: { lat: 46.81, lng: -71.21 },
  // Canada
  montreal: { lat: 45.5, lng: -73.57 },
  toronto: { lat: 43.65, lng: -79.38 },
  calgary: { lat: 51.05, lng: -114.07 },
  vancouver: { lat: 49.28, lng: -123.12 },
  // États-Unis
  newyork: { lat: 40.71, lng: -74.0 },
  chicago: { lat: 41.88, lng: -87.63 },
  losangeles: { lat: 34.05, lng: -118.24 },
  miami: { lat: 25.76, lng: -80.19 },
  // Amérique latine
  mexico: { lat: 19.43, lng: -99.13 },
  saopaulo: { lat: -23.55, lng: -46.63 },
  // Europe
  paris: { lat: 48.86, lng: 2.35 },
  london: { lat: 51.51, lng: -0.13 },
  bruxelles: { lat: 50.85, lng: 4.35 },
  berlin: { lat: 52.52, lng: 13.4 },
  madrid: { lat: 40.42, lng: -3.7 },
  // Afrique · Moyen-Orient · Asie · Océanie
  casablanca: { lat: 33.57, lng: -7.59 },
  antananarivo: { lat: -18.88, lng: 47.51 },
  dubai: { lat: 25.2, lng: 55.27 },
  mumbai: { lat: 19.08, lng: 72.88 },
  singapore: { lat: 1.35, lng: 103.82 },
  tokyo: { lat: 35.68, lng: 139.69 },
  sydney: { lat: -33.87, lng: 151.21 },
};

// Monde sans l Antarctique : cadre 84°N → 56°S — assez haut pour ne couper ni le
// Groenland ni l archipel arctique canadien (le haut de la carte est visible, sans fondu).
const GRID = { width: 230, grid: "diagonal", region: { lat: { min: -56, max: 84 }, lng: { min: -180, max: 180 } } };

const withPins = new DottedMap(GRID);
for (const [key, { lat, lng }] of Object.entries(NODES)) withPins.addPin({ lat, lng, data: { key } });

const raw = withPins.getPoints();
const nodes = {};
for (const p of raw) if (p.data?.key) nodes[p.data.key] = [Math.round(p.x * 100) / 100, Math.round(p.y * 100) / 100];

// SVG des points seuls (sans épingles : elles vivent dans l'overlay React).
const land = new DottedMap(GRID);
// Compactage : un seul `fill` sur le groupe, cercles sans attributs répétés (≈ ÷5).
const verbose = land.getSVG({ radius: 0.27, color: "#000000", shape: "circle" });
const viewBox = verbose.match(/viewBox="([^"]+)"/)[1];
const circles = [...verbose.matchAll(/<circle cx="([^"]+)" cy="([^"]+)" r="([^"]+)"/g)]
  .map(([, cx, cy, r]) => `<circle cx="${cx}" cy="${cy}" r="${r}"/>`)
  .join("");
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}"><g fill="#000">${circles}</g></svg>`;
fs.writeFileSync("public/world-dots.svg", svg);

// Le cadre de l'overlay = le viewBox du SVG (mêmes unités de grille).
const [, , vbWidth, vbHeight] = viewBox.split(" ").map(Number);
const json = JSON.stringify({ width: vbWidth, height: vbHeight, nodes }, null, 2);
fs.writeFileSync("src/features/home/components/world-nodes.json", json + "\n");
console.log(`points: ${raw.length - Object.keys(nodes).length} · grille ${vbWidth}×${vbHeight} · svg ${(svg.length / 1024).toFixed(0)} ko · nœuds: ${Object.keys(nodes).join(", ")}`);
