"use client";

import { useEffect, useRef } from "react";

import { HERO_MAP } from "@/features/home";
import { useTheme } from "@/lib/use-theme";

type Props = { label: string };

/**
 * Carte du monde en points sous le hero Contact (maquette : `data-dotmap`). La maquette
 * chargeait d3 et un atlas depuis un CDN ; on redessine ici les 5 449 points de la carte
 * du hero de l'accueil (données locales, aucune requête tierce). Format 2,7:1, seul le
 * haut de la carte est visible ; les points proches de Montréal sont teintés en vert.
 */
export function ContactMap({ label }: Props) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const { isDark } = useTheme();

  useEffect(() => {
    const cv = canvas.current;
    const box = cv?.parentElement;
    if (!cv || !box) return;

    const raw = atob(HERO_MAP.data);
    const n = (raw.length / 3) | 0;
    const pts = new Float32Array(n * 2);
    for (let q = 0; q < n; q++) {
      const c = raw.charCodeAt(q * 3);
      const r = raw.charCodeAt(q * 3 + 1);
      pts[q * 2] = HERO_MAP.U0 + (c + 0.5 * (r & 1)) * HERO_MAP.DU;
      pts[q * 2 + 1] = HERO_MAP.V0 - r * HERO_MAP.DV;
    }
    let uMin = Infinity;
    let uMax = -Infinity;
    let vMax = -Infinity;
    for (let q = 0; q < n; q++) {
      uMin = Math.min(uMin, pts[q * 2] ?? 0);
      uMax = Math.max(uMax, pts[q * 2] ?? 0);
      vMax = Math.max(vMax, pts[q * 2 + 1] ?? 0);
    }
    const [mu, mv] = HERO_MAP.mtl;

    const draw = () => {
      const W = box.clientWidth;
      const H = box.clientHeight;
      if (!W || !H) return;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      cv.width = W * dpr;
      cv.height = H * dpr;
      const ctx = cv.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      const scale = W / (uMax - uMin + HERO_MAP.DU);
      const step = HERO_MAP.DU * scale;
      const r = Math.max(1.1, step * 0.24);
      for (let q = 0; q < n; q++) {
        const u = pts[q * 2] ?? 0;
        const v = pts[q * 2 + 1] ?? 0;
        const x = (u - uMin + HERO_MAP.DU / 2) * scale;
        const y = (vMax - v + HERO_MAP.DV) * scale;
        if (y > H + r) continue;
        const d = Math.hypot(u - mu, v - mv);
        const near = d < 0.045;
        ctx.fillStyle = near ? `rgba(48,217,140,${(0.95 - d * 14).toFixed(2)})` : isDark ? "rgba(169,188,196,0.26)" : "rgba(30,30,30,0.16)";
        ctx.beginPath();
        ctx.arc(x, y, near ? r * 1.15 : r, 0, 6.2832);
        ctx.fill();
      }
    };
    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(box);
    return () => ro.disconnect();
  }, [isDark]);

  return (
    <div role="img" aria-label={label} className="relative aspect-[2.7/1] w-full [mask-image:linear-gradient(180deg,#000_70%,transparent_100%)]">
      <canvas ref={canvas} className="absolute inset-[0px] h-full w-full" />
    </div>
  );
}
