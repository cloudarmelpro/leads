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
  quebec: { lat: 46.81, lng: -71.21 },
  montreal: { lat: 45.5, lng: -73.57 },
  toronto: { lat: 43.65, lng: -79.38 },
  newyork: { lat: 40.71, lng: -74.0 },
  vancouver: { lat: 49.28, lng: -123.12 },
  paris: { lat: 48.86, lng: 2.35 },
};

// Monde sans l'Antarctique : cadre 80°N → 56°S, comme les cartes de tableau de bord.
const GRID = { width: 230, grid: "diagonal", region: { lat: { min: -56, max: 80 }, lng: { min: -180, max: 180 } } };

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
