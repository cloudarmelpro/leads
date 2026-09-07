"use client";

import createGlobe, { type COBEOptions, type Globe } from "cobe";
import { useEffect, useRef } from "react";

import { reducedMotion } from "@/lib/gsap";
import { useTheme } from "@/lib/use-theme";

type Props = {
  /** Diamètre rendu (px CSS). Le canvas est dessiné en 2× pour rester net. */
  size?: number;
  className?: string;
  /** Surcharge de palette (réglages fins, page labo). */
  palette?: Partial<COBEOptions>;
};

type Rgb = [number, number, number];
const rgb = (hex: string): Rgb => {
  const n = parseInt(hex.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

// Palette : points, halo (= fond de page, pour fondre le bord), repères (émeraude).
const DARK = { dark: 1, baseColor: rgb("#d6e2e6"), glowColor: rgb("#011823"), markerColor: rgb("#30d98c"), mapBrightness: 6 };
// Clair : sphère menthe, points sombres (variante retenue parmi trois essais, page labo).
const LIGHT = { dark: 0, baseColor: rgb("#d6ede0"), glowColor: rgb("#fdfdfd"), markerColor: rgb("#30d98c"), mapBrightness: 2.2, diffuse: 1.6 };

// Repères : Québec (siège de la clientèle), Montréal.
const MARKERS = [
  { location: [46.81, -71.21] as [number, number], size: 0.035 },
  { location: [45.5, -73.57] as [number, number], size: 0.025 },
];

// Longitude du Québec (−71°) face au spectateur au chargement (convention cobe :
// phi = π − longitude en radians).
const PHI_START = Math.PI - (-71.21 * Math.PI) / 180 + 1.1;
const THETA = 0.28;
const AUTO_SPEED = 0.0025;
const DRAG_SENSITIVITY = 0.006;

/**
 * Globe 3D à points (WebGL via `cobe`, ~5 ko). Rotation lente continue, saisie à
 * la souris avec inertie, couleurs qui suivent le thème. Immobile sous
 * `prefers-reduced-motion`. Purement décoratif : `aria-hidden`.
 */
export function Globe3D({ size = 600, className = "", palette: override }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { isDark } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const still = reducedMotion();
    let phi = PHI_START;
    let velocity = 0;
    let dragging: number | null = null;
    let globe: Globe | null = null;

    const palette = isDark ? DARK : LIGHT;
    globe = createGlobe(canvas, {
      devicePixelRatio: 2,
      width: size * 2,
      height: size * 2,
      phi,
      theta: THETA,
      diffuse: 1.2,
      mapSamples: 16000,
      markers: MARKERS,
      ...palette,
      ...override,
    });

    // Boucle d'animation : rotation continue + inertie après un glissement.
    let frame = 0;
    const tick = () => {
      if (dragging === null) {
        if (!still) phi += AUTO_SPEED + velocity;
        velocity *= 0.94;
      }
      globe?.update({ phi });
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    const onDown = (event: PointerEvent) => {
      dragging = event.clientX;
      velocity = 0;
      canvas.style.cursor = "grabbing";
    };
    const onMove = (event: PointerEvent) => {
      if (dragging === null) return;
      const delta = event.clientX - dragging;
      dragging = event.clientX;
      phi += delta * DRAG_SENSITIVITY;
      velocity = delta * DRAG_SENSITIVITY * 0.35;
    };
    const onUp = () => {
      dragging = null;
      canvas.style.cursor = "grab";
    };
    canvas.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);

    return () => {
      canvas.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      cancelAnimationFrame(frame);
      globe?.destroy();
    };
  }, [isDark, size, override]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      width={size * 2}
      height={size * 2}
      className={`block aspect-square w-full max-w-full cursor-grab touch-pan-y select-none ${className}`}
    />
  );
}
